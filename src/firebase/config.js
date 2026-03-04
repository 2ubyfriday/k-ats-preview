// Firebase 설정 파일
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyADUoZswMmwhR6_rUPhqGayorvwIR5sf5c",
  authDomain: "k-ats-a9788.firebaseapp.com",
  projectId: "k-ats-a9788",
  storageBucket: "k-ats-a9788.firebasestorage.app",
  messagingSenderId: "699980032996",
  appId: "1:699980032996:web:fcb3cde3e5da2fe55c35f1",
  measurementId: "G-8R8N458YSQ"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화 (필수)
export const db = getFirestore(app);

// Analytics 초기화 (선택사항, 브라우저 환경에서만)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics 초기화 실패:', error);
  }
}

export default app;