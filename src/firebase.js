import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJ8Ruy0jBEMCrBtkratov2-ZhQbQgMDvg",
  authDomain: "aiflix-9c9c0.firebaseapp.com",
  projectId: "aiflix-9c9c0",
  storageBucket: "aiflix-9c9c0.appspot.com",
  messagingSenderId: "1062633213298",
  appId: "1:1062633213298:web:98bc02ed596afe048221eb"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the root storage bucket
const storage = getStorage(firebaseApp);
 const storageRef = ref(storage);

 
export const videosRef = ref(storageRef, "videos");
export const db = getFirestore(firebaseApp);





  