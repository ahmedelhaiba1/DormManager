import { useState } from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import type { UserRole, Page } from '../../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  navigate: (page: Page) => void;
}

export function LoginPage({ onLogin, navigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('etudiant');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse: password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const user = await res.json();
    console.log('✅ Logged in:', user);

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      alert(
        `Rôle incorrect : vous avez choisi "${role}" mais votre compte est de type "${user.role.toLowerCase()}".`
      );
      return;
    }

    // ✅ Save user + token for session persistence
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);

    // ✅ Navigate by role
    switch (user.role) {
      case 'ADMIN':
        navigate('dashboard-admin');
        break;
      case 'GESTIONNAIRE':
        navigate('dashboard-gestionnaire');
        break;
      case 'AGENT_TECHNIQUE':
        navigate('dashboard-agent');
        break;
      case 'ETUDIANT':
        navigate('dashboard-etudiant');
        break;
      default:
        alert('Unknown role');
    }
  } catch (err) {
    console.error('❌ Login failed:', err);
    alert('Email ou mot de passe incorrect');
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Back to home button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6"
        onClick={() => navigate('landing')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl">DormManager</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">
            Connexion
          </h1>
          <p className="text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@universite.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Type de compte</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="etudiant">Étudiant</SelectItem>
                <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="agent_technique">Agent Technique</SelectItem>
              </SelectContent>
            </Select>
          </div>

         <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>


          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate('registration')}
            >
              S'inscrire (étudiant)
            </button>

          </p>
        </div>
      </Card>
    </div>
  );
}
