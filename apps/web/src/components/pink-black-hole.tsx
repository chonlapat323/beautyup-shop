"use client";

import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  glowRadius: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  phase: number;
  phaseSpeed: number;
  color: string;
}

export function PinkBlackHoleEffect({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    // พาเลทสีชมพูนุ่มนวลสไตล์สกินแคร์/บิวตี้
    const palettes = [
      "214, 41, 127",   // Brand Pink #d6297f
      "244, 114, 182",  // Soft Rose
      "251, 207, 232",  // Light Blush
      "253, 242, 248",  // Warm Pinkish White
    ];

    const MOTE_COUNT = 55; // จำนวนกำลังดี ไม่รก
    const motes: Mote[] = [];

    const createMote = (): Mote => {
      const size = Math.random() * 4 + 2; // ละอองใหญ่ฟุ้งๆ นวลตา
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        // ความเร็วช้ามาก ลอยเอื่อยๆ นุ่มละมุน
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.08 - Math.random() * 0.16,
        size,
        glowRadius: size * (4.5 + Math.random() * 2), // รัศมีความฟุ้งกว้าง
        alpha: Math.random() * 0.35 + 0.05,
        targetAlpha: Math.random() * 0.55 + 0.15,
        fadeSpeed: 0.003 + Math.random() * 0.006, // ค่อยๆ สว่าง ค่อยๆ จางลงช้าๆ
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.006 + Math.random() * 0.01,
        color: palettes[Math.floor(Math.random() * palettes.length)],
      };
    };

    for (let i = 0; i < MOTE_COUNT; i++) {
      motes.push(createMote());
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop: ลอยช้า นุ่ม ละมุนตา ไม่หมุน ไม่สะบัด
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];

        // ค่อยๆ โยกพริ้วไหวช้าๆ เหมือนละอองลอยในอากาศ
        m.phase += m.phaseSpeed;
        m.x += m.vx + Math.sin(m.phase) * 0.15;
        m.y += m.vy;

        // วงจรกะพริบนุ่มนวล (Soft Breathing Transition)
        m.alpha += (m.targetAlpha - m.alpha) * m.fadeSpeed;
        if (Math.abs(m.targetAlpha - m.alpha) < 0.03) {
          m.targetAlpha = Math.random() > 0.4 ? Math.random() * 0.6 + 0.15 : 0.04;
        }

        // วนกลับมาเมื่อลอยพ้นขอบบน
        if (m.y < -30) {
          m.y = height + 20;
          m.x = Math.random() * width;
          m.alpha = 0.02;
        }
        if (m.x < -30) m.x = width + 20;
        if (m.x > width + 30) m.x = -20;

        // Soft Edge Alpha Falloff: ค่อยๆ จางหายไปอย่างเป็นธรรมชาติเมื่อเข้าใกล้ขอบแคนวาส (ไม่มีรอยตัดขอบสี่เหลี่ยม)
        const edgeDistX = Math.min(m.x, width - m.x);
        const edgeDistY = Math.min(m.y, height - m.y);
        const edgeFade = Math.min(1, Math.max(0, Math.min(edgeDistX, edgeDistY) / 50));
        const effectiveAlpha = m.alpha * edgeFade;

        if (effectiveAlpha <= 0.005) continue;

        // 1. วาดม่านหมอกละอองฟุ้ง (Soft Feathered Glow)
        const radGlow = ctx.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          m.glowRadius
        );
        radGlow.addColorStop(0, `rgba(${m.color}, ${effectiveAlpha * 0.85})`);
        radGlow.addColorStop(0.35, `rgba(${m.color}, ${effectiveAlpha * 0.45})`);
        radGlow.addColorStop(0.75, `rgba(${m.color}, ${effectiveAlpha * 0.15})`);
        radGlow.addColorStop(1, `rgba(${m.color}, 0)`);

        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. แกนประกายแสงนวลตาตรงกลาง (Soft Inner Sparkle)
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full z-15 ${className}`}
    />
  );
}
export default PinkBlackHoleEffect;
