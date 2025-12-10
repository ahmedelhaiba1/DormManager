import { useEffect, useState } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegistrationPage } from './components/pages/RegistrationPage';
import { DashboardEtudiant } from './components/pages/DashboardEtudiant';
import { DashboardGestionnaire } from './components/pages/DashboardGestionnaire';
import { DashboardAgentTechnique } from './components/pages/DashboardAgentTechnique';
import { DashboardAdmin } from './components/pages/DashboardAdmin';
import { ReclamationPage } from './components/pages/ReclamationPage';
import { ChambreDetailsPage } from './components/pages/ChambreDetailsPage';
import { IncidentDetailsPage } from './components/pages/IncidentDetailsPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { DemandeHebergementPage } from './components/pages/DemandeHebergementPage';

export type UserRole = 'etudiant' | 'gestionnaire' | 'admin' | 'agent_technique' | null;

export type Page = 
  | 'landing' 
  | 'login'
  | 'registration'
  | 'dashboard-etudiant' 
  | 'dashboard-gestionnaire'
  | 'dashboard-admin'
  | 'dashboard-agent'
  | 'reclamation'
  | 'chambre-details'
  | 'incident-details'
  | 'notifications'
  | 'demande-hebergement'
  | 'loading'; // ✅ temporary state while verifying session

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const navigate = (page: Page) => setCurrentPage(page);

  // ✅ Login handler (still used from LoginPage)
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    switch (role) {
      case 'etudiant':
        setCurrentPage('dashboard-etudiant');
        break;
      case 'gestionnaire':
        setCurrentPage('dashboard-gestionnaire');
        break;
      case 'admin':
        setCurrentPage('dashboard-admin');
        break;
      case 'agent_technique':
        setCurrentPage('dashboard-agent');
        break;
      default:
        setCurrentPage('landing');
    }
  };

  // ✅ Global logout clears everything
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserRole(null);
        setCurrentPage('landing');
      });
  };

  // ✅ Restore session when reloading
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) return; // No session stored

    const user = JSON.parse(storedUser);
    setCurrentPage('loading'); // temporary spinner while verifying

    fetch(`http://localhost:8081/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalid');
        // ✅ If token valid → restore corresponding dashboard
        switch (user.role.toUpperCase()) {
          case 'ETUDIANT':
            setCurrentPage('dashboard-etudiant');
            setUserRole('etudiant');
            break;
          case 'GESTIONNAIRE':
            setCurrentPage('dashboard-gestionnaire');
            setUserRole('gestionnaire');
            break;
          case 'ADMIN':
            setCurrentPage('dashboard-admin');
            setUserRole('admin');
            break;
          case 'AGENT_TECHNIQUE':
            setCurrentPage('dashboard-agent');
            setUserRole('agent_technique');
            break;
          default:
            setCurrentPage('landing');
        }
      })
      .catch(() => {
        // ❌ Token expired or invalid
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserRole(null);
        setCurrentPage('landing');
      });
  }, []);

  // ✅ Optional: a simple “loading” state while verifying session
  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'landing' && <LandingPage navigate={navigate} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} navigate={navigate} />}
      {currentPage === 'registration' && <RegistrationPage navigate={navigate} />}
      {currentPage === 'dashboard-etudiant' && <DashboardEtudiant navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'dashboard-gestionnaire' && <DashboardGestionnaire navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'dashboard-admin' && <DashboardAdmin navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'dashboard-agent' && <DashboardAgentTechnique navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'reclamation' && <ReclamationPage navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'chambre-details' && <ChambreDetailsPage navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'incident-details' && <IncidentDetailsPage navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'notifications' && <NotificationsPage navigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'demande-hebergement' && <DemandeHebergementPage navigate={navigate} onLogout={handleLogout} />}
    </div>
  );
}
