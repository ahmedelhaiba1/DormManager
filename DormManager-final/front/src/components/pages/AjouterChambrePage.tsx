import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Page } from "../../App";
import { ArrowLeft } from "lucide-react";

interface AjouterChambrePageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function AjouterChambrePage({
  navigate,
  onLogout,
}: AjouterChambrePageProps) {
  const [userName, setUserName] = useState("Gestionnaire");
  const [userRole, setUserRole] = useState<"GESTIONNAIRE" | "ADMIN" | "AGENT_TECHNIQUE">("GESTIONNAIRE");

  const [numero, setNumero] = useState("");
  const [batiment, setBatiment] = useState("");
  const [typeChambre, setTypeChambre] = useState("");
  const [etage, setEtage] = useState("");
  const [prix, setPrix] = useState("");
  

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
  }, []);

  

  const handleSubmit = () => {
    if (!numero || !batiment || !typeChambre || !etage || !prix) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    fetch("http://localhost:8080/api/chambres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero,
        batiment,
        type: typeChambre,
        etage: Number(etage),
        prixMensuel: Number(prix),
        etat: "DISPONIBLE",
        userId: JSON.parse(localStorage.getItem("user") || "{}").id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de l'ajout de la chambre");
        alert("Chambre ajoutée avec succès.");
        const redirectPage = userRole === "ADMIN" ? "dashboard-admin" : "dashboard-gestionnaire";
        navigate(redirectPage);
      })
      .catch((err) => {
        console.error(err);
        alert("Impossible d'ajouter la chambre.");
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

  const goBackToDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
};

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      navigate={navigate}
      onLogout={handleLogoutLocal}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Button 
            variant="ghost" 
            className="mb-4"
            onClick={goBackToDashboard}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        <h1 className="text-2xl font-semibold mb-4">
          Ajouter une nouvelle chambre
        </h1>
        <p className="text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour ajouter une nouvelle chambre au système.</p>
       

        <Card>
          <CardHeader>
            <CardTitle>Informations de la chambre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Numéro de chambre</Label>
                <Input
                  id="numero"
                  placeholder="ex: 301"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batiment">Bâtiment</Label>
                <Input
                  id="batiment"
                  placeholder="ex: A"
                  value={batiment}
                  onChange={(e) => setBatiment(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de chambre</Label>
                <Input
                  id="type"
                  placeholder="Simple ou Double"
                  value={typeChambre}
                  onChange={(e) => setTypeChambre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etage">Étage</Label>
                <Input
                  id="etage"
                  type="number"
                  placeholder="ex: 3"
                  value={etage}
                  onChange={(e) => setEtage(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix">Prix mensuel (€)</Label>
              <Input
                id="prix"
                type="number"
                placeholder="ex: 250"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </div>

            {/* Équipements removed — not used by backend */}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  const backPage = userRole === "ADMIN" ? "dashboard-admin" : "dashboard-gestionnaire";
                  navigate(backPage);
                }}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Ajouter la chambre
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
