import { useState } from 'react';
import { Building2, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import type { Page } from '../../App';

interface RegistrationPageProps {
  navigate: (page: Page) => void;
}

export function RegistrationPage({ navigate }: RegistrationPageProps) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [matricule, setMatricule] = useState('');
  const [filiere, setFiliere] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  const studentData = {
    nom,
    prenom,
    email,
    matricule,
    filiere,
    motDePasse: password,
  };

  try {
    const res = await fetch("http://localhost:8081/api/etudiants/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });

    if (!res.ok) throw new Error("Erreur lors de l'inscription");

    const result = await res.json();

    // Save user + token like login
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);

    // Redirect to student dashboard
    navigate("dashboard-etudiant");

  } catch (err) {
    console.error(err);
    alert("Une erreur est survenue lors de l'inscription");
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

      <Card className="w-full max-w-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl">DormManager</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">
            Inscription Étudiant
          </h1>
          <p className="text-gray-600">
            Créez votre compte pour accéder aux services de logement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                type="text"
                placeholder="Dupont"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                type="text"
                placeholder="Jean"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email universitaire *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@universite.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Academic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule *</Label>
              <Input
                id="matricule"
                type="text"
                placeholder="20241234"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filiere">Filière *</Label>
              <Input
                id="filiere"
                type="text"
                placeholder="Informatique"
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
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
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Assurez-vous d'utiliser votre email universitaire officiel. 
              Votre matricule doit correspondre à celui de votre carte étudiante.
            </p>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            S'inscrire
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <button 
              onClick={() => navigate('login')}
              className="text-blue-600 hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
