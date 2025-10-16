import { useEffect, useMemo, useState } from 'react';
import {
  contextOptions,
  diagnosticDefinitions,
  diagnosticOriginOptions,
  evaluateDiagnostics,
  getApplicableDiagnostics,
  months,
  propertyTypeOptions
} from '../utils/diagnosticRules.js';

const initialDetections = {
  plomb: false,
  amiante: false,
  termites: false
};

const useDiagnostics = () => {
  const [typeBien, setTypeBien] = useState('');
  const [contextActuel, setContextActuel] = useState('');
  const [contextDiagnostics, setContextDiagnostics] = useState('');
  const [anneeConstruction, setAnneeConstruction] = useState('');
  const [anneeDiagnosticsGenerale, setAnneeDiagnosticsGenerale] = useState('');
  const [moisDiagnosticsGenerale, setMoisDiagnosticsGenerale] = useState('01');
  const [diagnostics, setDiagnostics] = useState({});
  const [detections, setDetections] = useState(initialDetections);
  const [results, setResults] = useState([]);
  const [alerteContexte, setAlerteContexte] = useState(null);

  const diagnosticsApplicables = useMemo(() => {
    if (!typeBien || !contextActuel) {
      return [];
    }
    return getApplicableDiagnostics(typeBien, contextActuel, anneeConstruction);
  }, [typeBien, contextActuel, anneeConstruction]);

  const diagnosticsARefaire = useMemo(
    () => results.filter((diagnostic) => diagnostic.needsRedo).length,
    [results]
  );

  useEffect(() => {
    setResults([]);
    setAlerteContexte(null);
  }, [typeBien, contextActuel, contextDiagnostics]);

  const analyserDiagnostics = () => {
    const { results: computedResults, alerteContexte: nouvelleAlerte } = evaluateDiagnostics({
      typeBien,
      contextActuel,
      contextDiagnostics,
      anneeConstruction,
      anneeDiagnosticsGenerale,
      moisDiagnosticsGenerale,
      diagnostics,
      detections
    });

    setResults(computedResults);
    setAlerteContexte(nouvelleAlerte);
  };

  const handleMonthChange = (diag, month) => {
    setDiagnostics((prev) => ({
      ...prev,
      [diag]: {
        ...prev[diag],
        month
      }
    }));
  };

  const handleYearChange = (diag, year) => {
    setDiagnostics((prev) => {
      const previousDiag = prev[diag] || {};
      const updatedDiag = {
        ...previousDiag
      };

      if (year) {
        updatedDiag.year = year;
      } else {
        delete updatedDiag.year;
      }

      const nextDiagnostics = { ...prev };

      if (Object.keys(updatedDiag).length === 0) {
        delete nextDiagnostics[diag];
      } else {
        nextDiagnostics[diag] = updatedDiag;
      }

      return nextDiagnostics;
    });
  };

  const handleDetectionChange = (diag, checked) => {
    setDetections((prev) => ({
      ...prev,
      [diag]: checked
    }));
  };

  return {
    state: {
      typeBien,
      contextActuel,
      contextDiagnostics,
      anneeConstruction,
      anneeDiagnosticsGenerale,
      moisDiagnosticsGenerale,
      diagnostics,
      detections,
      results,
      alerteContexte,
      diagnosticsApplicables,
      diagnosticsARefaire
    },
    metadata: {
      propertyTypeOptions,
      contextOptions,
      diagnosticOriginOptions,
      months,
      diagnosticDefinitions
    },
    actions: {
      setTypeBien,
      setContextActuel,
      setContextDiagnostics,
      setAnneeConstruction,
      setAnneeDiagnosticsGenerale,
      setMoisDiagnosticsGenerale,
      analyserDiagnostics,
      handleMonthChange,
      handleYearChange,
      handleDetectionChange
    }
  };
};

export default useDiagnostics;
