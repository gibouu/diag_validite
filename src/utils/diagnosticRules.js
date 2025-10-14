export const propertyTypeOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'commercial', label: 'Local Commercial' },
  { value: 'professionnel', label: 'Local Professionnel' },
  { value: 'cave', label: 'Cave' },
  { value: 'parking', label: 'Parking' }
];

export const contextOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' }
];

export const diagnosticOriginOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
  { value: 'nouveau', label: 'Pas encore de diagnostics' }
];

export const months = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Fév' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Avr' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juil' },
  { value: '08', label: 'Aoû' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Déc' }
];

export const diagnosticDefinitions = {
  dpe: { nom: 'DPE (Diagnostic de Performance Énergétique)', obligatoire: true },
  amiante: { nom: 'Diagnostic Amiante', obligatoire: true, detecte: true },
  plomb: { nom: 'CREP (Plomb)', obligatoire: true, detecte: true },
  termites: { nom: 'Diagnostic Termites', obligatoire: false, detecte: true },
  gaz: { nom: 'Diagnostic Gaz', obligatoire: false },
  electricite: { nom: 'Diagnostic Électricité', obligatoire: false },
  erp: { nom: 'ERP (État des Risques et Pollutions)', obligatoire: true },
  carrez: { nom: 'Loi Carrez (Surface)', obligatoire: false },
  boutin: { nom: 'Loi Boutin (Surface)', obligatoire: false }
};

const toInteger = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getApplicableDiagnostics = (typeBien, context, annee) => {
  const year = toInteger(annee);
  const diags = new Set();

  const add = (key) => diags.add(key);

  const addDpe = () => add('dpe');
  const addErp = () => add('erp');
  const addAmiante = () => {
    if (!year || year < 1997) add('amiante');
  };
  const addPlomb = () => {
    if (!year || year < 1949) add('plomb');
  };
  const addElectricite = () => add('electricite');
  const addGaz = () => add('gaz');
  const addTermites = () => add('termites');
  const addCarrez = () => add('carrez');
  const addBoutin = () => add('boutin');

  if (typeBien === 'appartement' || typeBien === 'maison') {
    if (context === 'vente') {
      addDpe();
      addPlomb();
      addAmiante();
      addElectricite();
      addGaz();
      addTermites();
      addErp();
      if (typeBien === 'appartement') addCarrez();
    } else if (context === 'location') {
      addDpe();
      addPlomb();
      addAmiante();
      addElectricite();
      addGaz();
      addErp();
      if (typeBien === 'appartement') addCarrez();
      addBoutin();
    }
  }

  if (typeBien === 'commercial' || typeBien === 'professionnel') {
    if (context === 'vente') {
      addDpe();
      addCarrez();
      addErp();
      addAmiante();
      addTermites();
    } else if (context === 'location') {
      addDpe();
      addErp();
      addAmiante();
    }
  }

  if (typeBien === 'cave' || typeBien === 'parking') {
    addAmiante();
    addTermites();
    addErp();
  }

  return Array.from(diags);
};

export const getDiagnosticValidity = (diagnostic, context, detecte = false) => {
  const validites = {
    dpe: { vente: 10, location: 10 },
    amiante: { vente: detecte ? 3 : Infinity, location: detecte ? 3 : Infinity },
    plomb: { vente: detecte ? 1 : Infinity, location: detecte ? 6 : Infinity },
    termites: { vente: 0.5, location: 0.5 },
    gaz: { vente: 3, location: 6 },
    electricite: { vente: 3, location: 6 },
    erp: { vente: 0.5, location: 0.5 },
    carrez: { vente: 'transaction', location: Infinity },
    boutin: { vente: null, location: Infinity }
  };

  return validites[diagnostic]?.[context] ?? null;
};

const formatExpirationDate = (startDate, validityYears) => {
  const expiration = new Date(startDate);
  expiration.setMonth(expiration.getMonth() + Math.round(validityYears * 12));
  return expiration;
};

export const evaluateDiagnostics = ({
  typeBien,
  contextActuel,
  contextDiagnostics,
  anneeConstruction,
  diagnostics,
  detections
}) => {
  const results = [];
  const aujourd = new Date();
  let alerteContexte = null;
  let incompatibiliteContexte = false;

  if (contextDiagnostics === 'location' && contextActuel === 'vente') {
    incompatibiliteContexte = true;
    alerteContexte = {
      type: 'error',
      message:
        '⚠️ ATTENTION : Les diagnostics réalisés pour une LOCATION ne peuvent PAS être utilisés pour une VENTE. Vous devez refaire TOUS les diagnostics pour la vente.'
    };
  } else if (contextDiagnostics === 'vente' && contextActuel === 'location') {
    alerteContexte = {
      type: 'success',
      message:
        "✅ Les diagnostics réalisés pour une VENTE peuvent être utilisés pour une LOCATION (s'ils sont encore valides)."
    };
  }

  const diagnosticsApplicables = getApplicableDiagnostics(
    typeBien,
    contextActuel,
    anneeConstruction
  );

  diagnosticsApplicables.forEach((diag) => {
    const definition = diagnosticDefinitions[diag];
    const detecte = Boolean(detections?.[diag]);
    const validite = getDiagnosticValidity(diag, contextActuel, detecte);

    if (validite === null || !definition) {
      return;
    }

    const diagData = diagnostics?.[diag];
    let statut = 'manquant';
    let message = 'Diagnostic non renseigné';
    let needsRedo = false;

    if (diag === 'carrez' && contextActuel === 'vente' && validite === 'transaction') {
      if (diagData?.year && diagData?.month) {
        statut = 'attention';
        message = 'Valable pour cette transaction uniquement - À refaire pour la prochaine vente';
      }
      results.push({
        diagnostic: diag,
        nom: definition.nom,
        statut,
        message,
        obligatoire: definition.obligatoire,
        needsRedo: false,
        detecte: false
      });
      return;
    }

    if (incompatibiliteContexte && diagData?.year && diagData?.month) {
      statut = 'incompatible';
      message = 'À REFAIRE - Diagnostic de location non valable pour vente';
      needsRedo = true;
    } else if (diagData?.year && diagData?.month) {
      const recordMonth = toInteger(diagData.month);
      const recordYear = toInteger(diagData.year);

      if (recordMonth && recordYear) {
        const date = new Date(recordYear, recordMonth - 1, 1);
        const diffAnnees = (aujourd - date) / (1000 * 60 * 60 * 24 * 365);

        if (validite === Infinity) {
          statut = 'valide';
          message = 'Valide indéfiniment';
        } else if (typeof validite === 'number') {
          if (diffAnnees > validite) {
            statut = 'expire';
            const expiration = formatExpirationDate(date, validite);
            message = `Expiré depuis ${expiration.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })} - À REFAIRE`;
            needsRedo = true;
          } else {
            statut = 'valide';
            const expiration = formatExpirationDate(date, validite);
            const moisRestants = Math.max(
              0,
              Math.round((expiration - aujourd) / (1000 * 60 * 60 * 24 * 30))
            );
            message = `Valide jusqu'à ${expiration.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })} (${moisRestants} mois restants)`;
          }
        }
      }
    }

    results.push({
      diagnostic: diag,
      nom: definition.nom,
      statut,
      message,
      obligatoire: definition.obligatoire,
      needsRedo,
      detecte
    });
  });

  return {
    results,
    alerteContexte
  };
};
