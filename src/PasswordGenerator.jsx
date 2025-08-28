import React, { useState } from "react";
import "./PasswordGenerator.css";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    setCopied(false);
  };

  const copyToClipboard = (pwd) => {
    if (pwd) {
      navigator.clipboard.writeText(pwd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "", width: 0 };
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*()]/.test(pass)) score += 1;

    let label = "";
    let color = "";
    if (score <= 2) {
      label = "Weak";
      color = "#ff4d4d";
    } else if (score <= 4) {
      label = "Medium";
      color = "#ffa500";
    } else {
      label = "Strong";
      color = "#4caf50";
    }

    return { score, label, color, width: (score / 5) * 100 };
  };

  const activePassword = customPassword || generatedPassword;
  const strength = getPasswordStrength(activePassword);

  const tips = [
    { text: "Use at least 12 characters", pass: activePassword.length >= 12 },
    { text: "Include uppercase letters", pass: /[A-Z]/.test(activePassword) },
    { text: "Include numbers", pass: /[0-9]/.test(activePassword) },
    { text: "Include symbols (!@#$%^&*())", pass: /[!@#$%^&*()]/.test(activePassword) },
  ];

  return (
    <div className="container" role="main">
      <h1 tabIndex={0}>🔐 Password Generator & Checker</h1>

      {/* Generated password card */}
      <div className="password-box" aria-live="polite" aria-label="Generated password">
        <span className="password-text">{generatedPassword || "Click Generate Password"}</span>
        {generatedPassword && (
          <>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(generatedPassword)}
              aria-label="Copy generated password"
            >
              Copy
            </button>
            {copied && (
              <span
                style={{ color: "#4caf50", marginLeft: 12 }}
                aria-live="assertive"
                aria-atomic="true"
              >
                Copied!
              </span>
            )}
          </>
        )}
      </div>

      {/* Custom password input */}
      <input
        type="text"
        className="custom-password"
        placeholder="Type or paste your own password"
        value={customPassword}
        onChange={(e) => setCustomPassword(e.target.value)}
        aria-label="Custom password input"
      />

      {/* Password strength */}
      {activePassword && (
        <>
          <div className="strength-meter" aria-label="Password strength meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={strength.width}>
            <div
              className="strength-fill"
              style={{ width: `${strength.width}%`, background: strength.color }}
            ></div>
          </div>
          <div className="strength-text" aria-live="polite">
            {strength.label}
          </div>
        </>
      )}

      {/* Length slider */}
      <label htmlFor="length-slider">
        Length: {length}
        <br />
        <input
          id="length-slider"
          type="range"
          min="6"
          max="32"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
          aria-valuemin={6}
          aria-valuemax={32}
          aria-valuenow={length}
          aria-label="Password length slider"
        />
      </label>

      {/* Generate button */}
      <button
        className="generate-button"
        onClick={generatePassword}
        aria-live="polite"
        aria-label="Generate a new password"
      >
        Generate Password
      </button>

      {/* Tips */}
      <div className="suggestions" aria-live="polite" aria-label="Password tips">
        <h3>Password Tips:</h3>
        <ul>
          {tips.map((tip, idx) => (
            <li key={idx} className={`tip ${tip.pass ? "pass" : "fail"}`}>
              {tip.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
