import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// NOTE: if you don't use react-router, ignore the import above.
// This component relies only on the `navigate` prop from App.tsx.
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Page } from "../../App";

interface VoirDemandePageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface Demande {
  id: number;
  dateSoumission: string;
  statut: string;
  motif?: string;
  etudiant?: {
    nom: string;
    prenom: string;
    filiere?: string;
    matricule?: string;
    email?: string;
    // phone and anneeEtude removed — not stored in backend
  };
}

export function VoirDemandePage({ navigate, onLogout }: VoirDemandePageProps) {
  const [userName, setUserName] = useState("Gestionnaire");
  const [demande, setDemande] = useState<Demande | null>(null);

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
    setDemande(JSON.parse(storedDemande));
  }, [navigate]);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/auth/logout?token=${token}`, {
      method: "POST",
    }).finally(() => {
      localStorage.clear();
      navigate("landing");
    });
  };

  if (!demande) {
    return (
      <DashboardLayout
        userName={userName}
        userRole="GESTIONNAIRE"
        navigate={navigate}
        onLogout={handleLogout}
      >
        <p className="text-gray-600">Aucune demande sélectionnée.</p>
      </DashboardLayout>
    );
  }

  const etu = demande.etudiant;

  return (
    <DashboardLayout
      userName={userName}
      userRole="GESTIONNAIRE"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">
            Détails de la demande #{demande.id}
          </h1>
          <Badge
            className={
              demande.statut === "EN_ATTENTE"
                ? "bg-yellow-100 text-yellow-800"
                : demande.statut === "ACCEPTEE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {demande.statut}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'étudiant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Nom complet</p>
                <p>
                  {etu?.prenom} {etu?.nom}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Matricule</p>
                <p>{etu?.matricule || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Filière</p>
                <p>{etu?.filiere || "—"}</p>
              </div>
              {/* Année d'étude removed (not stored) */}
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <p className="text-gray-500">Email</p>
                <p>{etu?.email || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations sur la demande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Date de soumission</p>
                <p>{demande.dateSoumission}</p>
              </div>
              <div>
                <p className="text-gray-500">Motif</p>
                <p>{demande.motif || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("dashboard-gestionnaire")}
          >
            Retour aux demandes
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate("affecter-chambre")}
          >
            Affecter une chambre
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
