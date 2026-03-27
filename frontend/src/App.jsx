import { useEffect, useState } from "react";
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [stats, setStats] = useState({ types: [], severity: [] });
  const [inputText, setInputText] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [confidence, setConfidence] = useState({ type: 0, severity: 0 });
  const [isAlert, setIsAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstAid, setFirstAid] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // -------- TEXT TO SPEECH --------
  const speak = (text, isAlert = false) => {
    try {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN";
      speech.rate = isAlert ? 1.2 : 1;
      speech.pitch = isAlert ? 1.5 : 1;
      window.speechSynthesis.speak(speech);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  // -------- 🚨 SIREN --------
  const playSiren = () => {
    try {
      const audio = new Audio("/assets/siren.mp3");
      audio.loop = true;
      audio.play();
      setTimeout(() => audio.pause(), 5000);
    } catch (e) {
      console.warn("Siren error:", e);
    }
  };

  // -------- SPEECH TO TEXT --------
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      setInputText(event.results[0][0].transcript || "");
    };

    recognition.onerror = () => alert("Speech recognition failed. Please type instead.");
  };

  // -------- FETCH DASHBOARD STATS --------
  const fetchStats = () => {
    fetch("http://127.0.0.1:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data?.status === "error" ? { types: [], severity: [] } : { types: data.types || [], severity: data.severity || [] }))
      .catch(() => setStats({ types: [], severity: [] }));
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // -------- SEND EMERGENCY --------
  const handleSend = () => {
    if (!inputText.trim()) {
      alert("Please enter or speak an emergency");
      return;
    }

    setLoading(true);
    setMapUrl("");
    setServiceName("");
    setConfidence({ type: 0, severity: 0 });
    setFirstAid([]);
    setUserLocation(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const data = { emergency: inputText, lat: pos.coords.latitude, lon: pos.coords.longitude };

        fetch("http://127.0.0.1:5000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
          setLoading(false);

          if (!result || result.status === "error") {
            alert("Backend error: " + (result?.message || "Unknown error"));
            return;
          }

          setMapUrl(result?.map_url || "");
          setServiceName(result?.service_name || "");
          setConfidence(result?.confidence || { type: 0, severity: 0 });
          setFirstAid(result?.first_aid || []);
          setUserLocation(result?.user_location || null);

          if (result?.high_alert) {
            setIsAlert(true);
            playSiren();
          } else setIsAlert(false);

          // TTS includes first aid + location
          let speechText = `Emergency type ${result.type}. Severity ${result.severity}. ${result.suggestion}. Nearest service is ${result.service_name}.`;
          if (result?.user_location) {
            speechText += ` Your location is latitude ${result.user_location.lat.toFixed(5)}, longitude ${result.user_location.lon.toFixed(5)}.`;
          }
          if (result?.first_aid?.length > 0) {
            speechText += ` First aid steps: ${result.first_aid.join(", ")}.`;
          }
          speak(speechText, result?.high_alert);

          // Refresh dashboard after sending
          fetchStats();
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setLoading(false);
          alert("Server not reachable");
        });
      },
      () => {
        setLoading(false);
        alert("Location access denied");
      }
    );
  };

  return (
    <div className={`min-h-screen flex flex-col text-center ${isAlert ? "bg-red-600 animate-pulse" : "bg-white"}`}>
      <Navbar />

      {isAlert && (
        <div className="bg-red-700 text-white py-3 font-bold animate-bounce">
          🚨 HIGH ALERT 🚨
        </div>
      )}

      <main className="flex-1 flex flex-col items-center md:items-start justify-center p-4 md:pl-[20px]">
        {/* Logo and headings */}
        <img src="/assets/logo.svg" alt="Aeris Icon" className="h-[80px] mb-[20px] object-contain" />
        <h2 className="text-[1.5rem] lg:text-[2rem] font-extrabold text-text-dark mb-[5px] tracking-[-0.5px]">HELLO WORLD!</h2>
        <h1 className="text-[4rem] lg:text-[6.5rem] font-black text-primary-red mb-[10px] leading-[1.1] tracking-[-2px]">MEET AERIS</h1>
        <h3 className="text-[1.5rem] font-bold text-text-dark mb-[40px] max-w-full md:max-w-[80%]">
          SMART EMERGENCY RESPONSE SYSTEM
        </h3>

        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe emergency..."
          className="border p-3 rounded w-80 md:w-96"
        />

        <div className="flex gap-4 mt-4">
          <button onClick={startListening} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            🎤 Speak
          </button>
          <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {serviceName && <div className="mt-4 text-lg font-semibold">🚑 Nearest Service: {serviceName}</div>}

        {/* -------- EMERGENCY, SEVERITY, FIRST AID CARDS -------- */}
        {(inputText || firstAid.length > 0) && (
          <div className="flex flex-col md:flex-row gap-4 mt-6 w-full justify-center">
            <div className="bg-red-100 border border-red-300 rounded p-4 w-72 md:w-64">
              <h3 className="font-bold text-red-700 mb-2">Emergency Type</h3>
              <p className="text-red-800">{inputText || "N/A"}</p>
            </div>

            <div className="bg-yellow-100 border border-yellow-300 rounded p-4 w-72 md:w-64">
              <h3 className="font-bold text-yellow-700 mb-2">Severity</h3>
              <p className="text-yellow-800">{confidence && confidence.severity ? `${Math.round(confidence.severity * 100)}%` : "N/A"}</p>
            </div>

            <div className="bg-green-100 border border-green-300 rounded p-4 w-72 md:w-64">
              <h3 className="font-bold text-green-700 mb-2">First Aid Steps</h3>
              <ul className="list-disc list-inside text-left text-green-800">
                {firstAid.length > 0 ? firstAid.map((step, i) => <li key={i}>{step}</li>) : <li>N/A</li>}
              </ul>
            </div>
          </div>
        )}

        {/* -------- MAP -------- */}
        {mapUrl && (
          <div className="mt-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Route on Google Maps
            </a>
          </div>
        )}

        {/* -------- DASHBOARD -------- */}
        {stats && (
          <div className="p-6 bg-gray-50 mt-6 w-full md:max-w-2xl">
            <h2 className="text-xl font-bold mb-2">Dashboard</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Types</h3>
                {stats.types.length > 0 ? stats.types.map((t, i) => (
                  <div key={i}>{t[0]}: {t[1]}</div>
                )) : <div>No data</div>}
              </div>
              <div>
                <h3 className="font-semibold">Severity</h3>
                {stats.severity.length > 0 ? stats.severity.map((s, i) => (
                  <div key={i}>{s[0]}: {s[1]}</div>
                )) : <div>No data</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;