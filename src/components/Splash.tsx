import { useEffect, useState } from "react";
import logoSource from "../assets/apdm-logo.png";
import handSource from "../assets/apdm-hand.png";

const MIN_MS = 1200;
const MAX_MS = 2600;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitForFonts() {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }
  return document.fonts.ready;
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

type SplashProps = {
  onDone: () => void;
};

export default function Splash({ onDone }: SplashProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("is-booting");
    const reduced = prefersReducedMotion();
    const minMs = reduced ? 200 : MIN_MS;
    const maxMs = reduced ? 400 : MAX_MS;
    const started = performance.now();
    let finished = false;
    let leaveTimer = 0;
    let maxTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(maxTimer);
      setLeaving(true);
      leaveTimer = window.setTimeout(
        () => {
          document.documentElement.classList.remove("is-booting");
          onDone();
        },
        reduced ? 0 : 480,
      );
    };

    maxTimer = window.setTimeout(finish, maxMs);

    Promise.all([waitForFonts(), preloadImage(logoSource), preloadImage(handSource)])
      .then(() => {
        const elapsed = performance.now() - started;
        const remaining = Math.max(0, minMs - elapsed);
        window.setTimeout(finish, remaining);
      })
      .catch(finish);

    return () => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(leaveTimer);
      document.documentElement.classList.remove("is-booting");
    };
  }, [onDone]);

  return (
    <div
      className={`splash ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      aria-label="Chargement APDM"
    >
      <div className="splash-mark" aria-hidden="true">
        <span className="splash-pulse" />
        <img className="splash-logo" src={logoSource} alt="" />
      </div>
      <p className="splash-tag">L'essentiel à portée de main</p>
    </div>
  );
}
