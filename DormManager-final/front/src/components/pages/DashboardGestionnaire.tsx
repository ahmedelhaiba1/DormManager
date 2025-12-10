import { useEffect, useState } from "react";
import {
  FileText,
  Home,
  Users,
  AlertTriangle,
  MessageSquare,
  Check,
  X,
  Eye,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import type { Page } from "../../App";

interface DashboardGestionnaireProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface Demande {
  id: number;
  dateSoumission: string;
  statut: string;
  type: string;
  duree?: string;
  etudiant?: {
    nom: string;
    prenom: string;
    filiere?: string;
    matricule?: string;
    email?: string;
    phone?: string;
    anneeEtude?: string;
  };
}

interface Reclamation {
  id: number;
  message: string;
  statut: string;
  dateCreation: string;
  etudiantNomComplet: string;
}

interface DashboardStats {
  nbEtudiantsLoges: number;
  nbChambresDisponibles: number;
  nbDemandesEnAttente: number;
  nbReclamations: number;
}

export function DashboardGestionnaire({ navigate, onLogout }: DashboardGestionnaireProps) {
  const [userName, setUserName] = useState("Gestionnaire");

  const [stats, setStats] = useState<DashboardStats>({
    nbEtudiantsLoges: 0,
    nbChambresDisponibles: 0,
    nbDemandesEnAttente: 0,
    nbReclamations: 0,
  });

  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [searchDemandes, setSearchDemandes] = useState("");

  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loadingReclamations, setLoadingReclamations] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      navigate("landing");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.nom && user.prenom) {
      setUserName(`${user.prenom} ${user.nom}`);
    }

    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Token invalide");
      })
      .catch(() => {
        localStorage.clear();
        alert("Session expirée. Veuillez vous reconnecter.");
        navigate("landing");
      });
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:8080/api/gestionnaire/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);


  useEffect(() => {
  setLoadingDemandes(true);

  fetch("http://localhost:8080/api/demandes")
  .then(res => res.json())
  .then((data: Demande[]) => {
    const pending = data.filter(d => d.statut === "EN_ATTENTE");
    setDemandes(pending);
    })
    .catch((err) => console.error("Erreur demandes :", err))
    .finally(() => setLoadingDemandes(false));
}, []);


  useEffect(() => {
  setLoadingReclamations(true);

  fetch("http://localhost:8080/api/gestionnaire/reclamations")
  .then(res => res.json())
  .then((data: any[]) => {
    const mapped = data.map(r => ({
      id: r.id,
      message: r.message,
      // Backend now returns 'status' (from ReclamationDto) with default EN_ATTENTE
      statut: r.status || "EN_ATTENTE",
      dateCreation: r.dateEnvoi,
      etudiantNomComplet: r.etudiantNomComplet // because your DTO already contains it
    }));

    // Sort by date descending (latest first)
    mapped.sort((a, b) => {
      const da = Date.parse(String(a.dateCreation));
      const db = Date.parse(String(b.dateCreation));
      return db - da;
    });

    setReclamations(mapped);

    })
    .catch(err => console.error("Erreur réclamations :", err))
    .finally(() => setLoadingReclamations(false));
}, []);


  const handleLogout = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/auth/logout?token=${token}`, {
      method: "POST",
    }).finally(() => {
      localStorage.clear();
      navigate("landing");
    });
  };

  const handleVoirDemande = (demande: Demande) => {
    localStorage.setItem("selectedDemande", JSON.stringify(demande));
    navigate("voir-demande");
  };

  const handleAffecterDemande = (demande: Demande) => {
    localStorage.setItem("selectedDemande", JSON.stringify(demande));
    navigate("affecter-chambre");
  };

  const handleRejeterDemande = (demande: Demande) => {
    if (!window.confirm("Rejeter cette demande d'hébergement ?")) return;

    fetch(`http://localhost:8080/api/gestionnaire/demandes/${demande.id}/rejeter`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du rejet");
        setDemandes((prev) => prev.filter((d) => d.id !== demande.id));
      })
      .catch((err) => {
        console.error("Erreur rejet demande:", err);
        alert("Impossible de rejeter la demande.");
      });
  };

  // Filter demandes based on search input
  const filteredDemandes = demandes.filter((demande) => {
    const searchLower = searchDemandes.toLowerCase();
    const studentName = `${demande.etudiant?.prenom || ""} ${demande.etudiant?.nom || ""}`.toLowerCase();
    const date = demande.dateSoumission.toLowerCase();
    const filiere = (demande.etudiant?.filiere || "").toLowerCase();

    return (
      studentName.includes(searchLower) ||
      date.includes(searchLower) ||
      filiere.includes(searchLower)
    );
  });

  return (
    <DashboardLayout
      userName={userName}
      userRole="GESTIONNAIRE"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
            <p className="text-gray-600">
              Gérez les demandes, affectations, chambres et réclamations du foyer
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("ajouter-chambre")}
          >
            Ajouter une chambre
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Étudiants logés</p>
                  <p className="text-3xl">{stats.nbEtudiantsLoges}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chambres disponibles</p>
                  <p className="text-3xl">{stats.nbChambresDisponibles}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Demandes en attente</p>
                  <p className="text-3xl">
                    {loadingDemandes ? "..." : stats.nbDemandesEnAttente}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Réclamations en attente</p>
                  <p className="text-3xl">{stats.nbReclamations}</p>
                  <p className="text-xs text-red-600 mt-1">
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Demandes en attente
                </CardTitle>
                <Input
                  placeholder="Rechercher par nom, date ou filière..."
                  className="w-64"
                  value={searchDemandes}
                  onChange={(e) => setSearchDemandes(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Filière</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDemandes ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Chargement des demandes...
                      </TableCell>
                    </TableRow>
                  ) : filteredDemandes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        {searchDemandes ? "Aucune demande correspondant à votre recherche" : "Aucune demande en attente"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDemandes.map((demande) => (
                      <TableRow key={demande.id}>
                        <TableCell>
                          {demande.etudiant?.prenom} {demande.etudiant?.nom}
                        </TableCell>
                        <TableCell>{demande.dateSoumission}</TableCell>
                        <TableCell>{demande.etudiant?.filiere || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              demande.statut === "EN_ATTENTE"
                                ? "bg-yellow-100 text-yellow-800"
                                : demande.statut === "VALIDEE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {demande.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVoirDemande(demande)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAffecterDemande(demande)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejeterDemande(demande)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Réclamations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingReclamations ? (
                  <p className="text-sm text-gray-500">Chargement des réclamations...</p>
                ) : reclamations.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune réclamation récente</p>
                ) : (
                  reclamations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm">{rec.message}</p>
                          <Badge
                            className={
                              rec.statut === "EN_ATTENTE"
                                ? "bg-yellow-100 text-yellow-800"
                                : rec.statut === "EN_COURS"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {rec.statut === "EN_ATTENTE" ? "En attente" : rec.statut === "EN_COURS" ? "En cours" : rec.statut}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {rec.etudiantNomComplet} • {rec.dateCreation}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        {/* Working-on-it button — calls backend API to update status to EN_COURS */}
                        <button
                          title="Prendre en charge"
                          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                          onClick={() => {
                            fetch(`http://localhost:8080/api/gestionnaire/reclamations/${rec.id}/prendre-en-charge`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                            })
                              .then((res) => {
                                if (!res.ok) throw new Error("Erreur lors de la mise à jour");
                                return res.json();
                              })
                              .then((updated) => {
                                // Update local state with response from backend
                                setReclamations((prev) =>
                                  prev.map((r) =>
                                    r.id === rec.id
                                      ? { ...r, statut: updated.status || "EN_COURS" }
                                      : r,
                                  ),
                                );
                              })
                              .catch((err) => {
                                console.error("Erreur:", err);
                                alert("Impossible de mettre à jour la réclamation.");
                              });
                          }}
                        >
                          <Wrench className="w-4 h-4 text-gray-700" />
                        </button>

                        {/* Resolved button — calls backend API to update status to RESOLUE */}
                        <button
                          title="Marquer comme résolue"
                          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                          onClick={() => {
                            fetch(`http://localhost:8080/api/gestionnaire/reclamations/${rec.id}/resoudre`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                            })
                              .then((res) => {
                                if (!res.ok) throw new Error("Erreur lors de la mise à jour");
                                return res.json();
                              })
                              .then((updated) => {
                                // Update local state with response from backend
                                setReclamations((prev) =>
                                  prev.map((r) =>
                                    r.id === rec.id
                                      ? { ...r, statut: updated.status || "RESOLUE" }
                                      : r,
                                  ),
                                );
                              })
                              .catch((err) => {
                                console.error("Erreur:", err);
                                alert("Impossible de mettre à jour la réclamation.");
                              });
                          }}
                        >
                          <CheckCircle className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
