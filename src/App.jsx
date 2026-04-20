import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';
import RouteProgress from './components/RouteProgress';

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <RouteProgress />
      <div className="app-shell">
        <AppRoutes />
      </div>
      <BottomNav />
    </BrowserRouter>
  );
}
