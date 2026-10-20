// High-Quality Cartoon Animation Engine for 20/10 Storylines in Canvas 2D
// Widescreen 16:9 Landscape with flawless, expressive cartoon characters,
// multi-beat cinematic story progression, comic speech bubbles, and love letter unfolding!

export interface CartoonSceneOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  progress: number; // 0 to 1
  elapsed: number; // seconds
  duration: number; // total duration
  templateId: 'couple-romance' | 'mom-child' | 'teacher-student' | 'sisters-bff';
  recipientName: string;
  senderName: string;
  message: string;
  showConfetti?: boolean;
  showHearts?: boolean;
}

// Helper: Draw round rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Helper: Draw a cartoon heart
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  alpha = 1
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(cx, cy + topCurveHeight);
  ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
  ctx.bezierCurveTo(
    cx - size / 2,
    cy + (size + topCurveHeight) / 2,
    cx,
    cy + (size + topCurveHeight) / 2,
    cx,
    cy + size
  );
  ctx.bezierCurveTo(
    cx,
    cy + (size + topCurveHeight) / 2,
    cx + size / 2,
    cy + (size + topCurveHeight) / 2,
    cx + size / 2,
    cy + topCurveHeight
  );
  ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
  ctx.fill();
  ctx.restore();
}

// Helper: Word wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Comic Speech Bubble Drawer with multi-line auto-wrap and collision avoidance
function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  isLeftPointer: boolean,
  alpha = 1
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  const maxBubbleW = 230;
  const words = text.split(' ');
  const lines: string[] = [];
  let curLine = '';

  for (let i = 0; i < words.length; i++) {
    const test = curLine ? `${curLine} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxBubbleW - 28 && curLine) {
      lines.push(curLine);
      curLine = words[i];
    } else {
      curLine = test;
    }
  }
  if (curLine) lines.push(curLine);

  let longestW = 0;
  for (let i = 0; i < lines.length; i++) {
    const lw = ctx.measureText(lines[i]).width;
    if (lw > longestW) longestW = lw;
  }

  const bubbleW = Math.max(76, longestW + 28);
  const lineH = 19;
  const bubbleH = lines.length * lineH + 16;
  const bx = isLeftPointer ? x - 14 : x - bubbleW + 14;
  const by = y - bubbleH - 10;

  // Soft drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // White bubble with delicate pink border
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  roundRect(ctx, bx, by, bubbleW, bubbleH, 14);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#FB7185';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Pointer triangle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (isLeftPointer) {
    ctx.moveTo(bx + 18, by + bubbleH);
    ctx.lineTo(bx + 8, by + bubbleH + 9);
    ctx.lineTo(bx + 26, by + bubbleH);
  } else {
    ctx.moveTo(bx + bubbleW - 26, by + bubbleH);
    ctx.lineTo(bx + bubbleW - 8, by + bubbleH + 9);
    ctx.lineTo(bx + bubbleW - 18, by + bubbleH);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text rendered line by line
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9F1239';
  const textStartY = by + 18;
  for (let li = 0; li < lines.length; li++) {
    ctx.fillText(lines[li], bx + bubbleW / 2, textStartY + li * lineH);
  }
  ctx.restore();
}

// Confetti Particle Drawer
function drawConfettiExplosion(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  if (phase <= 0 || phase >= 1) return;
  const colors = ['#F43F5E', '#FBBF24', '#38BDF8', '#A855F7', '#34D399', '#FB923C'];
  const count = 45;

  ctx.save();
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 160 + (i % 7) * 40;
    const dist = speed * phase;
    const px = w / 2 + Math.cos(angle) * dist;
    const py = h * 0.45 + Math.sin(angle) * dist * 0.7 + phase * phase * 120; // gravity
    const rot = phase * 10 + i;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = Math.max(0, 1 - phase);
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
  }
  ctx.restore();
}

// ==========================================
// 1. CARTOON SCENERY BACKGROUNDS
// ==========================================

function drawSunsetParkBackground(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
  // Sunset sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#2D103D');
  skyGrad.addColorStop(0.35, '#661D52');
  skyGrad.addColorStop(0.65, '#D85A50');
  skyGrad.addColorStop(0.85, '#FFA578');
  skyGrad.addColorStop(1, '#FFE3D8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Crescent Moon with glow
  ctx.save();
  ctx.shadowColor = '#FFF4C2';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#FFF8DB';
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 0.16, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Moon cutout
  ctx.fillStyle = '#3E1447';
  ctx.beginPath();
  ctx.arc(w * 0.80, h * 0.14, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant cartoon hills
  ctx.fillStyle = '#521B43';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.quadraticCurveTo(w * 0.25, h * 0.62, w * 0.5, h * 0.70);
  ctx.quadraticCurveTo(w * 0.75, h * 0.76, w, h * 0.68);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Park Ground
  const groundGrad = ctx.createLinearGradient(0, h * 0.70, 0, h);
  groundGrad.addColorStop(0, '#38122C');
  groundGrad.addColorStop(0.5, '#260D1E');
  groundGrad.addColorStop(1, '#160511');
  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.74);
  ctx.quadraticCurveTo(w * 0.5, h * 0.72, w, h * 0.74);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Fairy lights string
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.12);
  ctx.quadraticCurveTo(w * 0.25, h * 0.24, w * 0.5, h * 0.14);
  ctx.quadraticCurveTo(w * 0.75, h * 0.26, w, h * 0.13);
  ctx.stroke();

  // Glowing light bulbs
  const lightCount = 14;
  for (let i = 0; i <= lightCount; i++) {
    const t = i / lightCount;
    let lx = t * w;
    let ly: number;
    if (t < 0.5) {
      const subT = t / 0.5;
      ly = (1 - subT) * (1 - subT) * (h * 0.12) + 2 * (1 - subT) * subT * (h * 0.24) + subT * subT * (h * 0.14);
    } else {
      const subT = (t - 0.5) / 0.5;
      ly = (1 - subT) * (1 - subT) * (h * 0.14) + 2 * (1 - subT) * subT * (h * 0.26) + subT * subT * (h * 0.13);
    }

    const pulse = Math.sin(elapsed * 3 + i * 0.8) * 0.3 + 0.7;
    ctx.save();
    ctx.shadowColor = i % 2 === 0 ? '#FBBF24' : '#FB7185';
    ctx.shadowBlur = 12 * pulse;
    ctx.fillStyle = i % 2 === 0 ? '#FEF08A' : '#FECDD3';
    ctx.beginPath();
    ctx.arc(lx, ly, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Romantic cherry blossom branches (top left)
  ctx.save();
  ctx.fillStyle = '#4A1D2F';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(w * 0.12, h * 0.08, w * 0.22, h * 0.04);
  ctx.lineTo(w * 0.20, 0);
  ctx.fill();
  const blossomPositions = [
    [w * 0.06, h * 0.06],
    [w * 0.12, h * 0.10],
    [w * 0.18, h * 0.06],
    [w * 0.22, h * 0.05],
    [w * 0.09, h * 0.14],
  ];
  blossomPositions.forEach(([bx, by]) => {
    ctx.fillStyle = '#FDA4AF';
    ctx.beginPath();
    ctx.arc(bx, by, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.arc(bx + 4, by - 2, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawSunlitRoomBackground(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
  const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
  wallGrad.addColorStop(0, '#FFE8D6');
  wallGrad.addColorStop(0.7, '#FFF1E6');
  wallGrad.addColorStop(1, '#FCD5CE');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, w, h);

  // Arched sunny window
  const winX = w * 0.65;
  const winY = h * 0.12;
  const winW = w * 0.26;
  const winH = h * 0.52;

  ctx.save();
  ctx.fillStyle = '#BAE6FD';
  ctx.beginPath();
  roundRect(ctx, winX, winY, winW, winH, 20);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH * 0.55);
  ctx.lineTo(winX + winW, winY + winH * 0.55);
  ctx.stroke();

  // Sunlight beam
  const beam = ctx.createLinearGradient(winX, winY, winX - w * 0.35, winY + winH + h * 0.35);
  beam.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(winX, winY + 40);
  ctx.lineTo(winX + winW, winY + 20);
  ctx.lineTo(winX - w * 0.15, h);
  ctx.lineTo(winX - w * 0.45, h);
  ctx.fill();
  ctx.restore();

  // Wooden floor
  const floorGrad = ctx.createLinearGradient(0, h * 0.74, 0, h);
  floorGrad.addColorStop(0, '#D4A373');
  floorGrad.addColorStop(1, '#9C6644');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, h * 0.74, w, h * 0.26);

  // Carpet
  ctx.save();
  ctx.fillStyle = '#FFE5D9';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.88, w * 0.38, h * 0.10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#F4A261';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawClassroomBackground(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
  const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
  wallGrad.addColorStop(0, '#E8F5E9');
  wallGrad.addColorStop(0.7, '#C8E6C9');
  wallGrad.addColorStop(1, '#A5D6A7');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, w, h);

  // Blackboard
  const bbX = w * 0.18;
  const bbY = h * 0.08;
  const bbW = w * 0.64;
  const bbH = h * 0.50;

  ctx.save();
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  roundRect(ctx, bbX - 10, bbY - 10, bbW + 20, bbH + 20, 14);
  ctx.fill();

  ctx.fillStyle = '#1B4332';
  ctx.beginPath();
  roundRect(ctx, bbX, bbY, bbW, bbH, 8);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.font = `bold italic ${Math.floor(w * 0.026)}px "Cormorant Garamond", serif`;
  ctx.fillStyle = '#FFF59D';
  ctx.fillText('🌸 TRI ÂN NGÀY PHỤ NỮ VIỆT NAM 20·10 🌸', bbX + bbW / 2, bbY + bbH * 0.32);

  ctx.font = `italic 600 ${Math.floor(w * 0.018)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#E8F5E9';
  ctx.fillText('Nét chữ nết người · Ơn cô vun đắp tương lai', bbX + bbW / 2, bbY + bbH * 0.56);
  ctx.restore();

  // Classroom floor
  ctx.fillStyle = '#8D6E63';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
}

function drawCafePartyBackground(ctx: CanvasRenderingContext2D, w: number, h: number, elapsed: number) {
  const cafeGrad = ctx.createLinearGradient(0, 0, 0, h);
  cafeGrad.addColorStop(0, '#F3E8FF');
  cafeGrad.addColorStop(0.5, '#FCE7F3');
  cafeGrad.addColorStop(1, '#FED7AA');
  ctx.fillStyle = cafeGrad;
  ctx.fillRect(0, 0, w, h);

  // Bunting triangle flags
  const flagCount = 18;
  const flagColors = ['#F472B6', '#38BDF8', '#FBBF24', '#A78BFA', '#34D399'];
  for (let i = 0; i < flagCount; i++) {
    const fx = (i / flagCount) * w;
    const fw = w / flagCount;
    const fy = h * 0.08 + Math.sin((i / flagCount) * Math.PI) * (h * 0.08);

    ctx.fillStyle = flagColors[i % flagColors.length];
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + fw, fy);
    ctx.lineTo(fx + fw / 2, fy + 30);
    ctx.closePath();
    ctx.fill();
  }

  // Wooden floor
  ctx.fillStyle = '#D97706';
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
}

// ==============================================================
// 2. FLAWLESS EXPRESSIVE CARTOON CHARACTERS (NO FACIAL GLITCHES!)
// ==============================================================

// Helper: Draw Anime Sparkly Eye
function drawAnimeEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  isBlinking: boolean,
  isHappySmile: boolean,
  lookRight = false
) {
  if (isHappySmile) {
    // Happy curved anime eye (^_^)
    ctx.strokeStyle = '#1E1B18';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 2, r * 1.1, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    return;
  }

  if (isBlinking) {
    // Blinking eye straight lash
    ctx.strokeStyle = '#1E1B18';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.stroke();
    return;
  }

  // Sclera (White background)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.9, r * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1E1B18';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dark Pupil & Iris
  const pupilOffsetX = lookRight ? r * 0.25 : -r * 0.25;
  ctx.fillStyle = '#261C14';
  ctx.beginPath();
  ctx.arc(cx + pupilOffsetX, cy, r * 0.75, 0, Math.PI * 2);
  ctx.fill();

  // Sparkle highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + pupilOffsetX - 2.5, cy - 3, r * 0.35, 0, Math.PI * 2);
  ctx.arc(cx + pupilOffsetX + 2.5, cy + 2, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eyelash line on top
  ctx.strokeStyle = '#1E1B18';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 2, r * 0.95, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

// Draw Boy Cartoon (Romantic Couple)
function drawCartoonBoy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  walkCycle: number,
  handoverProgress: number,
  isBlinking: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bobbing = Math.sin(walkCycle * Math.PI * 2) * 4;

  // 1. Legs with walking cycle
  const leftLegAngle = Math.sin(walkCycle * Math.PI * 2) * 0.35;
  const rightLegAngle = -Math.sin(walkCycle * Math.PI * 2) * 0.35;

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  // Left Leg
  ctx.save();
  ctx.translate(-12, 50 + bobbing);
  ctx.rotate(leftLegAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 48);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(4, 48, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Leg
  ctx.save();
  ctx.translate(12, 50 + bobbing);
  ctx.rotate(rightLegAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 48);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(4, 48, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Torso (Jacket & Scarf)
  ctx.save();
  ctx.translate(0, bobbing);
  ctx.fillStyle = '#2563EB';
  ctx.beginPath();
  roundRect(ctx, -24, 0, 48, 56, 12);
  ctx.fill();

  // White collar
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(0, 16);
  ctx.lineTo(10, 0);
  ctx.fill();

  // Scarf
  ctx.fillStyle = '#F43F5E';
  ctx.beginPath();
  roundRect(ctx, -20, -4, 40, 14, 6);
  ctx.fill();
  ctx.restore();

  // 3. Head & Face (FLAWLESS LAYERING!)
  ctx.save();
  ctx.translate(0, -32 + bobbing);

  // A. Ears
  ctx.fillStyle = '#FFE0BD';
  ctx.beginPath();
  ctx.arc(-30, 0, 8, 0, Math.PI * 2);
  ctx.arc(30, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // B. Face skin (Pure circle)
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // C. Rosy Cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath();
  ctx.arc(-16, 8, 7, 0, Math.PI * 2);
  ctx.arc(16, 8, 7, 0, Math.PI * 2);
  ctx.fill();

  // D. Eyes
  drawAnimeEye(ctx, -12, 0, 6, isBlinking, false, true);
  drawAnimeEye(ctx, 12, 0, 6, isBlinking, false, true);

  // E. Smiling mouth
  ctx.strokeStyle = '#991B1B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 13, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // F. Boy Hair (Clean top cap & front bangs - NEVER covers eyes!)
  ctx.fillStyle = '#331D12';
  // Top hair dome
  ctx.beginPath();
  ctx.arc(0, -6, 32, Math.PI, 0, false);
  ctx.fill();

  // Cute side hair & stylish bangs framing forehead
  ctx.beginPath();
  ctx.moveTo(-32, -6);
  ctx.lineTo(-20, -6);
  ctx.quadraticCurveTo(-14, 2, -6, -4);
  ctx.quadraticCurveTo(4, 4, 14, -6);
  ctx.lineTo(32, -6);
  ctx.quadraticCurveTo(34, -20, 0, -38);
  ctx.quadraticCurveTo(-34, -20, -32, -6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 4. Arms & Handing Over Bouquet & Letter
  // Left arm holding love letter
  ctx.save();
  ctx.translate(-22, 10 + bobbing);
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-14, 18, -8, 28);
  ctx.stroke();
  ctx.restore();

  // Right arm extending forward with Bouquet
  ctx.save();
  ctx.translate(20, 10 + bobbing);
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  const armExtend = handoverProgress * 32;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(24 + armExtend * 0.5, 6, 38 + armExtend, 12);
  ctx.stroke();

  // Hand holding Rose Bouquet
  ctx.translate(38 + armExtend, 12);
  drawCartoonBouquet(ctx, 0, 0, 1.25, 'rose');
  ctx.restore();

  ctx.restore();
}

// Draw Girl Cartoon (Romantic Couple)
function drawCartoonGirl(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  idlePhase: number,
  reactionProgress: number,
  isBlinking: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const gentleSway = Math.sin(idlePhase * Math.PI * 2) * 2;

  // 1. Back hair (Drawn BEHIND head and body!)
  ctx.save();
  ctx.translate(0, -30 + gentleSway);
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.moveTo(-28, -6);
  ctx.quadraticCurveTo(-44, 40, -36, 80);
  ctx.quadraticCurveTo(0, 92, 36, 80);
  ctx.quadraticCurveTo(44, 40, 28, -6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Legs & Shoes
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-10, 48);
  ctx.lineTo(-8, 88);
  ctx.moveTo(10, 48);
  ctx.lineTo(8, 88);
  ctx.stroke();

  // Red Mary Jane Shoes
  ctx.fillStyle = '#E11D48';
  ctx.beginPath();
  ctx.ellipse(-6, 88, 9, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(10, 88, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Dress (Pastel Pink Dress with Lace)
  ctx.save();
  ctx.translate(0, gentleSway);
  ctx.fillStyle = '#FB7185';
  ctx.beginPath();
  ctx.moveTo(-16, 6);
  ctx.lineTo(16, 6);
  ctx.lineTo(34, 52);
  ctx.lineTo(-34, 52);
  ctx.closePath();
  ctx.fill();

  // White lace trim
  ctx.fillStyle = '#FFF1F2';
  for (let i = -30; i <= 30; i += 10) {
    ctx.beginPath();
    ctx.arc(i, 52, 5, 0, Math.PI);
    ctx.fill();
  }
  ctx.restore();

  // 4. Head & Face (Clean, No Overlapping Polygons!)
  ctx.save();
  ctx.translate(0, -30 + gentleSway);

  // A. Ears
  ctx.fillStyle = '#FFE0BD';
  ctx.beginPath();
  ctx.arc(-29, 0, 7, 0, Math.PI * 2);
  ctx.arc(29, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  // B. Face skin
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // C. Rosy Cheeks (intensifies on reaction)
  const blushAlpha = 0.4 + reactionProgress * 0.45;
  ctx.fillStyle = `rgba(244, 63, 94, ${blushAlpha})`;
  ctx.beginPath();
  ctx.arc(-15, 8, 8, 0, Math.PI * 2);
  ctx.arc(15, 8, 8, 0, Math.PI * 2);
  ctx.fill();

  // D. Eyes
  const isHappy = reactionProgress > 0.4;
  drawAnimeEye(ctx, -12, 0, 6, isBlinking, isHappy, false);
  drawAnimeEye(ctx, 12, 0, 6, isBlinking, isHappy, false);

  // E. Smiling mouth
  if (isHappy) {
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(0, 11, 7, 0, Math.PI);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 12, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  // F. Front Bangs & Floral Clip (Above Forehead ONLY!)
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.arc(0, -6, 30, Math.PI, 0, false);
  ctx.fill();

  // Forehead bangs
  ctx.beginPath();
  ctx.moveTo(-30, -6);
  ctx.quadraticCurveTo(-14, 0, -4, -6);
  ctx.quadraticCurveTo(8, 2, 18, -6);
  ctx.lineTo(30, -6);
  ctx.quadraticCurveTo(32, -18, 0, -36);
  ctx.quadraticCurveTo(-32, -18, -30, -6);
  ctx.closePath();
  ctx.fill();

  // Flower Hair Clip
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(22, -16, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FB7185';
  ctx.beginPath();
  ctx.arc(22, -16, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 5. Arms (reaching out to receive bouquet)
  ctx.save();
  ctx.translate(0, gentleSway);
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  const armReach = reactionProgress * 24;
  ctx.beginPath();
  ctx.moveTo(-16, 12);
  ctx.quadraticCurveTo(-26 - armReach, 20, -20 - armReach, 32);
  ctx.moveTo(16, 12);
  ctx.quadraticCurveTo(4 - armReach, 22, -10 - armReach, 30);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// Draw Cute Toddler (Mom & Child Story)
function drawCartoonChild(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  runCycle: number,
  isOffering: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bobbing = Math.sin(runCycle * Math.PI * 2) * 6;

  // Legs
  const legAngle = Math.sin(runCycle * Math.PI * 2) * 0.45;
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.save();
  ctx.translate(-8, 32 + bobbing);
  ctx.rotate(legAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 26);
  ctx.stroke();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.ellipse(3, 26, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(8, 32 + bobbing);
  ctx.rotate(-legAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 26);
  ctx.stroke();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.ellipse(3, 26, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Overalls
  ctx.save();
  ctx.translate(0, bobbing);
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  roundRect(ctx, -18, 0, 36, 36, 10);
  ctx.fill();
  drawHeart(ctx, 0, 12, 8, '#F43F5E');
  ctx.restore();

  // Head & Face
  ctx.save();
  ctx.translate(0, -26 + bobbing);

  // Face circle
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair & cute top-knot
  ctx.fillStyle = '#3E2723';
  ctx.beginPath();
  ctx.arc(0, -6, 28, Math.PI, 0, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -30, 9, 0, Math.PI * 2);
  ctx.fill();
  // Red bow
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(-7, -30, 4.5, 0, Math.PI * 2);
  ctx.arc(7, -30, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Big chubby rosy cheeks
  ctx.fillStyle = 'rgba(239, 68, 68, 0.55)';
  ctx.beginPath();
  ctx.arc(-14, 6, 7, 0, Math.PI * 2);
  ctx.arc(14, 6, 7, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Open smile
  drawAnimeEye(ctx, -10, -2, 5, false, true, true);
  drawAnimeEye(ctx, 10, -2, 5, false, true, true);

  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(0, 10, 7, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // Arms holding huge flower bouquet
  ctx.save();
  ctx.translate(0, bobbing);
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-16, 10);
  ctx.lineTo(12, -2);
  ctx.moveTo(16, 10);
  ctx.lineTo(12, -2);
  ctx.stroke();

  ctx.translate(14, -8);
  drawCartoonBouquet(ctx, 0, 0, 1.1, 'lotus');
  ctx.restore();

  ctx.restore();
}

// Draw Cartoon Mother (Mom & Child Story)
function drawCartoonMom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  kneelPhase: number,
  embracePhase: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Emerald floral dress
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(24, 0);
  ctx.lineTo(40, 68);
  ctx.lineTo(-40, 68);
  ctx.closePath();
  ctx.fill();

  // Head & Face
  ctx.save();
  ctx.translate(0, -36);

  // Hair bun behind head
  ctx.fillStyle = '#261C14';
  ctx.beginPath();
  ctx.arc(26, -22, 13, 0, Math.PI * 2);
  ctx.fill();

  // Face circle
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Soft blush
  ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.beginPath();
  ctx.arc(-15, 8, 7, 0, Math.PI * 2);
  ctx.arc(15, 8, 7, 0, Math.PI * 2);
  ctx.fill();

  // Gentle smiling eyes closed in love
  drawAnimeEye(ctx, -12, 0, 6, false, true, false);
  drawAnimeEye(ctx, 12, 0, 6, false, true, false);

  // Gentle smile
  ctx.strokeStyle = '#B91C1C';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 13, 7, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Hair on top of head
  ctx.fillStyle = '#261C14';
  ctx.beginPath();
  ctx.arc(0, -6, 32, Math.PI, 0, false);
  ctx.fill();

  ctx.restore();

  // Arms opening wide to hug child
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  const hug = embracePhase * 18;
  ctx.beginPath();
  ctx.moveTo(-22, 6);
  ctx.quadraticCurveTo(-44 - hug, 28, -24 - hug, 48);
  ctx.moveTo(22, 6);
  ctx.quadraticCurveTo(10 - hug, 34, -8 - hug, 46);
  ctx.stroke();

  ctx.restore();
}

// Draw Cartoon Teacher
function drawCartoonTeacher(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  gracePhase: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Traditional Sky Blue Áo Dài
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(18, 0);
  ctx.lineTo(32, 95);
  ctx.lineTo(-32, 95);
  ctx.closePath();
  ctx.fill();

  // White pants
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-22, 92, 14, 20);
  ctx.fillRect(8, 92, 14, 20);

  // Pearl necklace
  ctx.fillStyle = '#FEF08A';
  for (let p = -10; p <= 10; p += 5) {
    ctx.beginPath();
    ctx.arc(p, 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head & Face
  ctx.save();
  ctx.translate(0, -38);

  // Back hair flowing
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.moveTo(-28, -6);
  ctx.quadraticCurveTo(-42, 40, -34, 80);
  ctx.quadraticCurveTo(0, 88, 34, 80);
  ctx.quadraticCurveTo(42, 40, 28, -6);
  ctx.closePath();
  ctx.fill();

  // Face circle
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes behind glasses
  drawAnimeEye(ctx, -12, -1, 5.5, false, true, false);
  drawAnimeEye(ctx, 12, -1, 5.5, false, true, false);

  // Glasses frames
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(-19, -7, 14, 11);
  ctx.strokeRect(5, -7, 14, 11);
  ctx.beginPath();
  ctx.moveTo(-5, -2);
  ctx.lineTo(5, -2);
  ctx.stroke();

  // Gentle smile
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 13, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Front hair cap
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.arc(0, -6, 30, Math.PI, 0, false);
  ctx.fill();

  ctx.restore();

  // Arms: gently receiving flowers
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-16, 10);
  ctx.quadraticCurveTo(-32, 28, -18, 46);
  ctx.moveTo(16, 10);
  ctx.quadraticCurveTo(0, 30, -10, 44);
  ctx.stroke();

  ctx.restore();
}

// Draw Cartoon Student
function drawCartoonStudent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  walkPhase: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // White uniform & red scarf
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  roundRect(ctx, -18, 0, 36, 42, 8);
  ctx.fill();

  // Red Scarf
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.lineTo(0, 16);
  ctx.lineTo(14, 2);
  ctx.lineTo(6, 26);
  ctx.lineTo(-6, 26);
  ctx.closePath();
  ctx.fill();

  // Navy trousers
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(-16, 42, 12, 36);
  ctx.fillRect(4, 42, 12, 36);

  // Head & Face
  ctx.save();
  ctx.translate(0, -28);

  // Face circle
  ctx.fillStyle = '#FFE0BD';
  ctx.strokeStyle = '#F0BC98';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair
  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.arc(0, -6, 28, Math.PI, 0, false);
  ctx.fill();

  // Eyes & Smile
  drawAnimeEye(ctx, -10, 0, 5, false, true, true);
  drawAnimeEye(ctx, 10, 0, 5, false, true, true);

  ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.beginPath();
  ctx.arc(-13, 6, 5.5, 0, Math.PI * 2);
  ctx.arc(13, 6, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 11, 5, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Arms holding Flowers & "10 ĐIỂM" Paper
  ctx.strokeStyle = '#FFE0BD';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-16, 12);
  ctx.lineTo(24, 16);
  ctx.stroke();

  // 10 score paper
  ctx.save();
  ctx.translate(14, 4);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1;
  ctx.fillRect(0, 0, 26, 32);
  ctx.strokeRect(0, 0, 26, 32);
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('10', 6, 18);
  ctx.restore();

  // Bouquet
  ctx.translate(34, 14);
  drawCartoonBouquet(ctx, 0, 0, 1.1, 'sunflower');

  ctx.restore();
}

// Cartoon Bouquet Drawer
function drawCartoonBouquet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  type: 'rose' | 'lotus' | 'sunflower'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Wrapper cone
  ctx.fillStyle = '#E5C49F';
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.lineTo(-18, -6);
  ctx.lineTo(18, -6);
  ctx.closePath();
  ctx.fill();

  // Ribbon
  ctx.fillStyle = '#F43F5E';
  ctx.beginPath();
  ctx.ellipse(-6, 16, 8, 5, -0.4, 0, Math.PI * 2);
  ctx.ellipse(6, 16, 8, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 16, 4, 0, Math.PI * 2);
  ctx.fill();

  const colors =
    type === 'rose'
      ? ['#E11D48', '#F43F5E', '#FDA4AF', '#BE123C']
      : type === 'lotus'
      ? ['#F472B6', '#FB7185', '#FFF1F2', '#EC4899']
      : ['#FBBF24', '#F59E0B', '#FDE047', '#78350F'];

  const flowerOffsets = [
    [0, -16],
    [-12, -10],
    [12, -10],
    [-6, -22],
    [6, -22],
  ];

  flowerOffsets.forEach(([fx, fy], idx) => {
    ctx.fillStyle = colors[idx % colors.length];
    ctx.beginPath();
    ctx.arc(fx, fy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// ==============================================================
// 3. ANIMATED CONFESSION LOVE LETTER UNROLLING
// ==============================================================

function drawAnimatedLoveLetter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  recipientName: string,
  senderName: string,
  message: string,
  templateId: string
) {
  // Only reveal letter in the final celebratory portion of the video (progress >= 0.44)
  if (progress < 0.44) return;

  const letterProgress = Math.min(1, (progress - 0.44) / 0.56);
  ctx.save();

  // Responsive Card sizing adapting across 16:9, 9:16, 1:1
  const isPortrait = h > w;
  const cardW = isPortrait ? Math.min(w * 0.90, 560) : Math.min(w * 0.76, 680);
  const cardH = isPortrait ? Math.min(h * 0.52, 440) : Math.min(h * 0.62, 390);
  const cardX = (w - cardW) / 2;
  const cardY = (h - cardH) / 2 - (1 - letterProgress) * 20;

  ctx.globalAlpha = Math.min(1, letterProgress * 2.8);

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;

  // Parchment paper background
  const paperGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  paperGrad.addColorStop(0, '#FFFDF8');
  paperGrad.addColorStop(0.5, '#FFF8F0');
  paperGrad.addColorStop(1, '#FFECD6');
  ctx.fillStyle = paperGrad;
  ctx.beginPath();
  roundRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Gold Gilded Border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner dashed border
  ctx.strokeStyle = '#FDA4AF';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  roundRect(ctx, cardX + 10, cardY + 10, cardW - 20, cardH - 20, 14);
  ctx.stroke();
  ctx.setLineDash([]);

  // Corner Hearts
  drawHeart(ctx, cardX + 24, cardY + 24, 15, '#E11D48');
  drawHeart(ctx, cardX + cardW - 24, cardY + 24, 15, '#E11D48');

  // Title
  const title =
    templateId === 'couple-romance'
      ? '💌 BỨC THƯ TỎ TÌNH 20·10'
      : templateId === 'mom-child'
      ? '🌸 THIỆP YÊU THƯƠNG GỬI MẸ'
      : templateId === 'teacher-student'
      ? '📚 LỜI TRI ÂN KÍNH GỬI CÔ'
      : '🎁 MÓN QUÀ TRI KỶ 20·10';

  const titleSize = Math.max(16, Math.min(23, Math.floor(cardW * 0.035)));
  ctx.textAlign = 'center';
  ctx.font = `bold italic ${titleSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillStyle = '#BE123C';
  ctx.fillText(title, w / 2, cardY + titleSize + 16);

  // Gold Divider
  const divY = cardY + titleSize + 25;
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - cardW * 0.35, divY);
  ctx.lineTo(w / 2 + cardW * 0.35, divY);
  ctx.stroke();

  // Recipient Name Highlight
  const recipSize = Math.max(18, Math.min(28, Math.floor(cardW * 0.045)));
  const recipY = divY + recipSize + 14;
  ctx.font = `italic bold ${recipSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillStyle = '#B91C1C';
  ctx.shadowColor = 'rgba(239, 68, 68, 0.35)';
  ctx.shadowBlur = 6;
  ctx.fillText(`Kính gửi: ${recipientName || 'Người Thương'}`, w / 2, recipY);
  ctx.shadowBlur = 0;

  // Bottom Sign-off Anchor
  const sigY = cardY + cardH - 30;

  // Message Body with Word Wrap and bounds check
  const msgSize = Math.max(13, Math.min(17, Math.floor(cardW * 0.028)));
  ctx.font = `500 ${msgSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillStyle = '#372023';

  const maxW = cardW - 70;
  const wrappedLines = wrapText(ctx, message, maxW);
  const lineH = Math.round(msgSize * 1.55);
  const startMsgY = recipY + msgSize + 16;

  // Calculate available space to ensure message lines NEVER collide with sign-off
  const availableH = sigY - startMsgY - 14;
  const maxLines = Math.max(1, Math.min(4, Math.floor(availableH / lineH)));

  for (let l = 0; l < Math.min(maxLines, wrappedLines.length); l++) {
    let textLine = wrappedLines[l];
    if (l === maxLines - 1 && wrappedLines.length > maxLines) {
      textLine = textLine.replace(/[,.;\s]+$/, '') + '...';
    }
    ctx.fillText(textLine, w / 2, startMsgY + l * lineH);
  }

  // Sender Sign-off: Perfectly measured so prefix and sender name NEVER overlap
  const prefix = 'Thân gửi từ: ';
  const sender = senderName?.trim() || 'Người Gửi';

  const prefixFont = `italic 400 ${Math.max(11, Math.min(14, Math.floor(cardW * 0.022)))}px "Plus Jakarta Sans", sans-serif`;
  const senderFont = `italic bold ${Math.max(14, Math.min(19, Math.floor(cardW * 0.030)))}px "Cormorant Garamond", Georgia, serif`;

  ctx.font = prefixFont;
  const prefixW = ctx.measureText(prefix).width;
  ctx.font = senderFont;
  const senderW = ctx.measureText(sender).width;
  const totalSigW = prefixW + senderW;

  const sigStartX = Math.max(cardX + 24, w / 2 - totalSigW / 2);

  ctx.textAlign = 'left';
  ctx.font = prefixFont;
  ctx.fillStyle = '#E11D48';
  ctx.fillText(prefix, sigStartX, sigY);

  ctx.font = senderFont;
  ctx.fillStyle = '#991B1B';
  ctx.fillText(sender, sigStartX + prefixW, sigY);

  // Beating Heart Stamp
  const stampPulse = Math.sin(progress * Math.PI * 8) * 2.5;
  drawHeart(ctx, cardX + cardW - 44, cardY + cardH - 34, 18 + stampPulse, '#E11D48');

  ctx.restore();
}

// ==============================================================
// 4. MAIN CINEMATIC COMPOSITOR (MULTI-BEAT WIDESCREEN & MOBILE)
// ==============================================================

export function renderCartoonScene(options: CartoonSceneOptions) {
  const {
    ctx,
    width,
    height,
    progress,
    elapsed,
    duration,
    templateId,
    recipientName,
    senderName,
    message,
    showConfetti = true,
    showHearts = true,
  } = options;

  // 1. Draw Background
  if (templateId === 'couple-romance') {
    drawSunsetParkBackground(ctx, width, height, elapsed);
  } else if (templateId === 'mom-child') {
    drawSunlitRoomBackground(ctx, width, height, elapsed);
  } else if (templateId === 'teacher-student') {
    drawClassroomBackground(ctx, width, height, elapsed);
  } else {
    drawCafePartyBackground(ctx, width, height, elapsed);
  }

  // 2. Top Event Tag (clean, responsive, non-overlapping)
  ctx.save();
  ctx.textAlign = 'center';
  const tagFontSize = Math.max(11, Math.min(15, Math.floor(width * 0.015)));
  ctx.font = `bold ${tagFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 8;
  ctx.fillText('✨ 20 · 10 · NGÀY PHỤ NỮ VIỆT NAM ✨', width / 2, Math.max(26, height * 0.055));
  ctx.restore();

  // Blinking timer
  const isBlinking = Math.floor(elapsed * 2.5) % 9 === 0;

  // Sequential Story Timing to prevent ANY text collision:
  // Beat 1 (0.00 -> 0.24): Giver approaches and speaks greeting
  // Beat 2 (0.24 -> 0.44): Receiver reacts and expresses joy
  // Beat 3 (0.44 -> 1.00): Confetti explodes & Love Letter Card unfolds cleanly

  const isBeat1 = progress < 0.24;
  const isBeat2 = progress >= 0.24 && progress < 0.44;

  const beat1Alpha = isBeat1
    ? Math.min(1, progress * 10) * (progress > 0.20 ? Math.max(0, 1 - (progress - 0.20) * 25) : 1)
    : 0;
  const beat2Alpha = isBeat2
    ? Math.min(1, (progress - 0.24) * 10) * (progress > 0.39 ? Math.max(0, 1 - (progress - 0.39) * 20) : 1)
    : 0;

  if (templateId === 'couple-romance') {
    const boyTargetX = width * 0.36;
    const boyStartX = width * 0.16;
    const walkRatio = Math.min(1, progress * 3.2);
    const boyX = boyStartX + (boyTargetX - boyStartX) * walkRatio;
    const boyWalkCycle = walkRatio < 1 ? elapsed * 2.4 : 0;
    const handoverProgress = Math.max(0, Math.min(1, (progress - 0.24) * 3));
    const girlX = width * 0.65;
    const reactionProgress = Math.max(0, Math.min(1, (progress - 0.28) * 3));

    // Characters
    drawCartoonBoy(ctx, boyX, height * 0.68, 1.25, boyWalkCycle, handoverProgress, isBlinking);
    drawCartoonGirl(ctx, girlX, height * 0.68, 1.22, elapsed * 0.8, reactionProgress, isBlinking);

    // Sequential Speech Bubbles (NEVER OVERLAP)
    if (isBeat1 && beat1Alpha > 0.05) {
      drawSpeechBubble(ctx, boyX + 10, height * 0.38, 'Hôm nay 20/10 rồi, mình có món quà bí mật... 💌', false, beat1Alpha);
    } else if (isBeat2 && beat2Alpha > 0.05) {
      drawSpeechBubble(ctx, girlX - 10, height * 0.38, 'Ôi bất ngờ quá! Cảm ơn anh nha! ❤️', true, beat2Alpha);
    }

    // Floating love hearts
    if (showHearts && handoverProgress > 0.2 && progress < 0.88) {
      const heartCount = 7;
      for (let h = 0; h < heartCount; h++) {
        const hProgress = ((progress * 3 + h / heartCount) % 1);
        const hx = width * 0.49 + Math.sin(h * 1.6 + elapsed * 1.5) * 50;
        const hy = height * 0.60 - hProgress * 130;
        drawHeart(ctx, hx, hy, 14 * (1 - hProgress * 0.3), '#F43F5E', (1 - hProgress) * 0.8);
      }
    }
  } else if (templateId === 'mom-child') {
    const childStartX = width * 0.18;
    const childTargetX = width * 0.42;
    const runRatio = Math.min(1, progress * 3.4);
    const childX = childStartX + (childTargetX - childStartX) * runRatio;
    const runCycle = runRatio < 1 ? elapsed * 3.5 : 0;
    const momX = width * 0.62;
    const embracePhase = Math.max(0, Math.min(1, (progress - 0.26) * 3));

    drawCartoonChild(ctx, childX, height * 0.70, 1.25, runCycle, true);
    drawCartoonMom(ctx, momX, height * 0.66, 1.28, 1, embracePhase);

    // Sequential Speech Bubbles (NEVER OVERLAP)
    if (isBeat1 && beat1Alpha > 0.05) {
      drawSpeechBubble(ctx, childX + 15, height * 0.42, 'Con chạy nhanh về tặng hoa Mẹ đây! 🌸', false, beat1Alpha);
    } else if (isBeat2 && beat2Alpha > 0.05) {
      drawSpeechBubble(ctx, momX - 15, height * 0.36, 'Mẹ yêu con nhiều lắm, con ngoan của Mẹ! 🥰', true, beat2Alpha);
    }
  } else if (templateId === 'teacher-student') {
    const stuStartX = width * 0.20;
    const stuTargetX = width * 0.38;
    const stuRatio = Math.min(1, progress * 3.2);
    const stuX = stuStartX + (stuTargetX - stuStartX) * stuRatio;
    const teacherX = width * 0.65;

    drawCartoonStudent(ctx, stuX, height * 0.68, 1.22, stuRatio < 1 ? elapsed * 2 : 0);
    drawCartoonTeacher(ctx, teacherX, height * 0.65, 1.28, elapsed);

    // Sequential Speech Bubbles (NEVER OVERLAP)
    if (isBeat1 && beat1Alpha > 0.05) {
      drawSpeechBubble(ctx, stuX + 15, height * 0.40, 'Hôm nay em mang hoa & bài điểm 10 tặng Cô! 📚', false, beat1Alpha);
    } else if (isBeat2 && beat2Alpha > 0.05) {
      drawSpeechBubble(ctx, teacherX - 15, height * 0.36, 'Cô cảm ơn em! Chúc em luôn chăm ngoan! 🌟', true, beat2Alpha);
    }
  } else {
    // Sisters & BFFs
    const bff1X = width * 0.38;
    const bff2X = width * 0.62;
    drawCartoonGirl(ctx, bff1X, height * 0.68, 1.2, elapsed * 0.9, 0.8, isBlinking);
    drawCartoonGirl(ctx, bff2X, height * 0.68, 1.2, elapsed * 0.9, 0.9, isBlinking);

    // Sequential Speech Bubbles (NEVER OVERLAP)
    if (isBeat1 && beat1Alpha > 0.05) {
      drawSpeechBubble(ctx, bff1X, height * 0.38, 'Surprise! Chúc mừng 20/10 cô bạn thân xịn xò! 🎁', false, beat1Alpha);
    } else if (isBeat2 && beat2Alpha > 0.05) {
      drawSpeechBubble(ctx, bff2X, height * 0.38, 'Aaaa thích quá! Cảm ơn cậu nhiều nha! 💖', true, beat2Alpha);
    }
  }

  // 3. Confetti Explosion when envelope opens (around progress 0.46 to 0.74)
  if (showConfetti && progress >= 0.46 && progress <= 0.74) {
    const explosionPhase = (progress - 0.46) / 0.28;
    drawConfettiExplosion(ctx, width, height, explosionPhase);
  }

  // 4. Render Animated Confession Love Letter Card (unfolds starting at 0.44 without bubble interference)
  drawAnimatedLoveLetter(
    ctx,
    width,
    height,
    progress,
    recipientName,
    senderName,
    message,
    templateId
  );
}
