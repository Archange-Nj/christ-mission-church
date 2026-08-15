import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Give from './pages/Give';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardLayout from './pages/admin/DashboardLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSermons from './pages/admin/AdminSermons';
import AdminEvents from './pages/admin/AdminEvents';
import AdminWorshipTimes from './pages/admin/AdminWorshipTimes';
import AdminPrayerRequests from './pages/admin/AdminPrayerRequests';
import AdminDonations from './pages/admin/AdminDonations';
import AdminContactMessages from './pages/admin/AdminContactMessages';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PublicSite() {
  return (
    <div className="flex min-h-screen flex-col bg-charcoal">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/dons" element={<Give />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 pt-32 text-center">
                <p className="font-display text-3xl font-semibold text-gold">404</p>
                <p className="text-sm text-mist">
                  Cette page n'existe pas ou plus.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/dashboard/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="sermons" element={<AdminSermons />} />
          <Route path="evenements" element={<AdminEvents />} />
          <Route path="horaires" element={<AdminWorshipTimes />} />
          <Route path="prieres" element={<AdminPrayerRequests />} />
          <Route path="dons" element={<AdminDonations />} />
          <Route path="messages" element={<AdminContactMessages />} />
        </Route>
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </>
  );
}