/**
 * shareImage.ts
 * Génère une image de partage : machine à remonter le temps + année miroir.
 * Zéro compute serveur — canvas offscreen côté client.
 *
 * Usage dans main.ts :
 *   import { shareTimeMachine } from "./lib/shareImage";
 *   await shareTimeMachine({ mirrorYear: 1975, userBirthYear: 2000 });
 */

const MACHINE_IMAGE_URL = "/avantmoimachine.png";
const CANVAS_W = 1200;
const CANVAS_H = 630;

export interface ShareImageParams {
  mirrorYear: number;
  userBirthYear: number;
  lang?: "fr" | "en";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateShareImage(params: ShareImageParams): Promise<Blob | null> {
  const { mirrorYear, userBirthYear } = params;

  try {
    const machine = await loadImage(MACHINE_IMAGE_URL);

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Image de fond
    ctx.drawImage(machine, 0, 0, CANVAS_W, CANVAS_H);

    // 2. Overlay sombre bas → lisibilité texte
    const grad = ctx.createLinearGradient(0, CANVAS_H * 0.5, 0, CANVAS_H);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.7)");
    grad.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 3. Année miroir — centrée sur le portail (~38% hauteur)
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H * 0.38;

    // Halo lumineux autour du portail
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170);
    glow.addColorStop(0, "rgba(120, 210, 255, 0.4)");
    glow.addColorStop(1, "rgba(120, 210, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 210, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Ombre portée de l'année
    ctx.font = "bold 128px 'Courier New', monospace";
    ctx.fillStyle = "rgba(0, 150, 220, 0.4)";
    ctx.fillText(String(mirrorYear), cx + 5, cy + 5);

    // Année principale avec glow
    ctx.fillStyle = "#e8f8ff";
    ctx.shadowColor = "rgba(100, 210, 255, 0.9)";
    ctx.shadowBlur = 40;
    ctx.fillText(String(mirrorYear), cx, cy);
    ctx.shadowBlur = 0;

    // 4. Tagline sous le portail
    const yearsAgo = userBirthYear - mirrorYear;
    const tagline = params.lang === "en"
      ? `${yearsAgo} years before your birth`
      : `${yearsAgo} ans avant ta naissance`;
    ctx.font = "500 28px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillStyle = "rgba(200, 235, 255, 0.85)";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 12;
    ctx.fillText(tagline, cx, cy + 110);
    ctx.shadowBlur = 0;

    // 5. Branding bas gauche
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("avantmoi.com", 48, CANVAS_H - 40);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  } catch {
    return null;
  }
}

/**
 * Point d'entrée principal.
 * - Mobile  : navigator.share avec image (iOS/Android natif)
 * - Desktop : navigator.share sans image
 * - Fallback: téléchargement PNG + copie URL presse-papiers
 */
export async function shareTimeMachine(params: ShareImageParams): Promise<void> {
  const { mirrorYear, userBirthYear, lang = "fr" } = params;
  const url = `https://avantmoi.com/?year=${userBirthYear}`;
  const yearsBack = userBirthYear - mirrorYear;
  const text = lang === "fr"
    ? `J'ai remonté le temps jusqu'en ${mirrorYear}\u00a0— ${yearsBack} ans avant ma naissance.`
    : `I travelled back to ${mirrorYear}\u00a0— ${yearsBack} years before my birth.`;

  const blob = await generateShareImage(params);
  const file = blob ? new File([blob], "avantmoi.png", { type: "image/png" }) : null;

  // Partage natif avec fichier image (iOS Safari, Android Chrome)
  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title: "Avant moi", text, url, files: [file] });
      return;
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
    }
  }

  // Partage natif sans image (desktop)
  if (navigator.share) {
    try {
      await navigator.share({ title: "Avant moi", text, url });
      return;
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
    }
  }

  // Fallback desktop : téléchargement PNG
  if (blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `avantmoi-${mirrorYear}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  // Copie URL dans le presse-papiers
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // silencieux
  }
}
