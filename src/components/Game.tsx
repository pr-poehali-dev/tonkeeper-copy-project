import { useEffect, useRef, useState, useCallback } from "react";

const W = 480;
const H = 320;
const GRAVITY = 0.55;
const JUMP = -13;
const SPEED = 3.5;
const GROUND = H - 48;

interface Platform { x: number; y: number; w: number; h: number }
interface Coin { x: number; y: number; r: number; collected: boolean; animT: number }
interface Enemy { x: number; y: number; dir: number; dead: boolean; deadTimer: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string }

function makeLevel(offset: number): { platforms: Platform[]; coins: Coin[]; enemies: Enemy[] } {
  const platforms: Platform[] = [
    { x: offset + 0,   y: GROUND,     w: 200, h: 20 },
    { x: offset + 220, y: GROUND,     w: 180, h: 20 },
    { x: offset + 430, y: GROUND,     w: 200, h: 20 },
    { x: offset + 120, y: GROUND - 80, w: 100, h: 16 },
    { x: offset + 290, y: GROUND - 70, w: 80,  h: 16 },
    { x: offset + 400, y: GROUND - 110, w: 110, h: 16 },
    { x: offset + 550, y: GROUND - 80, w: 90,  h: 16 },
    { x: offset + 650, y: GROUND,     w: 160, h: 20 },
    { x: offset + 680, y: GROUND - 100, w: 80, h: 16 },
  ];
  const coins: Coin[] = [
    { x: offset + 140, y: GROUND - 110, r: 8, collected: false, animT: 0 },
    { x: offset + 170, y: GROUND - 110, r: 8, collected: false, animT: 0.5 },
    { x: offset + 310, y: GROUND - 100, r: 8, collected: false, animT: 0.2 },
    { x: offset + 335, y: GROUND - 100, r: 8, collected: false, animT: 0.7 },
    { x: offset + 420, y: GROUND - 140, r: 8, collected: false, animT: 0.3 },
    { x: offset + 450, y: GROUND - 140, r: 8, collected: false, animT: 0.9 },
    { x: offset + 480, y: GROUND - 140, r: 8, collected: false, animT: 0.1 },
    { x: offset + 560, y: GROUND - 110, r: 8, collected: false, animT: 0.6 },
    { x: offset + 590, y: GROUND - 110, r: 8, collected: false, animT: 0.4 },
    { x: offset + 695, y: GROUND - 130, r: 8, collected: false, animT: 0.8 },
    { x: offset + 260, y: GROUND - 30,  r: 8, collected: false, animT: 0.0 },
    { x: offset + 340, y: GROUND - 30,  r: 8, collected: false, animT: 0.5 },
    { x: offset + 666, y: GROUND - 30,  r: 8, collected: false, animT: 0.3 },
    { x: offset + 720, y: GROUND - 30,  r: 8, collected: false, animT: 0.7 },
  ];
  const enemies: Enemy[] = [
    { x: offset + 250, y: GROUND - 24, dir: 1,  dead: false, deadTimer: 0 },
    { x: offset + 460, y: GROUND - 24, dir: -1, dead: false, deadTimer: 0 },
    { x: offset + 660, y: GROUND - 24, dir: 1,  dead: false, deadTimer: 0 },
  ];
  return { platforms, coins, enemies };
}

function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number, frame: number, onGround: boolean) {
  ctx.save();
  ctx.translate(x + 16, y + 22);
  if (dir < 0) ctx.scale(-1, 1);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(0, 14, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs walk animation
  const legAnim = onGround ? Math.sin(frame * 0.3) * 6 : 0;
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(-10, 8, 8, 12 + (onGround ? legAnim : 0));
  ctx.fillRect(2,   8, 8, 12 - (onGround ? legAnim : 0));

  // Body (dark coat)
  ctx.fillStyle = "#2d2d44";
  ctx.beginPath();
  ctx.roundRect(-11, -2, 22, 14, 3);
  ctx.fill();

  // White shirt
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(-5, 0, 10, 8);

  // Beard
  ctx.fillStyle = "#c8a96e";
  ctx.beginPath();
  ctx.roundRect(-6, 2, 12, 8, [0, 0, 4, 4]);
  ctx.fill();

  // Head
  ctx.fillStyle = "#f5c99e";
  ctx.beginPath();
  ctx.ellipse(0, -10, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sidelocks (пейсы)
  ctx.strokeStyle = "#c8a96e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-9, -14); ctx.quadraticCurveTo(-14, -4, -10, 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(9, -14); ctx.quadraticCurveTo(14, -4, 10, 2);
  ctx.stroke();

  // Eyes
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath(); ctx.arc(-3.5, -11, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(3.5,  -11, 1.8, 0, Math.PI * 2); ctx.fill();
  // Eye shine
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-2.8, -12, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.2,  -12, 0.7, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.fillStyle = "#e8a87c";
  ctx.beginPath();
  ctx.ellipse(0, -8, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kippah (ермолка)
  ctx.fillStyle = "#1a3a5c";
  ctx.beginPath();
  ctx.arc(0, -19, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#245280";
  ctx.fillRect(-10, -20, 20, 3);

  // Arms
  ctx.fillStyle = "#2d2d44";
  const armSwing = onGround ? Math.sin(frame * 0.3) * 8 : 0;
  ctx.save();
  ctx.translate(-13, 0);
  ctx.rotate((-20 + armSwing) * Math.PI / 180);
  ctx.fillRect(-3, 0, 6, 10);
  ctx.restore();
  ctx.save();
  ctx.translate(13, 0);
  ctx.rotate((20 - armSwing) * Math.PI / 180);
  ctx.fillRect(-3, 0, 6, 10);
  ctx.restore();

  ctx.restore();
}

function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, r: number) {
  const bob = Math.sin(t * 3) * 3;
  ctx.save();
  ctx.translate(x, y + bob);

  // Glow
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r + 6);
  grd.addColorStop(0, "rgba(255,215,0,0.4)");
  grd.addColorStop(1, "rgba(255,215,0,0)");
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(0, 0, r + 6, 0, Math.PI * 2); ctx.fill();

  // Coin body
  const coinGrd = ctx.createRadialGradient(-2, -2, 1, 0, 0, r);
  coinGrd.addColorStop(0, "#ffe066");
  coinGrd.addColorStop(0.5, "#ffd700");
  coinGrd.addColorStop(1, "#b8860b");
  ctx.fillStyle = coinGrd;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

  // $ symbol
  ctx.fillStyle = "#7a5200";
  ctx.font = `bold ${r + 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", 0, 1);

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number) {
  if (e.dead) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, e.deadTimer / 30);
    ctx.translate(e.x + 12, e.y + 12);
    ctx.rotate(Math.PI);
    ctx.font = "22px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💀", 0, 0);
    ctx.restore();
    return;
  }
  const bob = Math.sin(t * 4) * 2;
  ctx.save();
  ctx.translate(e.x + 12, e.y + 12 + bob);
  if (e.dir < 0) ctx.scale(-1, 1);

  // Body
  ctx.fillStyle = "#8b1a1a";
  ctx.beginPath();
  ctx.arc(0, 2, 12, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (angry)
  ctx.fillStyle = "#ff4444";
  ctx.beginPath(); ctx.arc(-5, -2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5,  -2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-4, -3, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6,  -3, 1.2, 0, Math.PI * 2); ctx.fill();

  // Horns
  ctx.fillStyle = "#6b0000";
  ctx.beginPath();
  ctx.moveTo(-8, -10); ctx.lineTo(-12, -18); ctx.lineTo(-4, -11); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, -10);  ctx.lineTo(12, -18);  ctx.lineTo(4, -11);  ctx.closePath(); ctx.fill();

  // Mouth
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 6, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, isGround: boolean) {
  if (isGround) {
    // Ground tile
    const grd = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grd.addColorStop(0, "#4caf50");
    grd.addColorStop(0.3, "#388e3c");
    grd.addColorStop(1, "#1b5e20");
    ctx.fillStyle = grd;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    // Grass blades
    ctx.fillStyle = "#66bb6a";
    for (let i = 0; i < p.w; i += 12) {
      ctx.fillRect(p.x + i, p.y, 4, 4);
    }
  } else {
    // Platform
    const grd = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grd.addColorStop(0, "#8d6e63");
    grd.addColorStop(1, "#5d4037");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 4);
    ctx.fill();
    ctx.fillStyle = "#a1887f";
    ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, 3);
  }
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    px: 60, py: GROUND - 36,
    vx: 0, vy: 0,
    onGround: false,
    dir: 1,
    frame: 0,
    camX: 0,
    score: 0,
    lives: 3,
    gameOver: false,
    won: false,
    keys: {} as Record<string, boolean>,
    time: 0,
    particles: [] as Particle[],
    invincible: 0,
    ...makeLevel(0),
    worldWidth: 830,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const animRef = useRef<number>(0);
  const touchRef = useRef({ left: false, right: false, jump: false });

  const reset = useCallback(() => {
    const level = makeLevel(0);
    Object.assign(stateRef.current, {
      px: 60, py: GROUND - 36,
      vx: 0, vy: 0,
      onGround: false,
      dir: 1,
      frame: 0,
      camX: 0,
      score: 0,
      lives: 3,
      gameOver: false,
      won: false,
      time: 0,
      particles: [],
      invincible: 0,
      ...level,
      worldWidth: 830,
    });
    setScore(0); setLives(3); setGameOver(false); setWon(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = e.type === "keydown";
      if (["Space","ArrowUp","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;
      const t = touchRef.current;
      if (!s.gameOver && !s.won) {
        s.time += 1/60;

        // Input
        const goLeft  = s.keys["ArrowLeft"]  || s.keys["KeyA"] || t.left;
        const goRight = s.keys["ArrowRight"] || s.keys["KeyD"] || t.right;
        const jump    = s.keys["Space"] || s.keys["ArrowUp"] || s.keys["KeyW"] || t.jump;

        if (goLeft)  { s.vx = -SPEED; s.dir = -1; }
        else if (goRight) { s.vx = SPEED;  s.dir = 1;  }
        else s.vx *= 0.75;

        if (jump && s.onGround) { s.vy = JUMP; s.onGround = false; }

        // Gravity
        s.vy += GRAVITY;
        s.px += s.vx;
        s.py += s.vy;

        // Platform collision
        s.onGround = false;
        for (const p of s.platforms) {
          if (
            s.px + 30 > p.x && s.px + 2 < p.x + p.w &&
            s.py + 36 > p.y && s.py + 36 < p.y + p.h + 12 &&
            s.vy >= 0
          ) {
            s.py = p.y - 36;
            s.vy = 0;
            s.onGround = true;
          }
        }

        // World bounds
        if (s.px < 0) s.px = 0;

        // Fall death
        if (s.py > H + 60) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) { s.gameOver = true; setGameOver(true); }
          else { s.px = 60; s.py = GROUND - 36; s.vy = 0; s.vx = 0; s.camX = 0; }
        }

        // Camera
        const targetCam = s.px - W / 3;
        s.camX += (targetCam - s.camX) * 0.1;
        s.camX = Math.max(0, Math.min(s.camX, s.worldWidth - W));

        // Frame
        if (s.onGround && Math.abs(s.vx) > 0.5) s.frame++;

        // Coins
        for (const c of s.coins) {
          if (c.collected) continue;
          c.animT += 1/60;
          const dx = s.px + 16 - c.x, dy = s.py + 18 - c.y;
          if (Math.sqrt(dx*dx+dy*dy) < c.r + 16) {
            c.collected = true;
            s.score += 10;
            setScore(s.score);
            // particles
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2;
              s.particles.push({ x: c.x, y: c.y, vx: Math.cos(a)*3, vy: Math.sin(a)*3 - 1, life: 30, color: "#ffd700" });
            }
          }
        }

        // Enemies
        for (const e of s.enemies) {
          if (e.dead) { e.deadTimer--; continue; }
          e.x += e.dir * 1.5;
          // patrol
          let onP = false;
          for (const p of s.platforms) {
            if (e.x > p.x && e.x + 24 < p.x + p.w && e.y + 24 >= p.y && e.y + 24 <= p.y + 8) onP = true;
          }
          if (!onP || e.x < 0) e.dir *= -1;

          if (s.invincible > 0) { s.invincible--; continue; }

          const ex = e.x + 12, ey = e.y + 12;
          const px = s.px + 16, py = s.py + 18;
          const dist = Math.sqrt((px-ex)**2+(py-ey)**2);
          if (dist < 24) {
            // stomp from above?
            if (s.vy > 1 && s.py + 36 < e.y + 16) {
              e.dead = true; e.deadTimer = 60;
              s.vy = JUMP * 0.6;
              s.score += 50; setScore(s.score);
              for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2;
                s.particles.push({ x: ex, y: ey, vx: Math.cos(a)*4, vy: Math.sin(a)*4-2, life: 40, color: "#ff4444" });
              }
            } else {
              s.lives--;
              setLives(s.lives);
              s.invincible = 90;
              if (s.lives <= 0) { s.gameOver = true; setGameOver(true); }
              else { s.vy = JUMP * 0.5; }
            }
          }
        }

        // Particles
        s.particles = s.particles.filter(p => p.life > 0);
        for (const p of s.particles) {
          p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
        }

        // Win condition
        if (s.coins.every(c => c.collected)) { s.won = true; setWon(true); }
      }

      // --- DRAW ---
      // Sky gradient
      const skyGrd = ctx.createLinearGradient(0, 0, 0, H);
      skyGrd.addColorStop(0, "#1a1a4e");
      skyGrd.addColorStop(0.6, "#2d2d7e");
      skyGrd.addColorStop(1, "#4a4a9e");
      ctx.fillStyle = skyGrd;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      const starSeed = [37,71,113,157,191,233,277,311,353,397,421,461];
      for (const s2 of starSeed) {
        ctx.beginPath();
        ctx.arc(((s2 * 53) % W), ((s2 * 37) % (H * 0.6)), 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(-stateRef.current.camX, 0);

      const s = stateRef.current;

      // Platforms
      s.platforms.forEach(p => drawPlatform(ctx, p, p.h === 20));

      // Coins
      s.coins.forEach(c => { if (!c.collected) drawCoin(ctx, c.x, c.y, c.animT, c.r); });

      // Enemies
      s.enemies.forEach(e => drawEnemy(ctx, e, s.time));

      // Particles
      for (const p of s.particles) {
        ctx.globalAlpha = p.life / 40;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Player (blink if invincible)
      if (s.invincible === 0 || Math.floor(s.invincible / 6) % 2 === 0) {
        drawCharacter(ctx, s.px, s.py, s.dir, s.frame, s.onGround);
      }

      ctx.restore();

      // UI — HUD
      // Score
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath(); ctx.roundRect(8, 8, 120, 32, 8); ctx.fill();
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 14px 'Golos Text', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`$ ${s.score}`, 18, 29);

      // Lives
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath(); ctx.roundRect(W - 100, 8, 92, 32, 8); ctx.fill();
      ctx.textAlign = "right";
      ctx.fillStyle = "#ff6b6b";
      ctx.font = "bold 14px 'Golos Text', sans-serif";
      ctx.fillText("❤️".repeat(Math.max(0, s.lives)), W - 12, 29);

      // Coins left
      const left = s.coins.filter(c => !c.collected).length;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath(); ctx.roundRect(W/2 - 55, 8, 110, 32, 8); ctx.fill();
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = "12px 'Golos Text', sans-serif";
      ctx.fillText(`Монет: ${left} / ${s.coins.length}`, W/2, 29);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 select-none" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black" style={{ color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
          💰 Монетный Цадик
        </span>
      </div>

      {/* Canvas wrapper */}
      <div className="relative rounded-2xl overflow-hidden" style={{ border: "2px solid rgba(255,215,0,0.3)", boxShadow: "0 0 40px rgba(255,215,0,0.1)" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />

        {/* Game Over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="text-5xl">💀</div>
            <div className="text-2xl font-black text-white">Игра окончена!</div>
            <div className="text-lg" style={{ color: "#ffd700" }}>Счёт: {score}</div>
            <button
              onClick={reset}
              className="px-8 py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#ffd700,#ff8c00)", color: "#1a1a1a", boxShadow: "0 0 20px rgba(255,215,0,0.4)" }}
            >
              Играть снова
            </button>
          </div>
        )}

        {/* Win overlay */}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="text-5xl">🎉</div>
            <div className="text-2xl font-black" style={{ color: "#ffd700" }}>Все монеты собраны!</div>
            <div className="text-lg text-white">Счёт: <span style={{ color: "#ffd700" }}>{score}</span></div>
            <button
              onClick={reset}
              className="px-8 py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#ffd700,#ff8c00)", color: "#1a1a1a", boxShadow: "0 0 20px rgba(255,215,0,0.4)" }}
            >
              Играть снова
            </button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex gap-2">
          <button
            onPointerDown={() => { touchRef.current.left = true; }}
            onPointerUp={() => { touchRef.current.left = false; }}
            onPointerLeave={() => { touchRef.current.left = false; }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold active:scale-90 transition-all"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", touchAction: "none" }}
          >
            ◀
          </button>
          <button
            onPointerDown={() => { touchRef.current.right = true; }}
            onPointerUp={() => { touchRef.current.right = false; }}
            onPointerLeave={() => { touchRef.current.right = false; }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold active:scale-90 transition-all"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", touchAction: "none" }}
          >
            ▶
          </button>
        </div>
        <button
          onPointerDown={() => { touchRef.current.jump = true; }}
          onPointerUp={() => { touchRef.current.jump = false; }}
          onPointerLeave={() => { touchRef.current.jump = false; }}
          className="w-20 h-14 rounded-2xl flex items-center justify-center font-bold active:scale-90 transition-all"
          style={{ background: "linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,140,0,0.2))", border: "1px solid rgba(255,215,0,0.3)", color: "#ffd700", fontSize: "13px", touchAction: "none" }}
        >
          ПРЫЖОК
        </button>
      </div>

      {/* Controls hint */}
      <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
        Клавиатура: ← → прыжок Space/↑ · Топчи врагов сверху!
      </div>
    </div>
  );
}
