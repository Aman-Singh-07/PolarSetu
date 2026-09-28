import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Expeditions from './pages/Expeditions';
import ExpeditionDetail from './pages/ExpeditionDetail';
import ResourceDetail from './pages/ResourceDetail';
import Media from './pages/Media';
import MapPage from './pages/MapPage';
import AskAI from './pages/AskAI';
import Outreach from './pages/Outreach';
import Admin from './pages/Admin';
import AdminUpload from './pages/AdminUpload';
import AdminReview from './pages/AdminReview';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="explore" element={<Explore />} />
          <Route path="expeditions" element={<Expeditions />} />
          <Route path="expeditions/:id" element={<ExpeditionDetail />} />
          <Route path="research/:id" element={<ResourceDetail />} />
          <Route path="media" element={<Media />} />
          <Route path="map" element={<MapPage />} />
          <Route path="ai" element={<AskAI />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/upload" element={<AdminUpload />} />
          <Route path="admin/review" element={<AdminReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
