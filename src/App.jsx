import DiagnosticForm from './components/DiagnosticForm.jsx';
import DiagnosticResults from './components/DiagnosticResults.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import useDiagnostics from './hooks/useDiagnostics.js';

const App = () => {
  const diagnostics = useDiagnostics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="pb-12">
        <DiagnosticForm
          state={diagnostics.state}
          metadata={diagnostics.metadata}
          actions={diagnostics.actions}
        />
        <DiagnosticResults
          results={diagnostics.state.results}
          diagnosticsARefaire={diagnostics.state.diagnosticsARefaire}
          alerteContexte={diagnostics.state.alerteContexte}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
