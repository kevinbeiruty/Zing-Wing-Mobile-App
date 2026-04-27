import { getGenerativeModel, Schema } from "firebase/ai";
import { difficulties, getXPByDifficulty, weekDays } from "../data/mockData";
import { ai } from "../firebase/firebaseConfig";

const missionResponseSchema = Schema.object({
  properties: {
    missions: Schema.array({
      items: Schema.object({
        properties: {
          title: Schema.string(),
          description: Schema.string(),
          category: Schema.string(),
          difficulty: Schema.string(),
          xp: Schema.integer(),
          routineDays: Schema.array({ items: Schema.string() }),
          reminderTime: Schema.string(),
          reason: Schema.string(),
        },
        optionalProperties: ["routineDays", "reminderTime", "reason"],
      }),
    }),
  },
});

const missionModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: missionResponseSchema,
    temperature: 0.5,
    maxOutputTokens: 4096,
  },
});

function buildMissionPrompt({ goal, weakness, category, difficulty, onboardingAnswers }, compact = false) {
  const missionCount = compact ? 2 : 3;

  return `
Create ${missionCount} personalized missions for the Zing Wing habit app.

User context:
- Main goal: ${goal || onboardingAnswers?.goal || "Build better habits"}
- Weakness/blocker: ${weakness || onboardingAnswers?.weakness || "Low motivation"}
- Preferred category: ${category}
- Preferred difficulty: ${difficulty}
- Preferred reminder: ${onboardingAnswers?.reminderPreference || "Evening"}

Rules:
- Return practical missions a student can do today or this week.
- Use only this category unless another category is strongly better: ${category}
- Difficulty must be one of: ${difficulties.join(", ")}
- XP must match (depending on difficulty): Easy=5-25, Medium=26-50, Hard=51-80.
- routineDays must contain only: ${weekDays.join(", ")}
- reminderTime must use 24-hour HH:mm format.
- title must be 3 to 6 words.
- description must be under 90 characters.
- reason must be under 140 characters.
- Do not include markdown or extra text.
`;
}

function parseMissionResponse(text) {
  const cleanedText = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanedText);
}

function normalizeMission(mission, fallbackCategory, fallbackDifficulty, index) {
  const difficulty = difficulties.includes(mission.difficulty) ? mission.difficulty : fallbackDifficulty;
  const routineDays = Array.isArray(mission.routineDays)
    ? mission.routineDays.filter((day) => weekDays.includes(day))
    : [];

  return {
    title: mission.title || `AI Mission ${index + 1}`,
    description: mission.description || mission.reason || "Complete this mission to build momentum.",
    category: mission.category || fallbackCategory,
    difficulty,
    xp: getXPByDifficulty(difficulty),
    completed: false,
    routineDays: routineDays.length > 0 ? routineDays : ["Mon", "Wed", "Fri"],
    reminderTime: /^\d{2}:\d{2}$/.test(mission.reminderTime || "") ? mission.reminderTime : "18:00",
    reason: mission.reason || "Recommended from your current goal and preferences.",
  };
}

export async function generateAIMissions(input) {
  let parsed;

  try {
    const result = await missionModel.generateContent(buildMissionPrompt(input));
    parsed = parseMissionResponse(result.response.text());
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;

    const retryResult = await missionModel.generateContent(buildMissionPrompt(input, true));
    parsed = parseMissionResponse(retryResult.response.text());
  }

  const missions = Array.isArray(parsed?.missions) ? parsed.missions : [];

  return missions
    .slice(0, 3)
    .map((mission, index) => normalizeMission(mission, input.category, input.difficulty, index));
}
