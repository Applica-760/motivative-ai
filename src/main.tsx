import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. このCSSインポートがNormalizeとGlobalStylesの役割を担います
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { AuthProvider } from '@/features/auth';
import { MockAuthService, FirebaseAuthService } from '@/features/auth/api';
import { StorageProviderWithAuth } from '@/shared/services/storage';
import { shouldUseFirebase, logFirebaseConfig } from '@/shared/config/firebase';
import App from './App.tsx';
// (index.css など他のCSSインポート)

const theme = createTheme({
  fontFamily: '"Noto Sans JP", sans-serif',
  headings: { fontFamily: '"Noto Sans JP", sans-serif' },
});

// Firebase設定のデバッグ情報を出力
logFirebaseConfig();

// 認証サービスの選択（環境変数に応じて自動切り替え）
const authService = shouldUseFirebase()
  ? new FirebaseAuthService()
  : new MockAuthService();

console.log(
  `[App] Using ${shouldUseFirebase() ? 'Firebase' : 'Mock'} authentication service`
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AuthProvider service={authService}>
        <StorageProviderWithAuth>
          <App />
        </StorageProviderWithAuth>
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>,
);