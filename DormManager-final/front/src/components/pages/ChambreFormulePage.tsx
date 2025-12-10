import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Page } from "../../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft } from "lucide-react";

interface ChambreFormulePageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface Chambre {
  id: number;
  numero: string;
  type: string;
  capacite: number;
  etat: string;
}

export function ChambreFormulePage({ navigate, onLogout }: ChambreFormulePageProps) {
  const [userName, setUserName] = useState("Administrateur");
  const [userRole, setUserRole] = useState<"GESTIONNAIRE" | "ADMIN" | "AGENT_TECHNIQUE">("ADMIN");
  const [editingChambre, setEditingChambre] = useState<Chambre | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [numero, setNumero] = useState("");
  const [type, setType] = useState("");
  const [capacite, setCapacite] = useState("");
  const [etat, setEtat] = useState("");

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

    // Get the chambre to edit from sessionStorage (passed from DashboardAdmin)
    const chambreToEdit = sessionStorage.getItem("editingChambre");
    if (chambreToEdit) {
      const chambre = JSON.parse(chambreToEdit);
      setEditingChambre(chambre);
      setNumero(chambre.numero);
      setType(chambre.type);
      setCapacite(chambre.capacite.toString());
      setEtat(chambre.etat);
      sessionStorage.removeItem("editingChambre");
    }
    setLoading(false);
  }, []);

  const handleSubmit = () => {
    if (!numero || !type || !capacite || !etat) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    if (!editingChambre) {
      alert("Erreur: Aucune chambre à modifier.");
      return;
    }

    const updateData = {
      numero,
      type,
      capacite: Number(capacite),
      etat,
    };

    fetch(`http://localhost:8080/api/chambres/${editingChambre.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour de la chambre");
        alert("Chambre modifiée avec succès.");
        navigate("dashboard-admin");
      })
      .catch((err) => {
        console.error(err);
        alert("Impossible de modifier la chambre.");
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

  if (!editingChambre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: Aucune chambre sélectionnée</p>
          <Button onClick={() => navigate("dashboard-admin")}>Retour au dashboard</Button>
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
      <div className="max-w-3xl mx-auto space-y-6">
        <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('dashboard-admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        <h1 className="text-2xl font-semibold mb-4">Modifier la chambre</h1>
        <p className="text-gray-600 mt-2">Mettez à jour les informations de la chambre ci-dessous.</p>
        

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
                <Label htmlFor="type">Type de chambre</Label>
                <Input
                  id="type"
                  placeholder="Simple ou Double"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacite">Capacité</Label>
                <Input
                  id="capacite"
                  type="number"
                  placeholder="ex: 1 ou 2"
                  value={capacite}
                  onChange={(e) => setCapacite(e.target.value)}
                />
              </div>
              <div>
              <label className="text-sm font-medium block mb-2">État </label>
              <Select value={etat} onValueChange={(value: string) => setEtat(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                  <SelectItem value="OCCUPEE">Occupée</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>       
                </SelectContent>
              </Select>
            </div>

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
