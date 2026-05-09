import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "XXXX",
//   appId: "XXXX"
// };
const firebaseConfig = {

// apiKey: "AIzaSyALuHTmibWB6k1dyJFb26ATKCqlmOlulrY",
authDomain: "babamahakaalpg.firebaseapp.com",
projectId: "babamahakaalpg",
storageBucket: "babamahakaalpg.firebasestorage.app",
messagingSenderId: "864859697350",
appId: "1:864859697350:web:2a3cd97d8b982cd14c27c7"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
