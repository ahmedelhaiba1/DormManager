import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Page } from '../../App';

interface CreateUserPageProps {
  navigate: (page: Page) => void;
  onUserCreated?: () => void;
}

export function CreateUserPage({ navigate, onUserCreated }: CreateUserPageProps) {
  const [userName, setUserName] = useState('Administrateur');
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'GESTIONNAIRE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.nom && user.prenom) {
        setUserName(`${user.prenom} ${user.nom}`);
      }
    }
  }, []);

  const handleCreateUser = async () => {
    setError('');
    setSuccess('');
    
    // Validate form
    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || 'Erreur lors de la création de l\'utilisateur');
        return;
      }

      setSuccess('Utilisateur créé avec succès!');
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'GESTIONNAIRE' });
      
      if (onUserCreated) {
        onUserCreated();
      }

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('dashboard-admin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      userName={userName}
      userRole="ADMIN"
      navigate={navigate}
      onLogout={() => {
        localStorage.clear();
        navigate('landing');
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('dashboard-admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold">Créer un nouvel utilisateur</h1>
          <p className="text-gray-600 mt-2">Ajoutez un gestionnaire, agent technique ou administrateur</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Nom *</label>
                <Input
                  type="text"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Prénom *</label>
                <Input
                  type="text"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Email *</label>
              <Input
                type="email"
                placeholder="jean.dupont@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Mot de passe *</label>
              <Input
                type="password"
                placeholder="Min 6 caractères"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Le mot de passe doit contenir au moins 6 caractères</p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Rôle *</label>
              <Select value={form.role} onValueChange={(value: string) => setForm({ ...form, role: value })} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GESTIONNAIRE">Gestionnaire</SelectItem>
                  <SelectItem value="AGENT_TECHNIQUE">Agent Technique</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between gap-4 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => navigate('dashboard-admin')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleCreateUser}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
