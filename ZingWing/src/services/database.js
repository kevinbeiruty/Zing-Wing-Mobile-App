import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}

export const createUserProfile = (uid, profile) => {
  return setDoc(doc(db, "users", uid), {
    ...profile,
    totalXP: profile.totalXP || 0,
    createdAt: serverTimestamp(),
  });
};

export const saveUserOnboardingAnswers = (uid, onboardingAnswers) => {
  return updateDoc(doc(db, "users", uid), {
    onboardingAnswers,
  });
};

export const listenUserProfile = (uid, onData, onError) => {
  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => {
      onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    onError
  );
};

export const listenUserMissions = (uid, onData, onError) => {
  const missionsQuery = query(collection(db, "users", uid, "missions"), orderBy("createdAt", "desc"));
  return onSnapshot(missionsQuery, (snapshot) => onData(mapSnapshot(snapshot)), onError);
};

export const addMissionForUser = (uid, mission) => {
  return addDoc(collection(db, "users", uid, "missions"), {
    ...mission,
    completed: false,
    createdAt: serverTimestamp(),
  });
};

export const updateMissionForUser = (uid, missionId, updates) => {
  return updateDoc(doc(db, "users", uid, "missions", missionId), updates);
};

export const deleteMissionForUser = (uid, missionId) => {
  return deleteDoc(doc(db, "users", uid, "missions", missionId));
};

export const completeMissionForUser = (uid, mission) => {
  const missionRef = doc(db, "users", uid, "missions", mission.id);
  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (transaction) => {
    const missionSnapshot = await transaction.get(missionRef);
    if (!missionSnapshot.exists() || missionSnapshot.data().completed) return;

    transaction.update(missionRef, { completed: true });
    transaction.update(userRef, { totalXP: increment(mission.xp || 0) });
  });
};

export const addPostForUser = (uid, post) => {
  return addDoc(collection(db, "posts"), {
    ...post,
    userId: uid,
    createdAt: serverTimestamp(),
  });
};

export const listenPostsForUser = (uid, onData, onError) => {
  let publicPosts = [];
  let userPosts = [];

  function emitPosts() {
    const postsById = new Map();
    [...publicPosts, ...userPosts].forEach((post) => postsById.set(post.id, post));
    onData(sortByCreatedAtDesc([...postsById.values()]));
  }

  const unsubscribePublic = onSnapshot(
    query(collection(db, "posts"), where("visibility", "==", "public")),
    (snapshot) => {
      publicPosts = mapSnapshot(snapshot);
      emitPosts();
    },
    onError
  );

  const unsubscribeUser = onSnapshot(
    query(collection(db, "posts"), where("userId", "==", uid)),
    (snapshot) => {
      userPosts = mapSnapshot(snapshot);
      emitPosts();
    },
    onError
  );

  return () => {
    unsubscribePublic();
    unsubscribeUser();
  };
};

export const listenLeaderboard = (filter, currentUserCountry, onData, onError) => {
  const usersRef = collection(db, "users");
  const leaderboardQuery = filter === "country"
    ? query(usersRef, where("country", "==", currentUserCountry || ""))
    : query(usersRef, orderBy("totalXP", "desc"), limit(10));

  return onSnapshot(
    leaderboardQuery,
    (snapshot) => {
      const users = mapSnapshot(snapshot)
        .map((user) => ({
          ...user,
          xp: user.totalXP || 0,
        }))
        .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));

      onData(filter === "country" ? users.slice(0, 10) : users);
    },
    onError
  );
};
