import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Page } from "../../App";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UserFormulePageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export function UserFormulePage({ navigate, onLogout }: UserFormulePageProps) {
  const [userName, setUserName] = useState("Administrateur");
  const [userRole, setUserRole] = useState<"GESTIONNAIRE" | "ADMIN" | "AGENT_TECHNIQUE">("ADMIN");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.nom && user.prenom) {
        setUserName(`${user.prenom} ${user.nom}`);
      }
      if (user.role) {
        setUserRole(user.role);
      }
    }

    // Get the user to edit from sessionStorage (passed from DashboardAdmin)
    const userToEdit = sessionStorage.getItem("editingUser");
    if (userToEdit) {
      const user = JSON.parse(userToEdit);
      setEditingUser(user);
      setNom(user.nom);
      setPrenom(user.prenom);
      setEmail(user.email);
      setRole(user.role);
      sessionStorage.removeItem("editingUser");
    }
    setLoading(false);
  }, []);

  const handleSubmit = () => {
    if (!nom || !prenom || !email || !role) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    if (!editingUser) {
      alert("Erreur: Aucun utilisateur à modifier.");
      return;
    }

    const updateData = {
      nom,
      prenom,
      email,
      role,
    };

    fetch(`http://localhost:8080/api/utilisateurs/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'utilisateur");
        alert("Utilisateur modifié avec succès.");
        navigate("dashboard-admin");
      })
      .catch((err) => {
        console.error(err);
        alert("Impossible de modifier l'utilisateur.");
      });
  };

  const handleLogoutLocal = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/auth/logout?token=${token}`, {
      method: "POST",
    }).finally(() => {
      localStorage.clear();
      navigate("landing");
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!editingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: Aucun utilisateur sélectionné</p>
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('dashboard-admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      navigate={navigate}
      onLogout={handleLogoutLocal}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('dashboard-admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        <h1 className="text-2xl font-semibold mb-4">Modifier l'utilisateur</h1>
        <p className="text-gray-600 mt-2">Mettez à jour les informations de l'utilisateur ci-dessous.</p>
        

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  placeholder="ex: Dupont"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  placeholder="ex: Jean"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ex: jean@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Rôle </label>
              <Select value={role} onValueChange={(value: string) => setRole(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GESTIONNAIRE">Gestionnaire</SelectItem>
                  <SelectItem value="AGENT_TECHNIQUE">Agent Technique</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="ETUDIANT">Etudiant</SelectItem>       
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("dashboard-admin")}
              >
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
