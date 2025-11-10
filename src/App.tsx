import { HomePage } from './features/home/ui';
import { ActivityProvider } from '@/features/activity';

function App() {
  return (
    <ActivityProvider>
      <HomePage />
    </ActivityProvider>
  );
}

export default App;