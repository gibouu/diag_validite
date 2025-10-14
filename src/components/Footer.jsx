const Footer = () => (
  <footer className="mt-12 border-t border-slate-200 py-6">
    <div className="mx-auto max-w-5xl px-4 text-sm text-slate-500">
      <p>
        Dernière mise à jour {new Date().getFullYear()}. Vérifiez toujours les réglementations locales
        pour confirmer les diagnostics requis.
      </p>
    </div>
  </footer>
);

export default Footer;
