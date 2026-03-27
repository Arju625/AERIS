import { useEffect, useState } from "react";
import Navbar from './components/Navbar';

function Emergency() {
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

  // -------- 📍 IMPROVED LOCATION FETCH --------
  const getLocation = (onSuccess, onError) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      onError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (error) => {
        console.warn("Retrying location...", error);

        navigator.geolocation.getCurrentPosition(
          onSuccess,
          (err) => {
            console.error("Location failed:", err);
            alert("Unable to fetch location. Please enable GPS / Location.");
            onError();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // -------- FETCH DASHBOARD STATS --------
  const fetchStats = () => {
    fetch("http://127.0.0.1:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(
        data?.status === "error"
          ? { types: [], severity: [] }
          : { types: data.types || [], severity: data.severity || [] }
      ))
      .catch(() => setStats({ types: [], severity: [] }));
  };

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

    getLocation(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setUserLocation({ lat, lon }); // still stored internally

        const data = {
          emergency: inputText,
          lat,
          lon
        };

        fetch("http://127.0.0.1:5000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
          setLoading(false);

          if (!result || result.status === "error") {
            alert("Backend error");
            return;
          }

          setMapUrl(result?.map_url || "");
          setServiceName(result?.service_name || "");
          setConfidence(result?.confidence || {});
          setFirstAid(result?.first_aid || []);

          if (result?.high_alert) {
            setIsAlert(true);
            playSiren();
          } else {
            setIsAlert(false);
          }

          let speechText = `Emergency type ${result.type}. Severity ${result.severity}. Nearest service is ${result.service_name}.`;

          if (result?.first_aid?.length > 0) {
            speechText += ` First aid steps: ${result.first_aid.join(", ")}.`;
          }

          speak(speechText, result?.high_alert);
          fetchStats();
        })
        .catch(() => {
          setLoading(false);
          alert("Server not reachable");
        });
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isAlert ? "bg-red-600 animate-pulse" : "bg-white"}`}>
      <Navbar />

      {isAlert && (
        <div className="bg-red-700 text-white py-3 text-center font-bold animate-bounce">
          🚨 HIGH ALERT 🚨
        </div>
      )}

      <main className="flex flex-col items-center p-4">

        <img src="/assets/logo.svg" className="h-[80px] mb-4" />

        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe emergency..."
          className="border p-3 rounded w-80 md:w-96"
        />

        <div className="flex gap-4 mt-4">
          <button onClick={startListening} className="bg-blue-500 text-white px-4 py-2 rounded">
            🎤 Speak
          </button>
          <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded">
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {serviceName && <div className="mt-4 font-semibold">🚑 {serviceName}</div>}

        {/* CARDS */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="bg-red-100 p-4 rounded w-64">
            <h3 className="font-bold">Emergency</h3>
            <p>{inputText}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded w-64">
            <h3 className="font-bold">Severity</h3>
            <p>{confidence?.severity ? `${Math.round(confidence.severity * 100)}%` : "N/A"}</p>
          </div>

          <div className="bg-green-100 p-4 rounded w-64">
            <h3 className="font-bold">First Aid</h3>
            <ul>
              {firstAid.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            View Route
          </a>
        )}

        {/* DASHBOARD */}
        <div className="mt-6">
          <h2 className="font-bold">Dashboard</h2>
          {stats.types.map((t, i) => <div key={i}>{t[0]}: {t[1]}</div>)}
        </div>

      </main>
    </div>
  );
}

export default Emergency;