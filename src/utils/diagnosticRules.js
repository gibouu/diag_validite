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
  dpe: {
    nom: 'DPE (Diagnostic de Performance Énergétique)',
    obligatoire: true,
    flags: {
      travaux: "Travaux d'amélioration énergétique réalisés depuis ce diagnostic"
    }
  },
  amiante: {
    nom: 'Diagnostic Amiante',
    obligatoire: true,
    detecte: true,
    flags: {
      reamenagement: 'Réaménagement ou travaux impactant les matériaux depuis ce diagnostic'
    }
  },
  plomb: { nom: 'CREP (Plomb)', obligatoire: true, detecte: true },
  termites: { nom: 'Diagnostic Termites', obligatoire: false, detecte: true },
  gaz: { nom: 'Diagnostic Gaz', obligatoire: false },
  electricite: { nom: 'Diagnostic Électricité', obligatoire: false },
  erp: { nom: 'ERP (État des Risques et Pollutions)', obligatoire: true },
  carrez: {
    nom: 'Loi Carrez (Surface)',
    obligatoire: false,
    flags: {
      reamenagement: 'Réaménagement ayant modifié la surface depuis ce mesurage'
    }
  },
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

export const getDiagnosticValidity = (diagnostic, context, detecte = false, diagnosticDate = null) => {
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

const DPE_RANGE_START_2013 = new Date(2013, 0, 1);
const DPE_RANGE_START_2018 = new Date(2018, 0, 1);
const DPE_RANGE_START_JULY_2021 = new Date(2021, 6, 1);
const DPE_EXPIRATION_END_2017 = new Date(2022, 11, 31);
const DPE_EXPIRATION_END_JUNE_2021 = new Date(2024, 11, 31);
const AMIANTE_REGULATORY_CUTOFF = new Date(2013, 3, 1);
const PLOMB_REGULATORY_CUTOFF = new Date(2006, 3, 27);

const getDpeReglementExpiration = (diagnosticDate) => {
  if (!diagnosticDate) {
    return null;
  }

  if (diagnosticDate >= DPE_RANGE_START_2013 && diagnosticDate < DPE_RANGE_START_2018) {
    return DPE_EXPIRATION_END_2017;
  }

  if (
    diagnosticDate >= DPE_RANGE_START_2018 &&
    diagnosticDate < DPE_RANGE_START_JULY_2021
  ) {
    return DPE_EXPIRATION_END_JUNE_2021;
  }

  return null;
};

export const evaluateDiagnostics = ({
  typeBien,
  contextActuel,
  contextDiagnostics,
  anneeConstruction,
  anneeDiagnosticsGenerale,
  moisDiagnosticsGenerale,
  diagnostics,
  detections
}) => {
  const results = [];
  const aujourd = new Date();
  let alerteContexte = null;
  let incompatibiliteContexte = false;
  const generalYear = toInteger(anneeDiagnosticsGenerale);
  const generalMonthRaw =
    moisDiagnosticsGenerale || (generalYear ? '01' : null);
  const generalMonth = toInteger(generalMonthRaw);

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

    // Get diagnostic date for special validity rules
    const diagData = diagnostics?.[diag] ?? {};
    const travaux = Boolean(diagData.travaux);
    const reamenagement = Boolean(diagData.reamenagement);
    let diagnosticDate = null;
    const monthValue = diagData.month ?? (generalMonth ? generalMonthRaw : null);
    const yearValue = diagData.year ?? generalYear;

    if (monthValue && yearValue) {
      const recordMonth = toInteger(monthValue);
      const recordYear = toInteger(yearValue);
      if (recordMonth && recordYear) {
        diagnosticDate = new Date(recordYear, recordMonth - 1, 1);
      }
    }

    const validite = getDiagnosticValidity(diag, contextActuel, detecte, diagnosticDate);

    if (validite === null || !definition) {
      return;
    }

    let statut = 'manquant';
    let message = 'Diagnostic non renseigné';
    let needsRedo = false;

    if (diag === 'carrez' && contextActuel === 'vente' && validite === 'transaction') {
      if (reamenagement) {
        statut = 'expire';
        message =
          'Réaménagement déclaré : métrage Carrez à refaire avant la prochaine mise en vente';
        needsRedo = true;
      } else if (monthValue && yearValue) {
        statut = 'attention';
        message = 'Valable pour cette transaction uniquement - À refaire pour la prochaine vente';
      }
      results.push({
        diagnostic: diag,
        nom: definition.nom,
        statut,
        message,
        obligatoire: definition.obligatoire,
        needsRedo,
        detecte: false
      });
      return;
    }

    if (incompatibiliteContexte && monthValue && yearValue) {
      statut = 'incompatible';
      message = 'À REFAIRE - Diagnostic de location non valable pour vente';
      needsRedo = true;
    } else if (monthValue && yearValue) {
      const recordMonth = toInteger(monthValue);
      const recordYear = toInteger(yearValue);

      if (recordMonth && recordYear) {
        const date = diagnosticDate;
        const diffAnnees = (aujourd - date) / (1000 * 60 * 60 * 24 * 365);
        let overrideResult = null;
        let customExpiration = null;

        if (diag === 'dpe') {
          if (travaux) {
            overrideResult = {
              statut: 'expire',
              message:
                "Travaux d'amélioration énergétique réalisés : DPE à renouveler",
              needsRedo: true
            };
          } else {
            customExpiration = getDpeReglementExpiration(diagnosticDate);
          }
        }

        if (!overrideResult && diag === 'amiante') {
          if (reamenagement) {
            overrideResult = {
              statut: 'expire',
              message: 'Réaménagement déclaré : diagnostic amiante à renouveler',
              needsRedo: true
            };
          } else if (diagnosticDate && diagnosticDate < AMIANTE_REGULATORY_CUTOFF) {
            overrideResult = {
              statut: 'expire',
              message: 'Diagnostic amiante réalisé avant avril 2013 : à renouveler',
              needsRedo: true
            };
          }
        }

        if (!overrideResult && diag === 'plomb' && diagnosticDate < PLOMB_REGULATORY_CUTOFF) {
          overrideResult = {
            statut: 'expire',
            message: 'Diagnostic plomb réalisé avant le 27/04/2006 : à refaire',
            needsRedo: true
          };
        }

        if (overrideResult) {
          statut = overrideResult.statut;
          message = overrideResult.message;
          needsRedo = overrideResult.needsRedo;
        } else if (customExpiration) {
          if (aujourd > customExpiration) {
            statut = 'expire';
            needsRedo = true;
            message = `Expiré depuis ${customExpiration.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })} (limite réglementaire) - À REFAIRE`;
          } else {
            statut = 'valide';
            const moisRestants = Math.max(
              0,
              Math.round((customExpiration - aujourd) / (1000 * 60 * 60 * 24 * 30))
            );
            message = `Valide jusqu'à ${customExpiration.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })} (limite réglementaire) (${moisRestants} mois restants)`;
          }
        } else if (validite === Infinity) {
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
