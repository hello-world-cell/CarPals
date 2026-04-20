import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SearchScreen from '../screens/SearchScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import CarParkDetailScreen from '../screens/CarParkDetailScreen';
import NavigateScreen from '../screens/NavigateScreen';
import CheckInScreen from '../screens/CheckInScreen';
import PaymentScreen from '../screens/PaymentScreen';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SearchScreen />} />
        <Route path="/recommendations" element={<RecommendationsScreen />} />
        <Route path="/carpark/:id" element={<CarParkDetailScreen />} />
        <Route path="/navigate" element={<NavigateScreen />} />
        <Route path="/checkin" element={<CheckInScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
      </Routes>
    </AnimatePresence>
  );
}
