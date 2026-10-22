import logoSource from "../assets/apdm-logo.png";

const links = [
  { href: import.meta.env.BASE_URL, label: "Accueil", current: true },
  { href: "#contact-title", label: "Contact", current: false },
];

export default function Header() {
  return (
    <header className="site-header">
      <a className="site-logo-link" href={import.meta.env.BASE_URL} aria-label="APDM Accueil">
        <img className="site-logo" src={logoSource} alt="APDM" />
      </a>

      <nav className="site-nav" aria-label="Navigation principale">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-current={link.current ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
