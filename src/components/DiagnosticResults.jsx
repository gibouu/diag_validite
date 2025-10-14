import PropTypes from 'prop-types';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';

const statusIconMap = {
  valide: <CheckCircle className="h-5 w-5 text-green-600" />,
  expire: <AlertCircle className="h-5 w-5 text-red-600" />,
  incompatible: <AlertTriangle className="h-5 w-5 text-orange-600" />,
  attention: <Info className="h-5 w-5 text-blue-600" />,
  manquant: <Clock className="h-5 w-5 text-gray-400" />
};

const statusColorMap = {
  valide: 'border-green-200 bg-green-50',
  expire: 'border-red-200 bg-red-50',
  incompatible: 'border-orange-200 bg-orange-50',
  attention: 'border-blue-200 bg-blue-50',
  manquant: 'border-slate-200 bg-slate-50'
};

const DiagnosticResults = ({ results, diagnosticsARefaire, alerteContexte }) => {
  if (!results.length) {
    return null;
  }

  return (
    <section className="mx-auto mt-8 max-w-5xl px-4">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Résultats de l&apos;analyse</h2>
          {diagnosticsARefaire > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
              {diagnosticsARefaire} à refaire
            </span>
          )}
        </div>

        {alerteContexte && (
          <div
            className={`mb-4 rounded-lg border-2 p-4 font-semibold ${
              alerteContexte.type === 'error'
                ? 'border-red-300 bg-red-50 text-red-800'
                : 'border-green-300 bg-green-50 text-green-800'
            }`}
          >
            {alerteContexte.message}
          </div>
        )}

        <div className="space-y-3">
          {results.map((resultat) => (
            <div
              key={resultat.diagnostic}
              className={`rounded-lg border-2 p-4 ${statusColorMap[resultat.statut]}`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    {statusIconMap[resultat.statut] ?? statusIconMap.manquant}
                    <h3 className="text-lg font-semibold text-gray-800">{resultat.nom}</h3>
                    {resultat.obligatoire && (
                      <span className="inline-flex rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                        Obligatoire
                      </span>
                    )}
                    {resultat.needsRedo && (
                      <span className="inline-flex rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                        À REFAIRE
                      </span>
                    )}
                    {resultat.detecte && (
                      <span className="inline-flex rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                        Détecté
                      </span>
                    )}
                  </div>
                  <p className="ml-7 text-sm text-gray-700">{resultat.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

DiagnosticResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      diagnostic: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      statut: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      obligatoire: PropTypes.bool,
      needsRedo: PropTypes.bool,
      detecte: PropTypes.bool
    })
  ).isRequired,
  diagnosticsARefaire: PropTypes.number.isRequired,
  alerteContexte: PropTypes.shape({
    type: PropTypes.oneOf(['error', 'success']).isRequired,
    message: PropTypes.string.isRequired
  })
};

DiagnosticResults.defaultProps = {
  alerteContexte: null
};

export default DiagnosticResults;
