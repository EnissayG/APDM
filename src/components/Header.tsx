import logoSource from "../assets/apdm-logo.png";

export default function Header() {
  return (
    <header className="site-header">
      <a className="site-logo-link" href={import.meta.env.BASE_URL} aria-label="APDM - Accueil">
        <img className="site-logo" src={logoSource} alt="APDM" />
      </a>
    </header>
  );
}
