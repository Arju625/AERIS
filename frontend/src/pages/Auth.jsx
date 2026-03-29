import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div style={{
      background: "white",
      borderRadius: "1.5rem",
      boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      padding: "3rem 3.5rem",
      width: "100%",
      maxWidth: "420px",
    }}>
      <h2 style={{ fontSize: "2.2rem", fontWeight: "800", textAlign: "center", marginBottom: "2rem", color: "#111" }}>Login</h2>

      {/* Email */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1.5px solid #e0e0e0", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
        <span style={{ marginRight: "0.75rem", color: "#aaa" }}>@</span>
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ border: "none", outline: "none", width: "100%", fontSize: "1rem", color: "#555", background: "transparent" }}
        />
      </div>

      {/* Password */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1.5px solid #e0e0e0", marginBottom: "0.5rem", paddingBottom: "0.5rem" }}>
        <span style={{ marginRight: "0.75rem", color: "#aaa" }}>🔑</span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ border: "none", outline: "none", width: "100%", fontSize: "1rem", color: "#555", background: "transparent" }}
        />
        <span style={{ color: "#b91c1c", fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}>Forgot?</span>
      </div>

      <button
        onClick={handleLogin}
        style={{
          width: "100%", background: "#b91c1c", color: "white",
          fontWeight: "700", fontSize: "1.1rem", padding: "0.9rem",
          borderRadius: "2rem", border: "none", cursor: "pointer",
          marginTop: "1.5rem", marginBottom: "1.2rem"
        }}
      >
        Login
      </button>

      {/* Social Icons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
        {[
          { icon: <GoogleIcon />, bg: "white", border: "1.5px solid #e0e0e0" },
          { icon: <FacebookIcon />, bg: "white", border: "1.5px solid #e0e0e0" },
          { icon: <AppleIcon />, bg: "#111", border: "none" },
        ].map((s, i) => (
          <button key={i} style={{
            width: "42px", height: "42px", borderRadius: "50%",
            background: s.bg, border: s.border,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer"
          }}>
            {s.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  async function handleSignup() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { alert(error.message); return; }

    const { error: dbError } = await supabase.from("users").insert({
      user_id: data.user.id,
      name: name || email.split("@")[0],
      email: email,
    });

    if (dbError) { alert("Database error: " + dbError.message); return; }

    alert("Signup successful! Please login.");
    navigate("/", { state: { tab: "login" } });
  }

  const fields = [
    { placeholder: "Email ID", value: email, onChange: setEmail, type: "email" },
    { placeholder: "Password", value: password, onChange: setPassword, type: "password" },
    { placeholder: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, type: "password" },
    { placeholder: "Full Name", value: name, onChange: setName, type: "text" },
    { placeholder: "Mobile Number", value: phone, onChange: setPhone, type: "tel" },
  ];

  return (
    <div style={{
      background: "white",
      borderRadius: "1.5rem",
      boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      padding: "2.5rem 3.5rem",
      width: "100%",
      maxWidth: "420px",
    }}>
      <h2 style={{ fontSize: "2.2rem", fontWeight: "800", textAlign: "center", marginBottom: "1.2rem", color: "#111" }}>Sign Up</h2>

      {/* Social Icons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { icon: <GoogleIcon />, bg: "white", border: "1.5px solid #e0e0e0" },
          { icon: <FacebookIcon />, bg: "white", border: "1.5px solid #e0e0e0" },
          { icon: <AppleIcon />, bg: "#111", border: "none" },
        ].map((s, i) => (
          <button key={i} style={{
            width: "42px", height: "42px", borderRadius: "50%",
            background: s.bg, border: s.border,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer"
          }}>
            {s.icon}
          </button>
        ))}
      </div>

      {/* Fields */}
      {fields.map((f, i) => (
        <div key={i} style={{ borderBottom: "1.5px solid #e0e0e0", marginBottom: "1.1rem", paddingBottom: "0.4rem" }}>
          <input
            type={f.type}
            placeholder={f.placeholder}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: "1rem", color: "#555", background: "transparent" }}
          />
        </div>
      ))}

      <button
        onClick={handleSignup}
        style={{
          width: "100%", background: "#b91c1c", color: "white",
          fontWeight: "700", fontSize: "1.1rem", padding: "0.9rem",
          borderRadius: "2rem", border: "none", cursor: "pointer",
          marginTop: "0.5rem"
        }}
      >
        Create Account
      </button>
    </div>
  );
}

export default function Auth() {
  const location = useLocation();
  const defaultTab = location.state?.tab ?? 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", fontFamily: "Montserrat, sans-serif" }}>

      {/* LEFT PANEL */}
      <div style={{ width: "45%", position: "relative", flexShrink: 0, overflow: "hidden" }}>

        {/* Logo */}
        <div style={{ position: "absolute", top: "2rem", left: "2rem", zIndex: 20, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/assets/logo.svg" alt="AERIS" style={{ height: "2rem" }} />
          <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#111" }}>AERIS</span>
        </div>

        <img
          src="/assets/auth.svg"
          alt="Auth Background"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Tab Buttons */}
        <div style={{
          position: "absolute", right: 0, top: "50%",
          transform: "translateY(-50%)", display: "flex",
          flexDirection: "column", zIndex: 20, gap: "0.5rem"
        }}>
          {["login", "signup"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "1.2rem 2.5rem",
                fontWeight: "700",
                fontSize: "1rem",
                borderRadius: "1rem 0 0 1rem",
                border: "none",
                cursor: "pointer",
                background: activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
                color: activeTab === tab ? "#111" : "white",
                textTransform: "capitalize"
              }}
            >
              {tab === "login" ? "Login" : "Signup"}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f3f4f6"
      }}>
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
