import { db, storage } from "../firebase/firebaseConfig";
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
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

function getImageExtension(image) {
  const fileNameExtension = image?.fileName?.split(".").pop();
  const uriExtension = image?.uri?.split("?")[0].split(".").pop();
  const extension = fileNameExtension || uriExtension || "jpg";

  return extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
}

async function uploadPostImage(uid, image) {
  if (!image?.uri) return null;

  const response = await fetch(image.uri);
  const blob = await response.blob();
  const extension = getImageExtension(image);
  const imagePath = `posts/${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const imageRef = ref(storage, imagePath);

  await uploadBytes(imageRef, blob, {
    contentType: image.mimeType || blob.type || "image/jpeg",
  });

  return {
    imagePath,
    imageUri: await getDownloadURL(imageRef),
  };
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

export const addPostForUser = async (uid, post) => {
  const { image, ...postFields } = post;
  const uploadedImage = await uploadPostImage(uid, image);

  return addDoc(collection(db, "posts"), {
    ...postFields,
    ...(uploadedImage || {}),
    userId: uid,
    createdAt: serverTimestamp(),
  });
};

export const deletePostForUser = (uid, postId) => {
  const postRef = doc(db, "posts", postId);

  return runTransaction(db, async (transaction) => {
    const postSnapshot = await transaction.get(postRef);
    if (!postSnapshot.exists()) return;

    const post = postSnapshot.data();

    if (post.userId !== uid) {
      throw new Error("You can only delete your own posts.");
    }

    transaction.delete(postRef);
    return post.imagePath;
  }).then(async (imagePath) => {
    if (!imagePath) return;

    try {
      await deleteObject(ref(storage, imagePath));
    } catch (error) {
      console.log("Post image deletion skipped:", error.message);
    }
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
