import { useState, useEffect } from "react";
import axiosClient from "../AxiosClient";
import { checkAndCreateUser } from "../utils/userService";
import { isOtpValid } from "../utils/auth";
import "../styles/Login.css";
import moviingTeam from "../assests/Images/moving-team.webp";

  const OtpLoginAdmin = ({ onSuccess, onClose, userData = {} }) => {
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
     // await axiosClient.post("/otp/send", { mobileNumber });
      //setStep("OTP");

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
                          "Failed to send OTP. Try again.";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // if (!/^\d{6}$/.test(otp)) {
    //   setError("Enter a valid 6-digit OTP");
    //   return;
    // }
    
    try {
      setLoading(true);
      setError("");
      
      // 1. Verify OTP
       //await axiosClient.post("/otp/verify", { mobileNumber, otp });
      
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
          <h3>Register with mobile number</h3>
          <p className="login-subtitle">OTP to verification is not required.</p>

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
                {loading ? "Login..." : "Login"}
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpLoginAdmin;