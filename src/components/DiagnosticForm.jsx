import PropTypes from 'prop-types';
import { Info } from 'lucide-react';

const DiagnosticForm = ({ state, metadata, actions }) => {
  const {
    typeBien,
    contextActuel,
    contextDiagnostics,
    anneeConstruction,
    diagnostics,
    detections,
    diagnosticsApplicables
  } = state;

  const {
    propertyTypeOptions,
    contextOptions,
    diagnosticOriginOptions,
    months,
    diagnosticDefinitions
  } = metadata;

  const {
    setTypeBien,
    setContextActuel,
    setContextDiagnostics,
    setAnneeConstruction,
    analyserDiagnostics,
    handleMonthChange,
    handleYearChange,
    handleDetectionChange
  } = actions;

  const showAmianteInfo = anneeConstruction && parseInt(anneeConstruction, 10) >= 1997;
  const showPlombInfo = anneeConstruction && parseInt(anneeConstruction, 10) >= 1949;

  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-5">
            <div className="flex gap-3">
              <Info className="mt-1 h-5 w-5 text-blue-500" />
              <div className="space-y-2 text-sm text-blue-900">
                <p className="font-semibold">À retenir :</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Les diagnostics suivent le bien, pas le propriétaire.</li>
                  <li>Pas besoin de les refaire si non expirés lors d&apos;un changement de propriétaire.</li>
                  <li>
                    <span className="font-semibold">Exception :</span> un diagnostic de LOCATION est
                    invalide pour une VENTE.
                  </li>
                  <li>Un diagnostic de VENTE peut servir pour une LOCATION s&apos;il est toujours valide.</li>
                  <li>La détection de plomb, d&apos;amiante ou de termites réduit la durée de validité.</li>
                  <li>La loi Carrez pour une vente ne vaut que pour la transaction en cours.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="typeBien" className="mb-2 block text-sm font-semibold text-gray-700">
                Type de bien
              </label>
              <select
                id="typeBien"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500"
                value={typeBien}
                onChange={(event) => setTypeBien(event.target.value)}
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contextActuel"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Contexte actuel
              </label>
              <select
                id="contextActuel"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500"
                value={contextActuel}
                onChange={(event) => setContextActuel(event.target.value)}
              >
                {contextOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="anneeConstruction"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Année de construction{' '}
                <span className="text-xs font-normal text-gray-500">(optionnel)</span>
              </label>
              <input
                id="anneeConstruction"
                type="number"
                min="1800"
                max="2099"
                placeholder="Ex : 1985"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500"
                value={anneeConstruction}
                onChange={(event) => setAnneeConstruction(event.target.value)}
              />
            </div>
          </div>

          {typeBien && contextActuel && (
            <div className="space-y-6 border-t border-slate-200 pt-6">
              <div>
                <label
                  htmlFor="contextDiagnostics"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Contexte d&apos;origine des diagnostics existants
                </label>
                <select
                  id="contextDiagnostics"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500"
                  value={contextDiagnostics}
                  onChange={(event) => setContextDiagnostics(event.target.value)}
                >
                  {diagnosticOriginOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {contextDiagnostics && contextDiagnostics !== 'nouveau' && (
                <div className="space-y-4 rounded-lg bg-slate-50 p-5">
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Seuls les diagnostics requis pour votre bien sont listés.</p>
                    {showAmianteInfo && (
                      <p className="font-medium text-indigo-600">
                        ℹ️ Bien construit après 1997 : diagnostic amiante non requis.
                      </p>
                    )}
                    {showPlombInfo && (
                      <p className="font-medium text-indigo-600">
                        ℹ️ Bien construit après 1949 : diagnostic plomb non requis.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {diagnosticsApplicables.map((diagKey) => {
                      const definition = diagnosticDefinitions[diagKey];
                      if (!definition) {
                        return null;
                      }
                      return (
                        <div key={diagKey} className="rounded-lg bg-white p-4 shadow-sm">
                          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {definition.nom}
                                {definition.obligatoire && (
                                  <span className="ml-2 inline-flex rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                                    Obligatoire
                                  </span>
                                )}
                              </p>
                            </div>
                            {definition.detecte && (
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-indigo-600"
                                  checked={Boolean(detections[diagKey])}
                                  onChange={(event) =>
                                    handleDetectionChange(diagKey, event.target.checked)
                                  }
                                />
                                {diagKey === 'plomb' && 'Plomb détecté'}
                                {diagKey === 'amiante' && 'Amiante détectée'}
                                {diagKey === 'termites' && 'Termites détectés'}
                              </label>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-1">
                              {months.map((month) => {
                                const isSelected = diagnostics?.[diagKey]?.month === month.value;
                                return (
                                  <button
                                    type="button"
                                    key={month.value}
                                    className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'border border-slate-300 bg-white text-gray-700 hover:bg-slate-100'
                                    }`}
                                    onClick={() => handleMonthChange(diagKey, month.value)}
                                  >
                                    {month.label}
                                  </button>
                                );
                              })}
                            </div>
                            <input
                              type="number"
                              min="2000"
                              max="2099"
                              placeholder="Année"
                              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500"
                              value={diagnostics?.[diagKey]?.year || ''}
                              onChange={(event) => handleYearChange(diagKey, event.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={analyserDiagnostics}
                className="w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
              >
                Analyser les diagnostics
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

DiagnosticForm.propTypes = {
  state: PropTypes.shape({
    typeBien: PropTypes.string.isRequired,
    contextActuel: PropTypes.string.isRequired,
    contextDiagnostics: PropTypes.string.isRequired,
    anneeConstruction: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    diagnostics: PropTypes.object.isRequired,
    detections: PropTypes.object.isRequired,
    diagnosticsApplicables: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  metadata: PropTypes.shape({
    propertyTypeOptions: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    ).isRequired,
    contextOptions: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    ).isRequired,
    diagnosticOriginOptions: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    ).isRequired,
    months: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    ).isRequired,
    diagnosticDefinitions: PropTypes.object.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    setTypeBien: PropTypes.func.isRequired,
    setContextActuel: PropTypes.func.isRequired,
    setContextDiagnostics: PropTypes.func.isRequired,
    setAnneeConstruction: PropTypes.func.isRequired,
    analyserDiagnostics: PropTypes.func.isRequired,
    handleMonthChange: PropTypes.func.isRequired,
    handleYearChange: PropTypes.func.isRequired,
    handleDetectionChange: PropTypes.func.isRequired
  }).isRequired
};

export default DiagnosticForm;
