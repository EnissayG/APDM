import { ReactNode, useCallback, useState } from "react";
import handSource from "./assets/apdm-hand.png";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Splash from "./components/Splash";

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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <Splash onDone={handleSplashDone} />}

      <div
        className={`site-shell ${showSplash ? "is-covered" : "is-revealed"}`}
        inert={showSplash ? true : undefined}
        aria-hidden={showSplash || undefined}
      >
        <Header />

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
              imprévus du quotidien.
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
              <span>ANALGÉSIQUES</span>
              <b aria-hidden="true">✚</b>
              <span>HYGIÈNE FÉMININE</span>
              <b aria-hidden="true">✚</b>
            </div>
            <div className="marquee-group" aria-hidden="true">
              <span>LES ESSENTIELS DU QUOTIDIEN</span>
              <b>✚</b>
              <span>PREMIERS SOINS</span>
              <b>✚</b>
              <span>ANALGÉSIQUES</span>
              <b>✚</b>
              <span>HYGIÈNE FÉMININE</span>
              <b>✚</b>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
