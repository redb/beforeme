/**
 * timeMachineAnimation.ts
 *
 * Animation du compteur de la machine à remonter le temps.
 * Flux : 2026 → [ease-out] → annéeNaissance [pause+flash] → [ease-in] → annéeMiroir [stop]
 *
 * Usage :
 *   import { runTimeMachine } from "./lib/timeMachineAnimation";
 *
 *   await runTimeMachine({
 *     counterEl: document.getElementById("tm-counter")!,
 *     overlayEl: document.getElementById("tm-overlay")!,
 *     birthYear: 1985,
 *     mirrorYear: 1944,
 *     onComplete: () => showCards(),
 *   });
 */

export interface TimeMachineOptions {
  /** Élément qui affiche l'année (span, div…) */
  counterEl: HTMLElement;
  /** Overlay plein écran pour les flashs lumineux */
  overlayEl?: HTMLElement;
  birthYear: number;
  mirrorYear: number;
  /** Appelé quand l'animation est terminée */
  onComplete: () => void;
}

// Décélération : approche douce de l'année de naissance
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Accélération : plongeon vers l'année miroir
function easeIn(t: number): number {
  return t * t * t;
}

function flash(el: HTMLElement | undefined, color: string, durationMs: number): void {
  if (!el) return;
  el.style.transition = "none";
  el.style.background = color;
  el.style.opacity = "1";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = `opacity ${durationMs}ms ease-out`;
      el.style.opacity = "0";
    });
  });
}

function shakeCounter(el: HTMLElement): void {
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 350, easing: "ease-out" }
  );
}

function animateCounter(
  el: HTMLElement,
  from: number,
  to: number,
  durationMs: number,
  easingFn: (t: number) => number
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const delta = to - from;

    function step(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const current = Math.round(from + delta * easingFn(t));
      el.textContent = String(current);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(to);
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runTimeMachine(opts: TimeMachineOptions): Promise<void> {
  const { counterEl, overlayEl, birthYear, mirrorYear, onComplete } = opts;
  const currentYear = new Date().getFullYear();

  if (mirrorYear >= birthYear || birthYear >= currentYear) {
    onComplete();
    return;
  }

  const span1 = currentYear - birthYear;
  const span2 = birthYear - mirrorYear;

  // Durées adaptées à l'amplitude — min 900ms, max 2200ms
  const duration1 = Math.min(2000, Math.max(900, span1 * 20));
  const duration2 = Math.min(2400, Math.max(1000, span2 * 24));

  // === Phase 1 : currentYear → birthYear (décélération) ===
  counterEl.textContent = String(currentYear);
  await animateCounter(counterEl, currentYear, birthYear, duration1, easeOut);

  // Flash blanc — moment de naissance
  flash(overlayEl, "rgba(255, 255, 255, 0.75)", 500);
  shakeCounter(counterEl);
  await wait(650);

  // === Phase 2 : birthYear → mirrorYear (accélération) ===
  await animateCounter(counterEl, birthYear, mirrorYear, duration2, easeIn);

  // Flash bleu électrique — portail ouvert
  flash(overlayEl, "rgba(80, 180, 255, 0.85)", 700);
  shakeCounter(counterEl);
  await wait(900);

  onComplete();
}
