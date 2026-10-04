import { FormEvent, ReactNode, useState } from "react";
import handSource from "./assets/apdm-hand.png";
import logoSource from "./assets/apdm-logo.png";

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function Logo() {
  return <img className="site-logo" src={logoSource} alt="APDM" />;
}

function EssentialIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M14 7h12v9h9v12h-9v9H14v-9H5V16h9V7Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="15" />
      <path d="M20 11v10l7 4" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="13" cy="21" r="7" />
      <path d="m19 18 14-8M27 13l4 6M23 15l3 5" />
    </svg>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li className="benefit">
      <span className="benefit-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
    </li>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`field ${error ? "field-error" : ""}`}>
      <label htmlFor={id}>
        {label} {optional && <span>(optionnel)</span>}
      </label>
      {children}
      {error && (
        <p className="error-message" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: FormErrors = {};

    if (!String(data.get("name") || "").trim()) {
      nextErrors.name = "Dites-nous comment vous appeler.";
    }
    const email = String(data.get("email") || "").trim();
    if (!email) {
      nextErrors.email = "Votre courriel est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Entrez un courriel valide.";
    }
    if (!data.get("subject")) {
      nextErrors.subject = "Choisissez un sujet.";
    }
    if (!String(data.get("message") || "").trim()) {
      nextErrors.message = "Ajoutez quelques mots à votre message.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSent(true);
    }
  }

  return (
    <section
      className={`form-card ${sent ? "is-sent" : ""}`}
      aria-labelledby="contact-title"
    >
      {sent ? (
        <div className="success-panel" role="status">
          <img className="success-hand" src={handSource} alt="" aria-hidden="true" />
          <p className="eyebrow">Message envoyé</p>
          <h2 id="contact-title">Merci!</h2>
          <p>On vous revient sous 48 h.</p>
          <button type="button" className="text-button" onClick={() => setSent(false)}>
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <>
          <div className="form-heading">
            <h2 id="contact-title">Écrivez-nous</h2>
            <p>Une question, un projet, une collaboration? On vous répond rapidement.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <Field id="name" label="Nom complet" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </Field>
              <Field id="company" label="Entreprise" optional>
                <input id="company" name="company" autoComplete="organization" />
              </Field>
            </div>
            <div className="form-row">
              <Field id="email" label="Courriel" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>
              <Field id="phone" label="Téléphone" optional>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </Field>
            </div>
            <Field id="subject" label="Sujet" error={errors.subject}>
              <div className="select-wrap">
                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                >
                  <option value="" disabled>
                    Choisissez une option
                  </option>
                  <option value="machine">Obtenir une machine</option>
                  <option value="partnership">Proposer un partenariat</option>
                  <option value="question">Poser une question générale</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </Field>
            <Field id="message" label="Message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Parlez-nous de votre idée..."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
            </Field>
            <button className="submit-button" type="submit">
              <span>Envoyer</span>
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Logo />
      </header>

      <main className="landing-grid">
        <section className="intro" aria-labelledby="page-title">
          <p className="kicker">
            <span>APDM</span> Machines distributrices
          </p>
          <h1 id="page-title">
            <span className="title-word">L’essentiel</span>{" "}
            <span className="title-word">à</span>{" "}
            <span className="title-word">portée</span>{" "}
            <span className="title-word">de</span>{" "}
            <span className="title-word">main.</span>
          </h1>
          <p className="intro-copy">
            Des machines distributrices d’essentiels pharmaceutiques, pensées pour les
            entreprises et les lieux publics d’ici.
          </p>
          <a className="intro-link" href="#contact-title">
            Parlez-nous de votre projet <span aria-hidden="true">↓</span>
          </a>
        </section>

        <ContactForm />

        <section className="supporting" aria-label="Les avantages APDM">
          <ul className="benefits">
            <Benefit
              icon={<EssentialIcon />}
              title="Produits essentiels"
              text="Les indispensables, juste au bon endroit."
            />
            <Benefit
              icon={<ClockIcon />}
              title="Accessible 24/7"
              text="Pour les petits imprévus, jour et nuit."
            />
            <Benefit
              icon={<KeyIcon />}
              title="Service clé en main"
              text="Installation, entretien et remplissage."
            />
          </ul>
          <div className="hand-wrap" aria-hidden="true">
            <img src={handSource} alt="" />
          </div>
        </section>
      </main>

      <div className="marquee" aria-label="Produits disponibles chez APDM">
        <div className="marquee-track">
          <div className="marquee-group">
            <span>LES ESSENTIELS DU QUOTIDIEN</span>
            <b aria-hidden="true">✚</b>
            <span>PREMIERS SOINS</span>
            <b aria-hidden="true">✚</b>
            <span>PANSEMENTS</span>
            <b aria-hidden="true">✚</b>
            <span>ANALGÉSIQUES</span>
            <b aria-hidden="true">✚</b>
            <span>HYGIÈNE</span>
            <b aria-hidden="true">✚</b>
            <span>ACCESSIBLE 24/7</span>
            <b aria-hidden="true">✚</b>
          </div>
          <div className="marquee-group" aria-hidden="true">
            <span>LES ESSENTIELS DU QUOTIDIEN</span>
            <b>✚</b>
            <span>PREMIERS SOINS</span>
            <b>✚</b>
            <span>PANSEMENTS</span>
            <b>✚</b>
            <span>ANALGÉSIQUES</span>
            <b>✚</b>
            <span>HYGIÈNE</span>
            <b>✚</b>
            <span>ACCESSIBLE 24/7</span>
            <b>✚</b>
          </div>
        </div>
      </div>

      <footer>
        <a href="mailto:bonjour@apdm.ca">bonjour@apdm.ca</a>
        <span>Montréal, Québec</span>
        <span>© {new Date().getFullYear()} APDM</span>
      </footer>
    </div>
  );
}
