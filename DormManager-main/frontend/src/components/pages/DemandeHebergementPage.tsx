import { useState } from 'react';
import { useEffect } from 'react';
import { FileText, ArrowLeft, Send, Calendar, Home } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Page } from '../../App';

interface DemandeHebergementPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DemandeHebergementPage({ navigate, onLogout }: DemandeHebergementPageProps) {
  const [typeChambre, setTypeChambre] = useState('');
  const [periode, setPeriode] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [motif, setMotif] = useState('');
  const [preferences, setPreferences] = useState('');
  const [userName, setUserName] = useState('Étudiant');
  const [user, setUser] = useState<any>({});


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const demandeData = {
    etudiantId: storedUser.id,
    motif,
  };

  try {
    const res = await fetch('/api/demandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demandeData),
    });

    if (!res.ok) throw new Error('Erreur lors de la soumission');

    alert("Votre demande d'hébergement a été soumise avec succès !");
    navigate('dashboard-etudiant');
  } catch (error) {
    console.error(error);
    alert('Une erreur est survenue lors de la soumission');
  }
};



    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.nom && storedUser.prenom) {
      setUserName(`${storedUser.prenom} ${storedUser.nom}`);
    }
      setUser(storedUser); //  we’ll add this state next
  }, []);

  return (
    <DashboardLayout 
      userName={userName}
      userRole="Étudiant"
      navigate={navigate}
      onLogout={onLogout} 
    >
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl mb-2">
            Nouvelle demande d'hébergement
          </h1>
          <p className="text-gray-600">
            Remplissez le formulaire pour soumettre votre demande
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Formulaire de demande
              </CardTitle>
            </CardHeader>
            <CardContent>
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Type de chambre */}
  <div className="space-y-2">
    <Label htmlFor="typeChambre">Type de chambre souhaité *</Label>
    <Select value={typeChambre} onValueChange={setTypeChambre} required>
      <SelectTrigger id="typeChambre">
        <SelectValue placeholder="Sélectionnez un type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="simple">Chambre simple (1 personne)</SelectItem>
        <SelectItem value="double">Chambre double (2 personnes)</SelectItem>
        <SelectItem value="studio">Studio individuel</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Motif */}
  <div className="space-y-2">
    <Label htmlFor="motif">Motif de la demande *</Label>
    <Textarea
      id="motif"
      placeholder="Expliquez les raisons de votre demande d'hébergement..."
      rows={4}
      value={motif}
      onChange={(e) => setMotif(e.target.value)}
      required
      className="resize-none"
    />
    <p className="text-xs text-gray-500">
      Minimum 50 caractères
    </p>
  </div>

  {/* Informations automatiques */}
  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
    <p className="text-sm mb-2 font-medium">Informations automatiques</p>
    <div className="grid md:grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-gray-600">Nom:</span>
        <span className="ml-2">{user.prenom} {user.nom}</span>
      </div>
      <div>
        <span className="text-gray-600">Matricule:</span>
        <span className="ml-2">{user.matricule || '—'}</span>
      </div>
      <div>
        <span className="text-gray-600">Email:</span>
        <span className="ml-2">{user.email}</span>
      </div>
      <div>
        <span className="text-gray-600">Date de soumission:</span>
        <span className="ml-2">{new Date().toLocaleDateString('fr-FR')}</span>
      </div>
    </div>
  </div>

  {/* Submit Buttons */}
  <div className="flex gap-3 pt-4">
    <Button 
      type="button" 
      variant="outline" 
      className="flex-1"
      onClick={() => navigate('dashboard-etudiant')}
    >
      Annuler
    </Button>
    <Button 
      type="submit" 
      className="flex-1 bg-blue-600 hover:bg-blue-700"
    >
      <Send className="w-4 h-4 mr-2" />
      Soumettre la demande
    </Button>
  </div>
</form>

            </CardContent>
          </Card>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Status Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Informations importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Les demandes sont traitées sous 5 à 7 jours ouvrables
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Vous recevrez une notification par email lors du traitement
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    La disponibilité dépend du type de chambre demandé
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tarifs indicatifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Chambre simple</span>
                  <span className="text-sm">250€/mois</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Chambre double</span>
                  <span className="text-sm">180€/mois</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Studio individuel</span>
                  <span className="text-sm">350€/mois</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Charges incluses (eau, électricité, internet)
                </p>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Conseils</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                  <li>Soumettez votre demande le plus tôt possible</li>
                  <li>Soyez précis dans votre motif</li>
                  <li>Vérifiez vos informations avant de soumettre</li>
                  <li>Consultez régulièrement vos notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
