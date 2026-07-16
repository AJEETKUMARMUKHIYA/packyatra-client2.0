import { useState, useEffect } from "react";
import axiosClient from "../AxiosClient";
import { checkAndCreateUser } from "../utils/userService";
import { isOtpValid } from "../utils/auth";
import "../styles/Login.css";
import moviingTeam from "../assests/Images/moving-team.webp";

const OtpLogin = ({ onSuccess, onClose, userData = {} }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("MOBILE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AUTOMATICALLY CHECK IF ALREADY LOGGED IN
  useEffect(() => {
    if (isOtpValid()) {
      const savedMobile = localStorage.getItem("mobile");
      if (savedMobile) {
        // Auto-success if already logged in
        setTimeout(() => {
          onSuccess?.();
          onClose?.();
        }, 100);
      }
    }
  }, [onSuccess, onClose]);

  // OTP Auto-Fill
  useEffect(() => {
    if (step !== "OTP") return;

    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((res) => res?.code && setOtp(res.code))
        .catch(() => {});
      return () => ac.abort();
    }
  }, [step]);

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await axiosClient.post("/otp/send", { mobileNumber });
      setStep("OTP");
    } catch (err) {
      const errorMessage = err?.response?.data?.errors?.[0] || 
                          err?.response?.data?.title || 
                          err?.response?.data?.detail ||
                          "Failed to send OTP. Try again.";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // 1. Verify OTP
       await axiosClient.post("/otp/verify", { mobileNumber, otp });
      
      // 2. Check/Create user in database
      const { userID, addressID } = await checkAndCreateUser(mobileNumber, userData);

      // Save login for 30 minutes
      localStorage.setItem("mobile", mobileNumber);
      localStorage.setItem("userID", userID);
      localStorage.setItem("addressID", addressID);
      localStorage.setItem("userName", "User");
      localStorage.setItem("loginType", "OTP");
      localStorage.setItem("otpLoginTime", Date.now());

      // Trigger login events
      window.dispatchEvent(new Event("user-login"));
      window.dispatchEvent(new Event("storage"));

      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err?.response?.data?.errors?.[0] || 
                          err?.response?.data?.title || 
                          err?.response?.data?.detail ||
                          "Failed to verify OTP. Try again.";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="login-image">
          <img src={moviingTeam} alt="Moving Service" />
        </div>
        <div className="login-content">
          <h3>Login with mobile number</h3>
          <p className="login-subtitle">We'll send an OTP to verify your number</p>

          {step === "MOBILE" && (
            <>
              <div className="form-group phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter mobile number"
                  maxLength={10}
                />
              </div>
              {error && <div className="error-text">{error}</div>}
              <button className="login-btn" onClick={sendOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
                <div className="trust-row">✔ No spam • 100% secure</div>
              <div className="rating-row">
                ⭐ 4.8/5 | 15+ Years Experience
              </div>
              <div  className="rating-row">
                🛡️ Damage Protection • Verified Professionals
              </div>
              <div  className="rating-row">
                📍 Serving 50+ Cities Across India
              </div>
            </>
          )}

          {step === "OTP" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="otp-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                <p className="otp-sent-msg">OTP sent to +91 {mobileNumber}</p>
              </div>
              {error && <div className="error-text">{error}</div>}
              <button className="login-btn" onClick={verifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <div className="resend-otp" onClick={sendOtp}>
                {loading ? "Sending..." : "Resend OTP"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;