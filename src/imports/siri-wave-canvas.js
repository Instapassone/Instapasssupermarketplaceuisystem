import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   INSTAPASS ANIMATED MASCOT + SIRI WAVE CONCIERGE
   Uses the actual mascot PNG with layered CSS animations
   ═══════════════════════════════════════════════ */

const C = {
  bg: "#0d0718",
  red: "#e52330",
  redGlow: "#ff2d3a",
  crimson: "#c41e3a",
  magenta: "#d4145a",
  purple: "#7b2fbe",
  violet: "#9b4dff",
  blue: "#1e90ff",
  cyan: "#00d4ff",
  teal: "#00e5c8",
  green: "#00ff88",
  amber: "#ffaa22",
  text: "#f0eee6",
  textMuted: "rgba(240,238,230,0.4)",
  textSoft: "rgba(240,238,230,0.65)",
  panel: "rgba(14, 10, 24, 0.96)",
};

/* ─── SIRI CANVAS WAVE ─── */
function SiriWave({ active, speaking, width = 600, height = 180 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseRef = useRef(0);
  const ampRef = useRef(0.05);
  const targetRef = useRef(0.05);

  useEffect(() => {
    targetRef.current = speaking ? 1.0 : active ? 0.4 : 0.05;
  }, [active, speaking]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ampRef.current += (targetRef.current - ampRef.current) * 0.05;
    const amp = ampRef.current;
    phaseRef.current += speaking ? 0.06 : active ? 0.025 : 0.01;
    const phase = phaseRef.current;
    const cx = width / 2;
    const cy = height / 2;

    const waves = [
      { color: C.cyan, a: 0.55, freq: 0.007, mul: 1.0, spd: 1, w: 2.8 },
      { color: C.blue, a: 0.4, freq: 0.009, mul: 0.8, spd: 1.4, w: 2.2 },
      { color: C.violet, a: 0.45, freq: 0.011, mul: 0.65, spd: 0.7, w: 2 },
      { color: C.magenta, a: 0.5, freq: 0.008, mul: 0.9, spd: 1.6, w: 2.5 },
      { color: C.redGlow, a: 0.3, freq: 0.01, mul: 0.55, spd: 1.2, w: 1.8 },
      { color: C.teal, a: 0.25, freq: 0.013, mul: 0.45, spd: 0.9, w: 1.5 },
      { color: C.cyan, a: 0.07, freq: 0.007, mul: 1.0, spd: 1, w: 0, fill: true },
      { color: C.magenta, a: 0.05, freq: 0.008, mul: 0.9, spd: 1.6, w: 0, fill: true },
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const d = Math.abs(x - cx) / cx;
        const env = Math.exp(-d * d * 3.2);
        const y1 = Math.sin(x * wave.freq + phase * wave.spd) * 40;
        const y2 = Math.sin(x * wave.freq * 2.1 + phase * wave.spd * 0.6) * 18;
        const y3 = Math.sin(x * wave.freq * 0.4 + phase * wave.spd * 1.5) * 22;
        const noise = speaking ? (Math.random() - 0.5) * 8 : 0;
        const y = cy + (y1 + y2 + y3 + noise) * amp * wave.mul * env;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      if (wave.fill) {
        ctx.lineTo(width, cy);
        ctx.lineTo(0, cy);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, cy - 70, 0, cy + 10);
        g.addColorStop(0, wave.color + Math.round(wave.a * 255).toString(16).padStart(2, "0"));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fill();
      } else {
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.a * (0.4 + amp * 0.6);
        ctx.lineWidth = wave.w;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = speaking ? 20 : 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    });

    // Center orb
    const r = 30 + amp * 20 + Math.sin(phase * 2) * 5;
    const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    og.addColorStop(0, speaking ? "rgba(255,45,58,0.2)" : "rgba(123,47,190,0.12)");
    og.addColorStop(0.6, speaking ? "rgba(212,20,90,0.06)" : "rgba(0,212,255,0.04)");
    og.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = og;
    ctx.fill();

    // Sparkles
    if (amp > 0.15) {
      const n = Math.floor(amp * 16);
      for (let i = 0; i < n; i++) {
        const angle = phase * 0.4 + (i / n) * Math.PI * 2;
        const dist = r + 15 + Math.sin(phase * 2.5 + i * 1.3) * 25;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist * 0.45;
        const sa = Math.max(0, Math.sin(phase * 1.8 + i * 2)) * amp * 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [width, height, active, speaking]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width, height, display: "block" }} />;
}

/* ─── Chat Bubble ─── */
function Bubble({ text, isBot, visible }) {
  return (
    <div style={{
      display: "flex", justifyContent: isBot ? "flex-start" : "flex-end",
      marginBottom: 10, opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        maxWidth: "82%", padding: "10px 15px",
        borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
        background: isBot
          ? "linear-gradient(135deg, rgba(123,47,190,0.1), rgba(0,212,255,0.05))"
          : `linear-gradient(135deg, ${C.red}cc, ${C.crimson}aa)`,
        border: `1px solid ${isBot ? "rgba(123,47,190,0.15)" : "rgba(229,35,48,0.25)"}`,
        color: C.text, fontSize: 13, lineHeight: 1.55,
        fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(12px)",
      }}>
        {text}
      </div>
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export default function InstaPassAnimatedBot() {
  const [mode, setMode] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [vis, setVis] = useState({});
  const [hovered, setHovered] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const openChat = () => {
    setMode("activating");
    setTimeout(() => {
      setMode("chat");
      setIsTyping(true);
      setTimeout(() => {
        const id = Date.now();
        setMessages([{
          id, isBot: true,
          text: "Hey there! I'm your InstaPass AI Concierge. I can find events, grab tickets, and help you discover unforgettable experiences. What sounds fun?",
        }]);
        setIsTyping(false);
        setTimeout(() => setVis(p => ({ ...p, [id]: true })), 50);
      }, 1400);
    }, 2200);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const uid = Date.now();
    setMessages(p => [...p, { id: uid, text: inputValue, isBot: false }]);
    setTimeout(() => setVis(p => ({ ...p, [uid]: true })), 30);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const bid = Date.now();
      const r = [
        "I found 8 trending events near you! 🎵 3 concerts, 🎭 2 theater shows, and 🏀 3 games this weekend. Want details?",
        "Great taste! Premium seats available with InstaPass early-access pricing. I can lock those in right now.",
        "Here's what's hot: rooftop jazz Friday, immersive art exhibit Saturday, and a sold-out comedy show I can still get you into. 🔥",
        "I've curated a perfect weekend lineup just for you. Two events Friday, brunch Saturday, surprise Sunday night experience!",
      ];
      setMessages(p => [...p, { id: bid, isBot: true, text: r[Math.floor(Math.random() * r.length)] }]);
      setIsTyping(false);
      setTimeout(() => setVis(p => ({ ...p, [bid]: true })), 50);
    }, 1500 + Math.random() * 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes ringRotate {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.04); }
        }
        @keyframes ringPulse2 {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%,-50%) scale(1.06); }
        }
        @keyframes sparkleOrbit {
          from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(30px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes panelSlide {
          from { opacity:0; transform: translateY(50px) scale(0.95); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%,100% { filter: drop-shadow(0 0 15px rgba(229,35,48,0.3)) drop-shadow(0 0 40px rgba(123,47,190,0.15)); }
          50% { filter: drop-shadow(0 0 25px rgba(229,35,48,0.5)) drop-shadow(0 0 60px rgba(123,47,190,0.25)); }
        }
        @keyframes activateZoom {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          40% { transform: translateY(-20px) scale(1.08); opacity: 1; }
          100% { transform: translateY(30px) scale(0.3); opacity: 0; }
        }
        @keyframes waveExpand {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform: scale(0.5); opacity:0.2; }
          40% { transform: scale(1); opacity:1; }
        }
        @keyframes particleFade {
          0%,100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes bgRotate {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }

        .ip3-input::placeholder { color: rgba(240,238,230,0.2); }
        .ip3-input:focus { outline:none; border-color: ${C.violet}50; box-shadow: 0 0 30px ${C.violet}12; }
        .ip3-chip:hover { background: rgba(123,47,190,0.15) !important; border-color: ${C.violet}80 !important; color: ${C.text} !important; }
        .ip3-send:hover { background: ${C.redGlow} !important; transform: scale(1.12); box-shadow: 0 0 24px ${C.redGlow}70; }
        .ip3-cta:hover { transform: scale(1.06) !important; box-shadow: 0 8px 50px ${C.red}80 !important; }
      `}</style>

      <div style={{
        width: "100vw", height: "100vh",
        background: `radial-gradient(ellipse at 50% 35%, #1e0e30 0%, #120820 40%, ${C.bg} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", fontFamily: "'Outfit', sans-serif",
      }}>

        {/* Ambient BG rotation */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", width: 700, height: 700,
          borderRadius: "50%", pointerEvents: "none",
          background: `conic-gradient(from 0deg, ${C.red}06, ${C.violet}0a, ${C.cyan}06, ${C.magenta}04, ${C.red}06)`,
          animation: "bgRotate 30s linear infinite", filter: "blur(50px)",
          opacity: mode === "chat" ? 0.3 : 0.5, transition: "opacity 1s ease",
        }}/>

        {/* Bokeh particles */}
        {Array(20).fill(0).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            borderRadius: "50%",
            background: [C.redGlow, C.amber, C.violet, C.magenta][i % 4],
            opacity: 0,
            animation: `particleFade ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
            filter: "blur(1px)", pointerEvents: "none",
          }}/>
        ))}

        {/* ═══ LANDING ═══ */}
        {mode === "landing" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "fadeUp 1s ease forwards", zIndex: 2,
          }}>
            {/* Mascot container with rings and effects */}
            <div
              style={{ position: "relative", cursor: "pointer", marginBottom: -20 }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Outer ring — conic gradient, slow rotate */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 340, height: 340, borderRadius: "50%",
                border: "2px solid transparent",
                backgroundImage: `conic-gradient(from 0deg, ${C.red}cc, ${C.magenta}aa, ${C.violet}88, ${C.cyan}66, ${C.blue}44, ${C.violet}66, ${C.magenta}88, ${C.red}cc)`,
                backgroundOrigin: "border-box", backgroundClip: "border-box",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 2,
                animation: "ringRotate 8s linear infinite",
                filter: "blur(0.5px)",
              }}/>

              {/* Inner pulsing ring */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 300, height: 300, borderRadius: "50%",
                border: `2px solid ${C.red}90`,
                animation: "ringPulse 3s ease-in-out infinite",
                boxShadow: `0 0 30px ${C.red}30, inset 0 0 30px ${C.red}10`,
              }}/>

              {/* Sparkle ring */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 370, height: 370, borderRadius: "50%",
                border: `1px solid ${C.violet}30`,
                animation: "ringPulse2 4s ease-in-out 1s infinite",
              }}/>

              {/* Orbiting sparkles */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 4, height: 4, marginLeft: -2, marginTop: -2,
                  "--orbit-r": `${160 + i * 8}px`,
                  animation: `sparkleOrbit ${6 + i * 1.5}s linear ${i * 0.8}s infinite`,
                }}>
                  <div style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: [C.cyan, C.magenta, C.amber, C.violet, C.redGlow, C.teal][i],
                    boxShadow: `0 0 8px ${[C.cyan, C.magenta, C.amber, C.violet, C.redGlow, C.teal][i]}`,
                  }}/>
                </div>
              ))}

              {/* THE MASCOT IMAGE */}
              <div style={{
                position: "relative", zIndex: 5, width: 320, height: 320,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: hovered ? "float 2s ease-in-out infinite" : "floatSlow 4s ease-in-out infinite",
              }}>
                <img
                  src="/api/files/mascot.png"
                  alt="InstaPass AI Concierge"
                  style={{
                    width: 300, height: 300, objectFit: "contain",
                    animation: "glowPulse 3s ease-in-out infinite",
                    transition: "transform 0.4s ease",
                    transform: hovered ? "scale(1.05)" : "scale(1)",
                  }}
                />
              </div>
            </div>

            {/* Wave visualizer behind/below mascot */}
            <div style={{ marginTop: -60, position: "relative", zIndex: 1 }}>
              <SiriWave active={true} speaking={false} width={560} height={140} />
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", marginTop: -10, zIndex: 3 }}>
              <h1 style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: 38, fontWeight: 700,
                color: C.text, margin: 0, letterSpacing: 4,
              }}>
                <span style={{ color: C.red }}>INSTA</span>PASS
                <span style={{ color: C.textMuted, fontWeight: 500, fontSize: 22, marginLeft: 10 }}>AI</span>
              </h1>
              <p style={{
                background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.magenta}, ${C.cyan})`,
                backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
                fontSize: 13, letterSpacing: 6, marginTop: 6, fontWeight: 500, textTransform: "uppercase",
              }}>
                AI Concierge
              </p>
              <p style={{ color: C.textSoft, fontSize: 12, marginTop: 10, letterSpacing: 2 }}>
                Find events &bull; Buy tickets &bull; Discover fun
              </p>
            </div>

            <button className="ip3-cta" onClick={openChat} style={{
              marginTop: 16, padding: "15px 50px", border: "none", borderRadius: 50,
              background: `linear-gradient(135deg, ${C.red}, ${C.crimson})`,
              color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
              boxShadow: `0 4px 35px ${C.red}50`, transition: "all 0.3s ease",
            }}>
              Start Chatting
            </button>
          </div>
        )}

        {/* ═══ ACTIVATING TRANSITION ═══ */}
        {mode === "activating" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
            zIndex: 2,
          }}>
            <div style={{ animation: "activateZoom 2.2s ease-in-out forwards" }}>
              <img
                src="/api/files/mascot.png"
                alt="InstaPass"
                style={{
                  width: 250, height: 250, objectFit: "contain",
                  filter: "drop-shadow(0 0 30px rgba(229,35,48,0.5))",
                }}
              />
            </div>
            <div style={{ animation: "waveExpand 1.5s ease 0.5s both" }}>
              <SiriWave active={true} speaking={true} width={500} height={160} />
            </div>
            <p style={{
              color: C.textSoft, fontSize: 14, letterSpacing: 4, fontWeight: 300,
              textTransform: "uppercase", animation: "fadeUp 0.8s ease 0.3s both",
            }}>
              Connecting...
            </p>
          </div>
        )}

        {/* ═══ CHAT ═══ */}
        {mode === "chat" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "panelSlide 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
            zIndex: 10, width: 440, maxWidth: "95vw",
          }}>
            {/* Wave above chat */}
            <div style={{ marginBottom: -16, zIndex: 1, position: "relative" }}>
              <SiriWave active={true} speaking={isTyping} width={440} height={80} />
            </div>

            <div style={{
              width: "100%", height: 490, maxHeight: "72vh",
              background: C.panel, borderRadius: 24,
              border: "1px solid rgba(123,47,190,0.1)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: `0 30px 100px rgba(0,0,0,0.7), 0 0 60px ${C.violet}06`,
            }}>
              {/* Header */}
              <div style={{
                padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: "linear-gradient(180deg, rgba(123,47,190,0.05), transparent)",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", overflow: "hidden",
                  border: `1.5px solid ${isTyping ? C.violet + "60" : "rgba(123,47,190,0.2)"}`,
                  boxShadow: isTyping ? `0 0 18px ${C.violet}30` : "none",
                  transition: "all 0.3s", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0e0a1a",
                }}>
                  <img
                    src="/api/files/mascot.png"
                    alt="Bot"
                    style={{
                      width: 36, height: 36, objectFit: "contain",
                      animation: isTyping ? "float 1s ease-in-out infinite" : "none",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 700,
                    color: C.text, letterSpacing: 1.5,
                  }}>
                    <span style={{ color: C.red }}>INSTA</span>PASS
                    <span style={{ color: C.textMuted, fontWeight: 500, fontSize: 10, marginLeft: 6 }}>AI</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.green, marginTop: 1, fontWeight: 400 }}>
                    ● Online
                  </div>
                </div>
                <button onClick={() => { setMode("landing"); setMessages([]); setVis({}); }}
                  style={{
                    width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)", color: C.textMuted, fontSize: 12,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>✕</button>
              </div>

              {/* Chips */}
              <div style={{
                padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}>
                {["🎵 Concerts", "😂 Comedy", "🏀 Sports", "🎭 Theater"].map(c => (
                  <button key={c} className="ip3-chip" onClick={() => setInputValue(`Find ${c.slice(2).toLowerCase()} events near me`)}
                    style={{
                      padding: "4px 12px", borderRadius: 18,
                      background: "rgba(123,47,190,0.06)", border: "1px solid rgba(123,47,190,0.12)",
                      color: C.textSoft, fontSize: 11, cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif", transition: "all 0.25s",
                    }}>
                    {c}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column" }}>
                {messages.map(m => (
                  <Bubble key={m.id} text={m.text} isBot={m.isBot} visible={!!vis[m.id]} />
                ))}
                {isTyping && (
                  <div style={{
                    display: "flex", gap: 5, padding: "10px 14px", width: "fit-content",
                    borderRadius: "4px 16px 16px 16px",
                    background: "rgba(123,47,190,0.08)", border: "1px solid rgba(123,47,190,0.1)",
                  }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: C.violet,
                        animation: `dotBounce 1.4s ease-in-out ${i*0.2}s infinite`,
                      }}/>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>

              {/* Input */}
              <div style={{
                padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(0,0,0,0.3)",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(123,47,190,0.1)", border: "1px solid rgba(123,47,190,0.2)",
                    color: C.cyan, fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>🎙</button>
                  <input className="ip3-input" type="text"
                    value={inputValue} onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="Ask about events, tickets..."
                    style={{
                      flex: 1, padding: "9px 15px", borderRadius: 20,
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      color: C.text, fontSize: 12.5, fontFamily: "'Outfit', sans-serif",
                      transition: "all 0.3s",
                    }}/>
                  <button className="ip3-send" onClick={handleSend} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: C.red, border: "none", color: "#fff", fontSize: 13,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s", boxShadow: `0 2px 15px ${C.red}40`,
                  }}>➤</button>
                </div>
                <div style={{
                  textAlign: "center", marginTop: 7, fontSize: 8,
                  color: C.textMuted, letterSpacing: 2, textTransform: "uppercase",
                }}>Powered by InstaPass AI</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}