import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import Directors from './pages/Directors';
import PastPresidents from './pages/PastPresidents';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Gallery2024 from './pages/Gallery2024';
import Gallery2023 from './pages/Gallery2023';
import Gallery2022 from './pages/Gallery2022';
import EventPage from './pages/EventPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:memberId" element={<MemberDetail />} />
          <Route path="/directors" element={<Directors />} />
          <Route path="/past-presidents" element={<PastPresidents />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/2024-2025" element={<Gallery2024 />} />
          <Route path="/gallery/2023-2024" element={<Gallery2023 />} />
          <Route path="/gallery/2022-2023" element={<Gallery2022 />} />
          <Route path="/gallery/:year/:eventId" element={<EventPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
