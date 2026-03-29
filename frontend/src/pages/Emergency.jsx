import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "http://localhost:5000"; // Your local backend

const NAV = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "alerts", label: "Alerts", emoji: "🔔" },
  { id: "history", label: "History", emoji: "🕐" },
  { id: "profile", label: "Profile", emoji: "👤" },
  { id: "more", label: "More", emoji: "···" },
];

function Emergency() {
  const [inputText, setInputText] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [severity, setSeverity] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [confidence, setConfidence] = useState({ type: 0, severity: 0 });
  const [isAlert, setIsAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstAid, setFirstAid] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeNav, setActiveNav] = useState("alerts");
  const navigate = useNavigate();

  // ------------------ Text to Speech ------------------
  const speak = (text, alert = false) => {
    try {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN";
      speech.rate = alert ? 1.2 : 1;
      speech.pitch = alert ? 1.5 : 1;
      window.speechSynthesis.speak(speech);
    } catch (e) { console.warn("TTS error:", e); }
  };

  const playSiren = () => {
    try {
      const audio = new Audio("/assets/siren.mp3");
      audio.loop = true;
      audio.play();
      setTimeout(() => audio.pause(), 5000);
    } catch (e) { console.warn("Siren error:", e); }
  };

  // ------------------ Speech Recognition ------------------
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech Recognition not supported"); return; }
    const r = new SR();
    r.lang = "en-IN";
    r.start();
    r.onresult = (e) => setInputText(e.results[0][0].transcript || "");
    r.onerror = () => alert("Speech recognition failed.");
  };

  // ------------------ Get Geolocation ------------------
  const getLocation = (onSuccess, onError) => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); onError(); return; }
    navigator.geolocation.getCurrentPosition(onSuccess, () => {
      alert("Unable to fetch location.");
      onError();
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  // ------------------ Predict ------------------
  const handleSend = () => {
    if (!inputText.trim()) { alert("Please enter or speak an emergency"); return; }
    setLoading(true);
    setSubmitted(false);

    getLocation((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetch(BACKEND + "/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergency: inputText, lat, lon })
      })
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (!result || result.status === "error") { alert("Backend error"); return; }

        setMapUrl(result.map_url || "");
        setServiceName(result.service_name || "");
        setEmergencyType(result.type || "");
        setSeverity(result.severity || "");
        setSuggestion(result.suggestion || "");
        setConfidence(result.confidence || {});
        setFirstAid(result.first_aid || []);
        setSubmitted(true);

        if (result.high_alert) { setIsAlert(true); playSiren(); } else { setIsAlert(false); }

        speak(`Emergency type ${result.type}. Severity ${result.severity}. Nearest service is ${result.service_name}`, result.high_alert);
      })
      .catch(() => { setLoading(false); alert("Server not reachable."); });
    }, () => setLoading(false));
  };

  const severityColor = severity === "high" ? "#dc2626" : severity === "medium" ? "#d97706" : "#16a34a";
  const typeEmoji = { fire: "🔥", medical: "🏥", accident: "🚗", crime: "🚨" }[emergencyType?.toLowerCase()] || "⚠️";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Montserrat, sans-serif", background: "#f1f5f9" }}>

      {/* LEFT SIDEBAR */}
      <div style={{
        width: "220px", flexShrink: 0, background: "#0d9488",
        display: "flex", flexDirection: "column", padding: "1.5rem 1rem",
        height: "100vh", position: "sticky", top: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <img src="/assets/logo.svg" style={{ height: "2rem" }} alt="AERIS" />
          <span style={{ fontWeight: "900", fontSize: "1.2rem", color: "white" }}>AERIS</span>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => { setActiveNav(id); if (id === "home") navigate("/dashboard"); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "none",
                background: activeNav === id ? "white" : "transparent",
                color: activeNav === id ? "#111" : "white",
                fontWeight: "600", cursor: "pointer", fontSize: "0.95rem",
                textAlign: "left", width: "100%"
              }}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {isAlert && (
          <div style={{ background: "#7f1d1d", color: "white", padding: "0.75rem", textAlign: "center", fontWeight: "900", fontSize: "1.1rem" }}>
            🚨 HIGH ALERT — EMERGENCY SERVICES NOTIFIED 🚨
          </div>
        )}

        <main style={{ flex: 1, padding: "2rem", maxWidth: "860px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

          {/* TITLE */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <img src="/assets/logo.svg" style={{ height: "3rem" }} alt="AERIS" />
              <span style={{ fontWeight: "900", fontSize: "2rem", color: "#111" }}>AERIS</span>
            </div>
            <h2 style={{ fontWeight: "800", fontSize: "1.4rem", color: "#374151", margin: 0 }}>Emergency Help Needed?</h2>
          </div>

          {/* SEARCH BAR */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            background: "white", borderRadius: "3rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            padding: "0.5rem 0.5rem 0.5rem 1.25rem",
            marginBottom: "1.5rem"
          }}>
            <span style={{ color: "#9ca3af", fontSize: "1.1rem" }}>🔍</span>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe Emergency"
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: "1rem", color: "#374151", background: "transparent"
              }}
            />
            <button onClick={startListening} style={{
              background: "#f1f5f9", border: "none", borderRadius: "50%",
              width: "2.5rem", height: "2.5rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem"
            }}>🎤</button>
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                background: "#b91c1c", color: "white", border: "none",
                borderRadius: "2rem", padding: "0.75rem 1.75rem",
                fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem", opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "..." : "Predict"}
            </button>
          </div>

          {/* ILLUSTRATION / RESULTS */}
          {!submitted && (
            <div style={{
              borderRadius: "1.5rem", overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              background: "#dc2626"
            }}>
              <img
                src="/assets/emergency_illustration.png"
                alt="Emergency Illustration"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {submitted && (
            <div>
              {/* GRID INFO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                
                {/* Emergency Type */}
                <div style={{ background: "white", borderRadius: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "1.5rem", borderTop: "4px solid #b91c1c" }}>
                  <p style={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>EMERGENCY TYPE</p>
                  <p style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{typeEmoji}</p>
                  <p style={{ fontWeight: "800", fontSize: "1.2rem", color: "#111", textTransform: "capitalize" }}>{emergencyType}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Confidence: {Math.round((confidence.type || 0) * 100)}%</p>
                </div>

                {/* Severity */}
                <div style={{ background: "white", borderRadius: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "1.5rem", borderTop: "4px solid " + severityColor }}>
                  <p style={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>SEVERITY</p>
                  <p style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{severity === "high" ? "🔴" : severity === "medium" ? "🟡" : "🟢"}</p>
                  <p style={{ fontWeight: "800", fontSize: "1.2rem", color: severityColor, textTransform: "capitalize" }}>{severity}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Confidence: {Math.round((confidence.severity || 0) * 100)}%</p>
                </div>

                {/* Nearest Service */}
                <div style={{ background: "white", borderRadius: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "1.5rem", borderTop: "4px solid #0891b2" }}>
                  <p style={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>NEAREST SERVICE</p>
                  <p style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>🚑</p>
                  <p style={{ fontWeight: "800", fontSize: "1rem", color: "#111" }}>{serviceName || "Locating..."}</p>
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.8rem", color: "#0891b2", fontWeight: "700", textDecoration: "none" }}>
                      📍 Get Directions →
                    </a>
                  )}
                </div>
              </div>

              {/* Suggestion */}
              <div style={{ background: "#fef3c7", borderRadius: "1.25rem", padding: "1.25rem 1.5rem", marginBottom: "1rem", borderLeft: "4px solid #d97706", display: "flex", gap: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>💡</span>
                <div>
                  <p style={{ fontWeight: "700", color: "#92400e", marginBottom: "0.25rem" }}>Suggestion</p>
                  <p style={{ color: "#78350f", fontSize: "0.95rem" }}>{suggestion}</p>
                </div>
              </div>

              {/* First Aid Steps */}
              <div style={{ background: "white", borderRadius: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "1.5rem" }}>
                <h3 style={{ fontWeight: "800", color: "#111", marginBottom: "1rem" }}>🩹 First Aid Steps</h3>
                <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {firstAid.map((step, i) => (
                    <li key={i} style={{ padding: "0.6rem 0", borderBottom: i < firstAid.length - 1 ? "1px solid #f1f5f9" : "none", color: "#374151", fontSize: "0.95rem", lineHeight: "1.5" }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Emergency;