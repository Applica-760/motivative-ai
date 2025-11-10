import { HomePage } from './features/home/ui';

/**
 * App
 * 
 * アプリケーションのメインコンポーネント。
 * Providerの設定はapp/providersで行われているため、
 * ここでは画面コンポーネントの表示のみを担当。
 */
function App() {
  return <HomePage />;
}

export default App;