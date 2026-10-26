"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"

// ─────────────────────────────────────────────────────────────
// TIME DECIDES. NOT THE BLADE.
// Choose a blade, hover/drag to reveal. Organic ink-style brush erases
// the top layer, revealing the clean/cyber photo underneath.
// Stubble/cyber particles fall where you cut, a SMOOTH % counter climbs
// to FLAWLESS, a chrome light-glint sweeps the background, and
// the whole scene breathes: liquid gradient blobs, film grain,
// mouse parallax, metallic sheen on the title. Zero external sound dependencies.
// ─────────────────────────────────────────────────────────────

export interface Blade {
  id: string
  name: string
  image: string
  strokeRadius: number
}

const REPO = "https://raw.githubusercontent.com/gughigug/blade-hero-assets/main"

export const DEFAULT_BLADES: Blade[] = [
  { id: "safety", name: "SAFETY", image: `${REPO}/blade-safety.png`, strokeRadius: 17 },
  { id: "straight", name: "STRAIGHT", image: `${REPO}/blade-straight.png`, strokeRadius: 24 },
  { id: "cartridge", name: "CARTRIDGE", image: `${REPO}/blade-cartridge.png`, strokeRadius: 33 },
]

export interface BladeHeroProps {
  title?: string
  panelLabel?: string
  faceBearded?: string
  faceShaved?: string
  blades?: Blade[]
  signature?: { name: string; url: string } | false
  sound?: boolean
  fullBleed?: boolean
  /** Explicit theme. Defaults to dark (the intended cinematic look) */
  theme?: "dark" | "light"
  className?: string
  style?: React.CSSProperties
  compact?: boolean
  onSmoothProgress?: (pct: number) => void
}

const DEFAULT_SIGNATURE = { name: "by guglielmogiannattasio.exe", url: "https://www.guglielmogiannattasio.it" }

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const PIXEL_FONT = "'Courier New', ui-monospace, monospace"

const THEME_VARS = {
  dark: {
    background: "260 25% 3%",
    foreground: "255 25% 96%",
    card: "260 20% 9%",
    cardForeground: "255 25% 96%",
    border: "255 20% 90%",
    muted: "255 10% 68%",
  },
  light: {
    background: "250 45% 97%",
    foreground: "260 30% 11%",
    card: "0 0% 100%",
    cardForeground: "260 30% 11%",
    border: "260 20% 20%",
    muted: "260 10% 38%",
  },
} as const

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='7' stitchTiles='stitch'/>
    <feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.045 0'/>
  </filter>
  <rect width='100%' height='100%' filter='url(%23n)'/>
</svg>`
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

// ── synthesized sound ──────────────────────────────────────
function playSelectClick(ctx: AudioContext) {
  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = "square"
    osc.frequency.setValueAtTime(1100, now)
    osc.frequency.exponentialRampToValueAtTime(1900, now + 0.05)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.1)
  } catch {
    // Audio context may be closed or restricted
  }
}

function playShaveSwish(ctx: AudioContext) {
  try {
    const now = ctx.currentTime
    const detune = 0.85 + Math.random() * 0.3
    const bufferSize = Math.floor(ctx.sampleRate * 0.11)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.playbackRate.value = detune
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 2200 * detune
    bp.Q.value = 0.8
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.16, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    noise.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  } catch {
    // Ignore audio error
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  len: number
  angle: number
}

export function BladeHero({
  title = "TIME DECIDES. NOT THE BLADE.",
  panelLabel = "CHOOSE YOUR BLADE",
  faceBearded = `${REPO}/face-bearded.png`,
  faceShaved = `${REPO}/face-shaved.png`,
  blades = DEFAULT_BLADES,
  signature = DEFAULT_SIGNATURE,
  sound = true,
  fullBleed = true,
  className,
  style,
  theme = "dark",
  onSmoothProgress,
}: BladeHeroProps) {
  const t = THEME_VARS[theme]
  const bgVar = `hsl(var(--bh-background, ${t.background}))`
  const fgVar = `hsl(var(--bh-foreground, ${t.foreground}))`
  const fgMutedVar = (a: number) => `hsl(var(--bh-foreground, ${t.foreground}) / ${a})`
  const mutedVar = (a = 1) => `hsl(var(--bh-muted, ${t.muted}) / ${a})`
  const cardVar = (a = 1) => `hsl(var(--bh-card, ${t.card}) / ${a})`
  const borderVar = (a = 1) => `hsl(var(--bh-border, ${t.border}) / ${a})`
  const rootRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const beardedImgRef = useRef<HTMLImageElement | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastSwishRef = useRef(0)
  const wasInsideRef = useRef(false)
  const lastCursorClientRef = useRef<{ x: number; y: number } | null>(null)
  const cursorAngleTargetRef = useRef(-18)
  const cursorAngleCurrentRef = useRef(-18)
  const lastStampPosRef = useRef<{ x: number; y: number } | null>(null)
  const logicalSizeRef = useRef({ w: 0, h: 0 })
  const cursorPosRef = useRef({ x: 0, y: 0 })
  const cursorCurrentRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const lastParticleSpawnRef = useRef(0)
  const smoothCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bgTargetRef = useRef({ x: 0, y: 0 })
  const bgCurrentRef = useRef({ x: 0, y: 0 })

  const [selectedBlade, setSelectedBlade] = useState<Blade>(blades[0] || DEFAULT_BLADES[0])
  const [soundOn, setSoundOn] = useState(sound)
  const [ready, setReady] = useState(false)
  const [showGlint, setShowGlint] = useState(false)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)
  const [smoothPct, setSmoothPct] = useState(0)
  const [shaveAnnouncement, setShaveAnnouncement] = useState("")
  const isShavenRef = useRef(false)
  const selectedBladeRef = useRef(selectedBlade)
  const soundOnRef = useRef(soundOn)
  selectedBladeRef.current = selectedBlade
  soundOnRef.current = soundOn

  function getCtx(): AudioContext | null {
    try {
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (Ctx) audioCtxRef.current = new Ctx()
      }
      return audioCtxRef.current
    } catch {
      return null
    }
  }

  function fireSelectSound() {
    if (!soundOnRef.current) return
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === "suspended") ctx.resume().then(() => playSelectClick(ctx)).catch(() => {})
    else playSelectClick(ctx)
  }

  function fireSwishSound() {
    if (!soundOnRef.current) return
    const now = performance.now()
    if (now - lastSwishRef.current < 210) return
    lastSwishRef.current = now
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === "suspended") ctx.resume().then(() => playShaveSwish(ctx)).catch(() => {})
    else playShaveSwish(ctx)
  }

  useEffect(() => {
    setIsCoarsePointer(typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowGlint(true), 900)
    return () => clearTimeout(t)
  }, [])

  const fillCanvasWithBeard = useCallback(() => {
    const canvas = canvasRef.current
    const img = beardedImgRef.current
    if (!canvas || !img || !img.complete) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { w, h } = logicalSizeRef.current
    if (w <= 0 || h <= 0) return
    ctx.globalCompositeOperation = "source-over"
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = faceBearded
    img.onload = () => {
      beardedImgRef.current = img
      setReady(true)
      fillCanvasWithBeard()
    }
    img.onerror = () => {
      setReady(true)
    }
    beardedImgRef.current = img
  }, [faceBearded, fillCanvasWithBeard])

  useEffect(() => {
    const canvas = canvasRef.current
    const pCanvas = particleCanvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      logicalSizeRef.current = { w: rect.width, h: rect.height }
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (pCanvas) {
        pCanvas.width = canvas.width
        pCanvas.height = canvas.height
        const pctx = pCanvas.getContext("2d")
        if (pctx) pctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      fillCanvasWithBeard()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [fillCanvasWithBeard])

  // ── smooth % (throttled canvas sampling) ──────────────────
  const computeSmoothness = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const sw = 36
      const sh = 54
      const off = document.createElement("canvas")
      off.width = sw
      off.height = sh
      const octx = off.getContext("2d")
      if (!octx) return
      octx.drawImage(canvas, 0, 0, sw, sh)
      const data = octx.getImageData(0, 0, sw, sh).data
      let clear = 0
      const total = sw * sh
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 20) clear++
      }
      const pct = Math.round((clear / total) * 100)
      setSmoothPct(pct)
      if (onSmoothProgress) onSmoothProgress(pct)
    } catch {
      setSmoothPct(-1)
    }
  }, [onSmoothProgress])

  const scheduleSmoothCheck = useCallback(() => {
    if (smoothCheckTimerRef.current) clearTimeout(smoothCheckTimerRef.current)
    smoothCheckTimerRef.current = setTimeout(computeSmoothness, 350)
  }, [computeSmoothness])

  // ── organic ink-style erase stamp ─────────────────────────
  const spawnParticles = useCallback((x: number, y: number) => {
    const now = performance.now()
    if (now - lastParticleSpawnRef.current < 28) return
    lastParticleSpawnRef.current = now
    const arr = particlesRef.current
    const n = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      arr.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 0.5 + Math.random() * 1.1,
        life: 1,
        len: 2 + Math.random() * 3.5,
        angle: Math.random() * Math.PI,
      })
    }
    if (arr.length > 240) arr.splice(0, arr.length - 240)
  }, [])

  const stampAt = useCallback(
    (x: number, y: number, r: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const segments = 26
      const wobble: [number, number, number] = [0.16, 0.08, 0.05]
      const seed = Math.random() * Math.PI * 2

      ctx.save()
      ctx.globalCompositeOperation = "destination-out"
      const g = ctx.createRadialGradient(x, y, r * 0.18, x, y, r)
      g.addColorStop(0, "rgba(0,0,0,1)")
      g.addColorStop(0.6, "rgba(0,0,0,0.92)")
      g.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2
        const wob =
          1 +
          wobble[0] * Math.sin(a * 3 + seed) +
          wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          wobble[2] * Math.sin(a * 7 + seed * 0.7)
        const px = x + Math.cos(a) * r * wob
        const py = y + Math.sin(a) * r * wob
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      spawnParticles(x, y)
    },
    [spawnParticles]
  )

  const stampAlong = useCallback(
    (x: number, y: number, r: number) => {
      const last = lastStampPosRef.current
      if (!last) {
        stampAt(x, y, r)
      } else {
        const dx = x - last.x
        const dy = y - last.y
        const dist = Math.hypot(dx, dy)
        const step = Math.max(6, r * 0.35)
        const steps = Math.max(1, Math.ceil(dist / step))
        for (let i = 1; i <= steps; i++) {
          stampAt(last.x + (dx * i) / steps, last.y + (dy * i) / steps, r)
        }
      }
      lastStampPosRef.current = { x, y }
    },
    [stampAt]
  )

  function eraseAtClient(clientX: number, clientY: number, radius: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    stampAlong(clientX - rect.left, clientY - rect.top, radius)
    scheduleSmoothCheck()
  }

  // ── particles loop ──────────────────
  useEffect(() => {
    let rafId = 0
    const tick = () => {
      const pCanvas = particleCanvasRef.current
      if (pCanvas) {
        const ctx = pCanvas.getContext("2d")
        if (ctx) {
          const { w, h } = logicalSizeRef.current
          ctx.clearRect(0, 0, w, h)
          const arr = particlesRef.current
          for (let i = arr.length - 1; i >= 0; i--) {
            const p = arr[i]
            p.x += p.vx
            p.y += p.vy
            p.vy += 0.06
            p.life -= 0.022
            if (p.life <= 0 || p.y > h + 10) {
              arr.splice(i, 1)
              continue
            }
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.angle)
            ctx.strokeStyle = `rgba(168,140,255,${0.85 * p.life})`
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.moveTo(-p.len / 2, 0)
            ctx.lineTo(p.len / 2, 0)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ── hover/drag reveal + smoothed cursor + smoothed parallax ──
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let rafId = 0

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      cursorPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (cursorRef.current) cursorRef.current.style.opacity = inside && !isCoarsePointer ? "1" : "0"

      if (inside) {
        if (!wasInsideRef.current) {
          lastStampPosRef.current = null
          fireSwishSound()
        }
        eraseAtClient(e.clientX, e.clientY, selectedBladeRef.current.strokeRadius)
        isShavenRef.current = true

        const lastP = lastCursorClientRef.current
        if (lastP) {
          const dx = e.clientX - lastP.x
          const dy = e.clientY - lastP.y
          if (Math.hypot(dx, dy) > 2) {
            cursorAngleTargetRef.current = (Math.atan2(dy, dx) * 180) / Math.PI
          }
        }
        lastCursorClientRef.current = { x: e.clientX, y: e.clientY }
      } else {
        lastStampPosRef.current = null
      }
      wasInsideRef.current = inside

      const root = rootRef.current
      if (root) {
        const rrect = root.getBoundingClientRect()
        const nx = clamp(((e.clientX - rrect.left) / rrect.width) * 2 - 1, -1, 1)
        const ny = clamp(((e.clientY - rrect.top) / rrect.height) * 2 - 1, -1, 1)
        bgTargetRef.current = { x: nx * -14, y: ny * -10 }
      }
    }

    function frame() {
      const c = cursorCurrentRef.current
      const t = cursorPosRef.current
      c.x += (t.x - c.x) * 0.35
      c.y += (t.y - c.y) * 0.35
      cursorAngleCurrentRef.current += (cursorAngleTargetRef.current - cursorAngleCurrentRef.current) * 0.2
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${c.x}px, ${c.y}px) translate(-15%, -50%) rotate(${cursorAngleCurrentRef.current}deg)`
      }

      const bc = bgCurrentRef.current
      const bt = bgTargetRef.current
      bc.x += (bt.x - bc.x) * 0.06
      bc.y += (bt.y - bc.y) * 0.06
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${bc.x}px, ${bc.y}px)`
      }

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    window.addEventListener("pointermove", onMove)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(rafId)
    }
  }, [isCoarsePointer])

  function handleReset() {
    lastStampPosRef.current = null
    particlesRef.current = []
    fillCanvasWithBeard()
    setSmoothPct(0)
    isShavenRef.current = false
    setShaveAnnouncement("Avatar layer reset.")
    if (onSmoothProgress) onSmoothProgress(0)
  }

  function handleBladeSelect(b: Blade) {
    setSelectedBlade(b)
    fireSelectSound()
  }

  function sweepFullReveal() {
    const canvas = canvasRef.current
    if (!canvas) return
    const { w, h } = logicalSizeRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    fireSwishSound()
    const steps = 20
    let i = 0
    const bandHeight = h / steps
    const anim = () => {
      if (i >= steps) {
        setSmoothPct(100)
        if (onSmoothProgress) onSmoothProgress(100)
        return
      }
      ctx.save()
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fillRect(0, i * bandHeight - 2, w, bandHeight + 5)
      ctx.restore()
      i++
      setTimeout(() => requestAnimationFrame(anim), 16)
    }
    anim()
  }

  function handleStageKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return
    e.preventDefault()
    if (isShavenRef.current) {
      handleReset()
    } else {
      sweepFullReveal()
      isShavenRef.current = true
      setShaveAnnouncement(`Revealed with the ${selectedBlade.name.toLowerCase()} tool.`)
    }
  }

  const showCounter = smoothPct >= 0

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: "relative",
        height: fullBleed ? "100dvh" : "100%",
        width: "100%",
        background: bgVar,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(14px, 3vw, 56px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <style>{`
        @keyframes bh-blob-a {
          0%   { transform: translate(-8%, -10%) scale(1); }
          50%  { transform: translate(10%, 6%) scale(1.25); }
          100% { transform: translate(-8%, -10%) scale(1); }
        }
        @keyframes bh-blob-b {
          0%   { transform: translate(10%, 8%) scale(1.1); }
          50%  { transform: translate(-8%, -6%) scale(1.3); }
          100% { transform: translate(10%, 8%) scale(1.1); }
        }
        @keyframes bh-blob-c {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes bh-pulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.95; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes bh-float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes bh-glint {
          0%   { transform: translateX(-60vw) rotate(-16deg); opacity: 0; }
          4%   { opacity: 0.9; }
          14%  { transform: translateX(120vw) rotate(-16deg); opacity: 0; }
          100% { transform: translateX(120vw) rotate(-16deg); opacity: 0; }
        }
        @keyframes bh-sheen {
          0%, 100% { background-position: 0% 0; }
          50%      { background-position: 100% 0; }
        }
        * { box-sizing: border-box; }
        .bh-title {
          background: linear-gradient(110deg, #cbccd9 0%, #ffffff 24%, #9d9db4 46%, #ffffff 72%, #c6c7d6 100%);
          background-size: 230% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: bh-sheen 6.5s ease-in-out infinite;
        }
        .bh-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(14px, 2.4vh, 28px);
          width: 100%;
          height: 100%;
          max-width: 1200px;
          min-height: 0;
        }
        .bh-stage {
          height: min(44dvh, 400px);
          width: auto;
          aspect-ratio: 724 / 1086;
        }
        .bh-focusable:focus-visible {
          outline: 3px solid rgba(160,140,255,0.9);
          outline-offset: 3px;
        }
        @media (min-width: 860px) {
          .bh-layout {
            flex-direction: row;
            gap: clamp(40px, 6vw, 100px);
          }
          .bh-panel-col {
            align-items: flex-start !important;
            text-align: left !important;
            width: 260px;
            flex-shrink: 0;
          }
          .bh-stage {
            height: min(72dvh, 680px);
          }
        }
        @media (max-width: 859px) and (min-height: 720px) {
          .bh-stage { height: min(50dvh, 460px); }
        }
      `}</style>

      {/* rich liquid background with micro-parallax */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-40px",
          overflow: "hidden",
          pointerEvents: "none",
          transition: "transform 0.6s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "85%",
            height: "85%",
            left: "-15%",
            top: "-18%",
            background: "radial-gradient(circle, rgba(108,70,255,0.55), rgba(108,70,255,0) 68%)",
            filter: "blur(50px)",
            mixBlendMode: "screen",
            animation: "bh-blob-a 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "75%",
            height: "75%",
            right: "-15%",
            bottom: "-18%",
            background: "radial-gradient(circle, rgba(255,70,150,0.32), rgba(255,70,150,0) 68%)",
            filter: "blur(55px)",
            mixBlendMode: "screen",
            animation: "bh-blob-b 24s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "55%",
            height: "55%",
            left: "50%",
            top: "40%",
            background: "radial-gradient(circle, rgba(90,200,255,0.22), rgba(90,200,255,0) 70%)",
            filter: "blur(60px)",
            mixBlendMode: "screen",
            animation: "bh-blob-c 14s ease-in-out infinite",
          }}
        />
        {showGlint && (
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: 0,
              width: "180px",
              height: "140%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 45%, rgba(200,220,255,0.75) 50%, rgba(255,255,255,0.55) 55%, transparent)",
              filter: "blur(6px)",
              mixBlendMode: "screen",
              animation: "bh-glint 9s ease-in-out infinite",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,255,255,0.10), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: GRAIN_URL,
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 55%, rgba(2,1,6,0.75) 100%)",
          }}
        />
      </div>

      {signature && (
        <a
          href={signature.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontFamily: SANS,
            fontSize: "clamp(10px, 1.4vw, 12px)",
            letterSpacing: "0.04em",
            color: fgMutedVar(0.6),
            textDecoration: "none",
            zIndex: 3,
          }}
        >
          {signature.name}
        </a>
      )}

      <button
        type="button"
        onClick={() => setSoundOn((s: boolean) => !s)}
        aria-label={soundOn ? "Mute sound" : "Unmute sound"}
        style={{
          position: "absolute",
          top: "clamp(12px, 2.5vw, 24px)",
          right: "clamp(12px, 2.5vw, 24px)",
          zIndex: 3,
          background: cardVar(0.5),
          backdropFilter: "blur(8px)",
          border: `1px solid ${borderVar(0.16)}`,
          borderRadius: 999,
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: fgVar,
          cursor: "pointer",
        }}
      >
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      <div className="bh-layout" style={{ position: "relative", zIndex: 2 }}>
        <div
          className="bh-panel-col"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 20,
          }}
        >
          <span
            className="bh-title"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "clamp(22px, 2.6vw, 34px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <span
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: 11,
                letterSpacing: "0.3em",
                color: fgMutedVar(0.65),
              }}
            >
              {panelLabel}
            </span>
            <div style={{ display: "flex", gap: 12, perspective: "900px", justifyContent: "center" }}>
              {blades.map((b) => (
                <BladeCard key={b.id} blade={b} selected={selectedBlade.id === b.id} onSelect={() => handleBladeSelect(b)} cardBg={cardVar(0.35)} cardBorder={borderVar(0.14)} />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 600,
              color: fgMutedVar(0.85),
              background: cardVar(0.5),
              border: `1px solid ${borderVar(0.16)}`,
              borderRadius: 999,
              padding: "8px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "1.1em" }}>✨</span> RESET
          </button>
        </div>

        <div
          style={{
            position: "relative",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "130%",
              height: "115%",
              background: "radial-gradient(ellipse, rgba(140,100,255,0.5), rgba(140,100,255,0) 68%)",
              filter: "blur(30px)",
              mixBlendMode: "screen",
              animation: "bh-pulse 3.6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            ref={stageRef}
            className="bh-stage bh-focusable"
            tabIndex={0}
            role="button"
            aria-label={`Reveal the portrait with the ${selectedBlade.name.toLowerCase()} tool. Press Enter or Space to reveal, press again to reset.`}
            onKeyDown={handleStageKeyDown}
            style={{
              position: "relative",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${borderVar(0.08)}`,
              cursor: isCoarsePointer ? "default" : "none",
              touchAction: "none",
              opacity: ready ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            <span
              aria-live="polite"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
              }}
            >
              {shaveAnnouncement}
            </span>
            <img
              src={faceShaved}
              alt=""
              draggable={false}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", userSelect: "none", pointerEvents: "none" }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none" }} />
            <canvas
              ref={particleCanvasRef}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            />
            {showCounter && (
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  bottom: 10,
                  fontFamily: PIXEL_FONT,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: smoothPct >= 99 ? "rgba(170,150,255,1)" : "rgba(240,238,248,0.75)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                {smoothPct >= 99 ? "FLAWLESS." : `REVEALED ${smoothPct}%`}
              </span>
            )}
            {!isCoarsePointer && (
              <div
                ref={cursorRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 58,
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.65)) drop-shadow(0 0 18px rgba(150,120,255,0.35))",
                  zIndex: 6,
                  willChange: "transform",
                }}
              >
                <img src={selectedBlade.image} alt="" style={{ width: "100%", display: "block" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BladeCard({ blade, selected, onSelect, cardBg, cardBorder }: { blade: Blade; selected: boolean; onSelect: () => void; cardBg: string; cardBorder: string }) {
  const cardRef = useRef<HTMLButtonElement>(null)

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateY(${px * 34}deg) rotateX(${-py * 34}deg) translateZ(22px) scale(1.12)`
  }
  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)"
  }

  return (
    <div style={{ animation: "bh-float 3.4s ease-in-out infinite", animationDelay: `${blade.id.length * 0.15}s` }}>
      <button
        ref={cardRef}
        type="button"
        onClick={onSelect}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          position: "relative",
          width: 76,
          aspectRatio: "1 / 1",
          borderRadius: 12,
          background: selected ? "rgba(120,90,255,0.16)" : cardBg,
          border: selected ? "2px solid rgba(160,140,255,0.9)" : `1px solid ${cardBorder}`,
          boxShadow: selected ? "0 0 26px rgba(130,100,255,0.4)" : "0 10px 22px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          cursor: "pointer",
          transformStyle: "preserve-3d",
          transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <img
          src={blade.image}
          alt={blade.name}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
        />
        {selected && (
          <span
            style={{
              position: "absolute",
              bottom: -18,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Courier New', ui-monospace, monospace",
              fontSize: 8,
              letterSpacing: "0.12em",
              color: "rgba(160,140,255,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            EQUIPPED
          </span>
        )}
      </button>
    </div>
  )
}

export default BladeHero
