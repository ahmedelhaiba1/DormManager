import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Page } from "../../App";

interface AffecterChambrePageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface Demande {
  id: number;
  dateSoumission: string;
  statut: string;
  // type and duree removed from UI; backend uses demande id to fetch needed info
  etudiant?: {
    nom: string;
    prenom: string;
    filiere?: string;
    matricule?: string;
  };
}

interface Chambre {
  id: number;
  numero: string;
  batiment: string;
  type: string;
}

export function AffecterChambrePage({
  navigate,
  onLogout,
}: AffecterChambrePageProps) {
  const [userName, setUserName] = useState("Gestionnaire");
  const [demande, setDemande] = useState<Demande | null>(null);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [selectedChambreId, setSelectedChambreId] = useState<string>("");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [remarque, setRemarque] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.nom && user.prenom) {
        setUserName(`${user.prenom} ${user.nom}`);
      }
    }

    const storedDemande = localStorage.getItem("selectedDemande");
    if (!storedDemande) {
      navigate("dashboard-gestionnaire");
      return;
    }
    const d: Demande = JSON.parse(storedDemande);
    setDemande(d);

    // Fetch all available rooms (no type filter)
    fetch(`http://localhost:8080/api/gestionnaire/chambres/disponibles`)
      .then((res) => res.json())
      .then((data: Chambre[]) => setChambres(data))
      .catch((err) => console.error("Erreur chargement chambres", err));
  }, [navigate]);

  const handleLogoutLocal = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/auth/logout?token=${token}`, {
      method: "POST",
    }).finally(() => {
      localStorage.clear();
      navigate("landing");
    });
  };

  const handleSubmit = () => {
    if (!demande || !selectedChambreId || !dateDebut || !dateFin) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    fetch("http://localhost:8080/api/gestionnaire/demandes/affecter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demandeId: demande.id,
        chambreId: Number(selectedChambreId),
        dateDebut,
        dateFin,
        remarque: remarque || null,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de l'affectation");
        alert("Affectation enregistrée et demande validée.");
        localStorage.removeItem("selectedDemande");
        navigate("dashboard-gestionnaire");
      })
      .catch((err) => {
        console.error(err);
        alert("Impossible d'enregistrer l'affectation.");
      });
  };

  if (!demande) {
    return (
      <DashboardLayout
        userName={userName}
        userRole="GESTIONNAIRE"
        navigate={navigate}
        onLogout={handleLogoutLocal}
      >
        <p className="text-gray-600">Aucune demande sélectionnée.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={userName}
      userRole="GESTIONNAIRE"
      navigate={navigate}
      onLogout={handleLogoutLocal}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-4">
          Affecter une chambre à l'étudiant
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'étudiant</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-500">Nom complet</Label>
              <p>
                {demande.etudiant?.prenom} {demande.etudiant?.nom}
              </p>
            </div>
            <div>
              <Label className="text-gray-500">Matricule</Label>
              <p>{demande.etudiant?.matricule || "—"}</p>
            </div>
            <div>
              <Label className="text-gray-500">Filière</Label>
              <p>{demande.etudiant?.filiere || "—"}</p>
            </div>
            {/* Type de chambre demandé removed from UI */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affectation de la chambre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chambre disponible</Label>
              <Select
                value={selectedChambreId}
                onValueChange={setSelectedChambreId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une chambre" />
                </SelectTrigger>
                <SelectContent>
                  {chambres.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      Chambre {c.numero} - Bât. {c.batiment} ({c.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarque">Remarque</Label>
              <Input
                id="remarque"
                placeholder="Remarque (optionnel)"
                value={remarque}
                onChange={(e) => setRemarque(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("dashboard-gestionnaire")}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
              >
                Valider l'affectation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
