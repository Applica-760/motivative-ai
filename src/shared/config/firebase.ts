import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

/**
 * Firebase設定
 * Feature-Sliced Design: shared/config
 * 
 * 環境変数からFirebaseの設定を読み込み、初期化する。
 * 設定が不足している場合はエラーをスローする。
 */

/**
 * 環境変数からFirebase設定を取得
 */
function getFirebaseConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  return config;
}

/**
 * Firebase設定が有効かどうかをチェック
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  
  // 必須項目のチェック
  return !!(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.appId
  );
}

/**
 * Firebaseを使用するかどうか
 */
export function shouldUseFirebase(): boolean {
  const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';
  const isConfigured = isFirebaseConfigured();
  
  if (useFirebase && !isConfigured) {
    console.warn(
      '[Firebase] VITE_USE_FIREBASE is true but Firebase is not configured. ' +
      'Please check your .env file. Falling back to LocalStorage.'
    );
    return false;
  }
  
  return useFirebase && isConfigured;
}

/**
 * Firebaseアプリのインスタンス（シングルトン）
 */
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

/**
 * Firebaseアプリを初期化
 * 
 * @throws Error Firebase設定が不足している場合
 */
export function initializeFirebase(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  const config = getFirebaseConfig();
  
  // 設定の検証
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      '[Firebase] Configuration is incomplete. ' +
      'Please check your .env file and ensure all required fields are set.'
    );
  }

  try {
    firebaseApp = initializeApp(config);
    console.log('[Firebase] App initialized successfully');
    
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error);
    throw error;
  }
}

/**
 * Firebase Authenticationのインスタンスを取得
 * 
 * @returns Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = initializeFirebase();
    auth = getAuth(app);
    
    // Emulatorの設定（開発用）
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      const emulatorUrl = import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_URL || 'http://localhost:9099';
      connectAuthEmulator(auth, emulatorUrl);
      console.log(`[Firebase] Auth Emulator connected: ${emulatorUrl}`);
    }
  }
  
  return auth;
}

/**
 * Firebase Firestoreのインスタンスを取得
 * 
 * @returns Firestore instance
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    const app = initializeFirebase();
    firestore = getFirestore(app);
    
    // Emulatorの設定（開発用）
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      const host = import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_HOST || 'localhost';
      const port = parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT || '8080', 10);
      connectFirestoreEmulator(firestore, host, port);
      console.log(`[Firebase] Firestore Emulator connected: ${host}:${port}`);
    }
  }
  
  return firestore;
}

/**
 * Firebase設定のデバッグ情報を出力
 */
export function logFirebaseConfig(): void {
  const config = getFirebaseConfig();
  
  console.log('[Firebase] Configuration status:', {
    isConfigured: isFirebaseConfigured(),
    shouldUse: shouldUseFirebase(),
    projectId: config.projectId || '(not set)',
    authDomain: config.authDomain || '(not set)',
    useEmulator: import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true',
  });
}
