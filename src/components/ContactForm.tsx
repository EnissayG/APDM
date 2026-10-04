import { FormEvent, ReactNode, useState } from "react";
import handSource from "../assets/apdm-hand.png";

type FormValues = {
  nom: string;
  entreprise: string;
  courriel: string;
  telephone: string;
  sujet: string;
  message: string;
  "bot-field": string;
};

type FormErrors = Partial<Pick<FormValues, "nom" | "courriel" | "sujet" | "message">>;

type SubmitState = "idle" | "loading" | "success" | "error";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "/";

const SUBJECT_OPTIONS = [
  { value: "Proposer un partenariat", label: "Proposer un partenariat" },
  { value: "Poser une question générale", label: "Poser une question générale" },
  { value: "Remboursement", label: "Remboursement" },
  { value: "Autre", label: "Autre" },
] as const;

function encodeFormBody(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
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
        <p className="error-message" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function validate(values: FormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (!values.nom.trim()) {
    nextErrors.nom = "Dites-nous comment vous appeler.";
  }

  const courriel = values.courriel.trim();
  if (!courriel) {
    nextErrors.courriel = "Votre courriel est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courriel)) {
    nextErrors.courriel = "Entrez un courriel valide.";
  }

  if (!values.sujet) {
    nextErrors.sujet = "Choisissez un sujet.";
  }

  if (!values.message.trim()) {
    nextErrors.message = "Ajoutez quelques mots à votre message.";
  }

  return nextErrors;
}

export default function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const values: FormValues = {
      nom: String(data.get("nom") || ""),
      entreprise: String(data.get("entreprise") || ""),
      courriel: String(data.get("courriel") || ""),
      telephone: String(data.get("telephone") || ""),
      sujet: String(data.get("sujet") || ""),
      message: String(data.get("message") || ""),
      "bot-field": String(data.get("bot-field") || ""),
    };

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitState("loading");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormBody({
          "form-name": "contact",
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSubmitState("success");
      form.reset();
    } catch {
      setSubmitState("error");
      setSubmitError(
        "L'envoi a échoué. Réessayez dans un moment, ou écrivez-nous à info@apdmdistribution.com.",
      );
    }
  }

  function resetForm() {
    setSubmitState("idle");
    setSubmitError(null);
    setErrors({});
  }

  return (
    <section
      className={`form-card ${submitState === "success" ? "is-sent" : ""}`}
      aria-labelledby="contact-title"
    >
      {submitState === "success" ? (
        <div className="success-panel" role="status">
          <img className="success-hand" src={handSource} alt="" aria-hidden="true" />
          <p className="eyebrow">Message envoyé</p>
          <h2 id="contact-title">Merci!</h2>
          <p>On vous revient sous 48 h.</p>
          <button type="button" className="text-button" onClick={resetForm}>
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <>
          <div className="form-heading">
            <h2 id="contact-title">Écrivez-nous</h2>
            <p>Une question, un projet, une collaboration? N'hésitez pas à nous contacter.</p>
          </div>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            noValidate
          >
            <input type="hidden" name="form-name" value="contact" />

            <p className="honeypot" aria-hidden="true">
              <label>
                Ne pas remplir
                <input tabIndex={-1} autoComplete="off" name="bot-field" />
              </label>
            </p>

            <div className="form-row">
              <Field id="nom" label="Nom complet" error={errors.nom}>
                <input
                  id="nom"
                  name="nom"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.nom)}
                  aria-describedby={errors.nom ? "nom-error" : undefined}
                />
              </Field>
              <Field id="entreprise" label="Entreprise" optional>
                <input id="entreprise" name="entreprise" autoComplete="organization" />
              </Field>
            </div>

            <div className="form-row">
              <Field id="courriel" label="Courriel" error={errors.courriel}>
                <input
                  id="courriel"
                  name="courriel"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.courriel)}
                  aria-describedby={errors.courriel ? "courriel-error" : undefined}
                />
              </Field>
              <Field id="telephone" label="Téléphone" optional>
                <input id="telephone" name="telephone" type="tel" autoComplete="tel" />
              </Field>
            </div>

            <Field id="sujet" label="Sujet" error={errors.sujet}>
              <div className="select-wrap">
                <select
                  id="sujet"
                  name="sujet"
                  defaultValue=""
                  aria-invalid={Boolean(errors.sujet)}
                  aria-describedby={errors.sujet ? "sujet-error" : undefined}
                >
                  <option value="" disabled>
                    Choisissez une option
                  </option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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

            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}

            <button
              className="submit-button"
              type="submit"
              disabled={submitState === "loading"}
              aria-busy={submitState === "loading"}
            >
              <span>{submitState === "loading" ? "Envoi en cours…" : "Envoyer"}</span>
              {submitState !== "loading" && (
                <span className="button-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
