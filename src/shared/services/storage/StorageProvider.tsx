import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { StorageService } from './types';
import { LocalStorageService } from './LocalStorageService';
import { FirebaseStorageService } from './FirebaseStorageService';

/**
 * StorageContext
 * Feature-Sliced Design: shared/services
 * 
 * アプリケーション全体でStorageServiceを共有するためのReact Context。
 * ログイン状態に応じてLocalStorage/Firebaseを切り替え可能。
 */
const StorageContext = createContext<StorageService | undefined>(undefined);

/**
 * StorageProviderのProps
 */
interface StorageProviderProps {
  /** 子コンポーネント */
  children: ReactNode;
  
  /**
   * 使用するStorageServiceの実装
   * 指定しない場合は、認証状態に応じて自動切り替え
   */
  service?: StorageService;
  
  /**
   * 認証状態
   * undefined: 認証機能を使用しない（常にLocalStorage）
   * 認証オブジェクト: ログイン状態に応じて切り替え
   */
  auth?: {
    isAuthenticated: boolean;
    userId?: string;
  };
}

/**
 * StorageProvider
 * 
 * アプリケーション全体でStorageServiceを提供する。
 * 認証状態に応じてLocalStorage/Firebaseを自動切り替え。
 * 
 * @example
 * ```tsx
 * // 基本的な使用（認証なし）
 * <StorageProvider>
 *   <App />
 * </StorageProvider>
 * 
 * // 認証機能との統合
 * const { isAuthenticated, user } = useAuth();
 * <StorageProvider auth={{ isAuthenticated, userId: user?.id }}>
 *   <App />
 * </StorageProvider>
 * 
 * // カスタムサービスを直接注入
 * <StorageProvider service={new FirebaseStorageService()}>
 *   <App />
 * </StorageProvider>
 * ```
 */
export function StorageProvider({ 
  children, 
  service: customService,
  auth,
}: StorageProviderProps) {
  const [service, setService] = useState<StorageService>(() => {
    // カスタムサービスが指定されている場合はそれを使用
    if (customService) {
      return customService;
    }
    
    // 認証情報がない場合はLocalStorageを使用
    if (!auth) {
      return new LocalStorageService();
    }
    
    // 認証状態に応じて切り替え
    return auth.isAuthenticated
      ? new FirebaseStorageService(auth.userId)
      : new LocalStorageService();
  });
  
  // 認証状態の変更を監視してサービスを切り替え
  useEffect(() => {
    // カスタムサービスが指定されている場合は切り替えない
    if (customService) {
      setService(customService);
      return;
    }
    
    // 認証情報がない場合はLocalStorage固定
    if (!auth) {
      setService(new LocalStorageService());
      return;
    }
    
    // 認証状態に応じて切り替え
    const newService = auth.isAuthenticated
      ? new FirebaseStorageService(auth.userId)
      : new LocalStorageService();
    
    setService(newService);
    
    console.log(
      `[StorageProvider] Switched to ${auth.isAuthenticated ? 'Firebase' : 'LocalStorage'} storage`
    );
  }, [auth?.isAuthenticated, auth?.userId, customService]);
  
  return (
    <StorageContext.Provider value={service}>
      {children}
    </StorageContext.Provider>
  );
}

/**
 * useStorage
 * 
 * StorageServiceのインスタンスを取得するカスタムフック。
 * StorageProvider内で使用する必要がある。
 * 
 * @returns StorageService実装
 * @throws Error StorageProvider外で使用された場合
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const storage = useStorage();
 *   
 *   const loadData = async () => {
 *     const activities = await storage.getActivities();
 *     console.log(activities);
 *   };
 *   
 *   return <button onClick={loadData}>Load</button>;
 * }
 * ```
 */
export function useStorage(): StorageService {
  const context = useContext(StorageContext);
  
  if (!context) {
    throw new Error(
      'useStorage must be used within a StorageProvider. ' +
      'Wrap your component tree with <StorageProvider>.'
    );
  }
  
  return context;
}
