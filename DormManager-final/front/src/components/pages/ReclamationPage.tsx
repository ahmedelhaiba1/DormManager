import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import type { Page } from '../../App';

interface ReclamationPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface ReclamationItem {
  id: number;
  message: string;
  dateEnvoi: string;
  status?: string;
}

export function ReclamationPage({ navigate, onLogout }: ReclamationPageProps) {
  const [userName, setUserName] = useState('Étudiant');
  const [verifying, setVerifying] = useState(true);
  const [reclamations, setReclamations] = useState<ReclamationItem[]>([]);
  const [nouvelleReclamation, setNouvelleReclamation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = 'http://localhost:8080';

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };

  const loadReclamations = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/reclamations/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des réclamations');
      const data = await res.json();
      setReclamations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      navigate('landing');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.nom && user.prenom) {
      setUserName(`${user.prenom} ${user.nom}`);
    }

    fetch(`${API_BASE}/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
        setVerifying(false);
        return loadReclamations(token);
      })
      .catch(() => {
        localStorage.clear();
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('landing');
      });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouvelleReclamation.trim()) {
      alert('Merci de saisir un message.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      navigate('landing');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reclamations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: nouvelleReclamation }),
      });
      if (!res.ok) throw new Error('Erreur lors de la création de la réclamation');
      const created = await res.json();
      setReclamations((prev) => [created, ...prev]);
      setNouvelleReclamation('');
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la création de la réclamation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={userName}
      userRole="ETUDIANT"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('dashboard-etudiant')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Mes réclamations</h1>
          <p className="text-gray-600">
            Consultez vos réclamations et envoyez un nouveau message à l'administration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Nouvelle réclamation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Nouvelle réclamation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Décrivez votre problème (chauffage, eau, bruit, etc.)"
                  value={nouvelleReclamation}
                  onChange={(e) => setNouvelleReclamation(e.target.value)}
                  rows={6}
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={submitting}
                >
                  Envoyer la réclamation
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Liste des réclamations */}
          <Card>
            <CardHeader>
              <CardTitle>Historique de mes réclamations</CardTitle>
            </CardHeader>
            <CardContent>
              {reclamations.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Vous n'avez encore soumis aucune réclamation.
                </p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {reclamations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-gray-50 rounded-lg flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            rec.status === "EN_ATTENTE"
                              ? "bg-yellow-100 text-yellow-800"
                              : rec.status === "EN_COURS"
                              ? "bg-blue-100 text-blue-800"
                              : rec.status === "RESOLUE"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {rec.status === "EN_ATTENTE"
                            ? "En attente"
                            : rec.status === "EN_COURS"
                            ? "En cours"
                            : rec.status === "RESOLUE"
                            ? "Résolue"
                            : "Envoyée"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(rec.dateEnvoi).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{rec.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
