import { useState, useEffect, useRef } from "react";
import axiosClient from "../AxiosClient";
import { motion, AnimatePresence } from "framer-motion";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import CalculateIcon from "@mui/icons-material/Calculate";
import HelpIcon from "@mui/icons-material/Help";
import LanguageIcon from "@mui/icons-material/Language";
import PackyatraAvatar from "./PackyatraAvatar";
import VoiceAssistant from "../components/VoiceAssistant";
import { speakText } from "../utils/speakText";

const ChatbotWindow = ({ onClose, onMinimize, isMinimized }) => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello and welcome to PackYatra Services. How may I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("auto"); // auto, price, faq
  const [language, setLanguage] = useState("en");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },     
    { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },   
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "bho", name: "भोजपुरी", flag: "🇮🇳" },
    { code: "mai", name: "मैथिली", flag: "🇮🇳" },
    { code: "or",  name: "ଓଡ଼ିଆ",   flag: "🇮🇳" },
    { code: "ur",  name: "اردو",    flag: "🇮🇳" }    

  ];

  const modes = [
    { id: "auto", name: "Auto Detect", icon: "🤖", desc: "AI will decide mode" },
    { id: "price", name: "Price Calculator", icon: "💰", desc: "Calculate moving cost" },
    { id: "faq", name: "FAQ Assistant", icon: "❓", desc: "Ask about services" }
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && !isMinimized) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // const sendMessage = async () => {
  //   if (!input.trim() || loading) return;

  //   const userMessage = input;
  //   setMessages(prev => [...prev, { role: "user", text: userMessage }]);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const response = await axiosClient.post("/chat", {
  //       message: userMessage,
  //       language: language,
  //       mode: mode
  //     });

  //     setMessages(prev => [
  //       ...prev,
  //       { 
  //         role: "bot", 
  //         text: response.data.message,
  //         mode: response.data.mode,
  //         language: response.data.language
  //       }
  //     ]);
  //   } catch (error) {
  //     console.error("Chat error:", error);
  //     setMessages(prev => [
  //       ...prev,
  //       { role: "bot", text: "⚠️ Service temporarily unavailable. Please try again shortly." }
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMessage = input;
  setMessages(prev => [...prev, { role: "user", text: userMessage }]);
  setInput("");
  setLoading(true);

  try {
    const response = await axiosClient.post("/chat", {
      message: userMessage,
      language: language,
      mode: mode
    });

    const botReply = response.data.message;

    setMessages(prev => [
      ...prev,
      { 
        role: "bot", 
        text: botReply,
        mode: response.data.mode,
        language: response.data.language
      }
    ]);

    // ✅ ADD THIS LINE (Bot will speak)
    speakText(botReply, response.data.language || language);

  } catch (error) {
    console.error("Chat error:", error);
    setMessages(prev => [
      ...prev,
      { role: "bot", text: "⚠️ Service temporarily unavailable. Please try again shortly." }
    ]);
  } finally {
    setLoading(false);
  }
};

  const setChatMode = async (newMode) => {
    setMode(newMode);
    setShowModeMenu(false);
    
    try {
      const response = await axiosClient.post("/chat/mode", {
        mode: newMode,
        language: language
      });
      
      setMessages(prev => [
        ...prev,
        { role: "bot", text: response.data.message }
      ]);
    } catch (error) {
      console.error("Mode change error:", error);
    }
  };

  const setChatLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguageMenu(false);
    
    const lang = languages.find(l => l.code === langCode);
    setMessages(prev => [
      ...prev,
      { 
        role: "bot", 
        text: `Language changed to ${lang.name} ${lang.flag}. You can now chat in ${lang.name}.`
      }
    ]);
  };

  // Quick actions buttons
  const quickActions = [
    { text: "Calculate Price", mode: "price", query: " For example price for 100 km and 400CFT" },
    { text: "What is PackYatra?", mode: "faq", query: "What is PackYatra?" },
    { text: "Booking Process", mode: "faq", query: "How do I book a move?" },
    { text: "Insurance", mode: "faq", query: "Is insurance available?" }
  ];

  const handleQuickAction = (action) => {
    setInput(action.query);
    setMode(action.mode);
  };

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-menu-container')) {
        setShowLanguageMenu(false);
      }
      if (showModeMenu && !event.target.closest('.mode-menu-container')) {
        setShowModeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu, showModeMenu]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", damping: 25 }}
        style={{
          position: "fixed",
          bottom: 100,
          right: 30,
          width: 350,
          height: isMinimized ? 60 : 450,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1001,
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}
      >
        {/* Header - Always visible at top */}
        <motion.div
          // animate={{ padding: isMinimized ? "15px 20px" :"15px 20px" }}
          style={{
            background: "linear-gradient(135deg, #2563eb, #38bdf8 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "move",
            userSelect: "none",
            flexShrink: 0, // Prevent header from shrinking
            position: "relative",
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PackyatraAvatar size={28} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "16px" }}>
                PackYatra
              </div>
              {!isMinimized && (
                <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "2px" }}>
                  {modes.find(m => m.id === mode)?.name} • {
                    languages.find(l => l.code === language)?.name
                  }
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Language Selector */}
            <div style={{ position: "relative" }} className="language-menu-container">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(5px)"
                }}
              >
                <LanguageIcon />
              </motion.div>
              
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: 0,
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "10px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    zIndex: 1002,
                    minWidth: "150px",
                    maxHeight: "300px",
                    overflowY: "auto"
                  }}
                >
                  {languages.map(lang => (
                    <motion.div
                      key={lang.code}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => setChatLanguage(lang.code)}
                      style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: language === lang.code ? "#f0f4ff" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "5px"
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{lang.flag}</span>
                      <span style={{ color: "#333", fontSize: "14px" }}>{lang.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Mode Selector */}
            <div style={{ position: "relative" }} className="mode-menu-container">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModeMenu(!showModeMenu)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(5px)"
                }}
              >
                {mode === "price" ? <CalculateIcon /> : <HelpIcon />}
              </motion.div>
              
              {showModeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: 0,
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "15px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    zIndex: 1002,
                    minWidth: "200px",
                    maxHeight: "300px",
                    overflowY: "auto"
                  }}
                >
                  {modes.map(m => (
                    <motion.div
                      key={m.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => setChatMode(m.id)}
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: mode === m.id ? "#f0f4ff" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                        border: mode === m.id ? "2px solid #2563eb" : "1px solid #eee"
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{m.icon}</span>
                      <div>
                        <div style={{ color: "#333", fontWeight: 600 }}>{m.name}</div>
                        <div style={{ color: "#666", fontSize: "12px" }}>{m.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Control Buttons */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMinimize}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)"
              }}
            >
              {isMinimized ? <ExpandMoreIcon /> : <MinimizeIcon />}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)"
              }}
            >
              <CloseIcon />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                flex: 1,
                minHeight: 0 // Important for flex children to scroll
              }}
            >
              {/* Quick Actions - Fixed at top below header */}
              {/* <div style={{
                padding: "15px 25px",
                background: "linear-gradient(90deg, #f8f9ff 0%, #ffffff 100%)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                flexShrink: 0 // Prevent quick actions from shrinking
              }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                  QUICK ACTIONS:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(action)}
                      style={{
                        padding: "8px 15px",
                        borderRadius: "20px",
                        border: "none",
                        background: "rgba(37, 99, 235, 0.1)",
                        color: "#2563eb",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <span>{action.mode === "price" ? "💰" : "❓"}</span>
                      {action.text}
                    </motion.button>
                  ))}
                </div>
              </div> */}

              {/* Messages Body - Scrollable area */}
              <div 
                ref={messagesContainerRef}
                style={{
                  flex: 1,
                  padding: "25px",
                  overflowY: "auto",
                  background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0 // Important for scrolling
                }}
                className="chat-messages-container"
              >
                {/* Custom scrollbar styles */}
                <style>
                  {`
                    .chat-messages-container::-webkit-scrollbar {
                      width: 8px;
                    }
                    
                    .chat-messages-container::-webkit-scrollbar-track {
                      background: rgba(0, 0, 0, 0.05);
                      border-radius: 4px;
                    }
                    
                    .chat-messages-container::-webkit-scrollbar-thumb {
                      background: rgba(37, 99, 235, 0.3);
                      border-radius: 4px;
                    }
                    
                    .chat-messages-container::-webkit-scrollbar-thumb:hover {
                      background: rgba(37, 99, 235, 0.5);
                    }
                    
                    .chat-messages-container {
                      scroll-behavior: smooth;
                    }
                  `}
                </style>
                
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: m.role === "user" ? "flex-end" : "flex-start",
                      flexShrink: 0 // Prevent message items from shrinking
                    }}
                  >
                    {/* Mode/Language indicator for bot messages */}
                    {m.role === "bot" && m.mode && (
                      <div style={{
                        fontSize: "10px",
                        color: "#666",
                        marginBottom: "4px",
                        padding: "2px 8px",
                        background: "#f0f0f0",
                        borderRadius: "10px",
                        display: "inline-block",
                        flexShrink: 0
                      }}>
                        {m.mode.toUpperCase()} • {m.language?.toUpperCase()}
                      </div>
                    )}
                    
                    <div style={{ 
                      display: "flex", 
                      alignItems: "flex-start",
                      gap: "12px",
                      maxWidth: "85%",
                      flexShrink: 0
                    }}>
                      {m.role === "bot" && (
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #2563eb, #38bdf8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "4px"
                        }}>
                          <PackyatraAvatar style={{ fontSize: 28, color: "white" }} />
                        </div>
                      )}
                      
                      <div style={{
                        padding: "16px 20px",
                        borderRadius: m.role === "user" 
                          ? "20px 20px 5px 20px" 
                          : "20px 20px 20px 5px",
                        background: m.role === "user" 
                          ? "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)"
                          : m.mode === "price"
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(102, 126, 234, 0.08)",
                        color: m.role === "user" ? "#fff" : "#333",
                        boxShadow: m.role === "user" 
                          ? "0 4px 15px rgba(102, 126, 234, 0.3)"
                          : "0 2px 10px rgba(0, 0, 0, 0.05)",
                        border: m.role === "user" 
                          ? "none"
                          : m.mode === "price"
                            ? "1px solid rgba(34, 197, 94, 0.2)"
                            : "1px solid rgba(102, 126, 234, 0.1)",
                        fontSize: "14.5px",
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%"
                      }}>
                        {m.text}
                      </div>
                      
                      {m.role === "user" && (
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "4px"
                        }}>
                          <PersonIcon style={{ fontSize: 18, color: "white" }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Fixed at bottom */}
              <div style={{
                // padding: "20px 25px",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                background: "rgba(255, 255, 255, 0.9)",
                flexShrink: 0 // Prevent input area from shrinking
              }}>
                {/* <div style={{ 
                  display: "flex", 
                  gap: "12px",
                  alignItems: "center"
                }}>
                  <motion.input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder={
                      mode === "price" 
                        ? "Enter distance (KM) and volume (CFT)..."
                        : "Ask about PackYatra services..."
                    }
                    style={{
                      flex: 1,
                      padding: "16px 20px",
                      borderRadius: "15px",
                      border: `1px solid ${mode === "price" ? "rgba(34, 197, 94, 0.3)" : "rgba(102, 126, 234, 0.2)"}`,
                      background: "rgba(255, 255, 255, 0.9)",
                      fontSize: "14.5px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)"
                    }}
                    whileFocus={{
                      borderColor: mode === "price" ? "#22c55e" : "#2563eb",
                      boxShadow: `0 0 0 3px ${mode === "price" ? "rgba(34, 197, 94, 0.1)" : "rgba(37, 99, 235, 0.1)"}`
                    }}
                  />
                  
                  <motion.button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "15px",
                      border: "none",
                      background: loading || !input.trim() 
                        ? "linear-gradient(135deg, #ccc 0%, #999 100%)"
                        : mode === "price"
                          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                          : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "#fff",
                      cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: loading || !input.trim()
                        ? "0 4px 12px rgba(0,0,0,0.1)"
                        : mode === "price"
                          ? "0 6px 20px rgba(34, 197, 94, 0.4)"
                          : "0 6px 20px rgba(37, 99, 235, 0.4)"
                    }}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid white",
                          borderTopColor: "transparent",
                          borderRadius: "50%"
                        }}
                      />
                    ) : (
                      <SendIcon />
                    )}
                  </motion.button>
                </div> */}
                <div style={{ 
  display: "flex", 
  gap: "12px",
  alignItems: "center"
}}>
  <motion.input
    value={input}
    onChange={e => setInput(e.target.value)}
    onKeyDown={e => e.key === "Enter" && sendMessage()}
    placeholder={
      mode === "price" 
        ? "Enter distance (KM) and volume (CFT)..."
        : "Ask about PackYatra services..."
    }
    style={{
      flex: 1,
      padding: "16px 20px",
      borderRadius: "15px",
      border: `1px solid ${mode === "price" ? "rgba(34, 197, 94, 0.3)" : "rgba(102, 126, 234, 0.2)"}`,
      background: "rgba(255, 255, 255, 0.9)",
      fontSize: "14.5px",
      outline: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)"
    }}
  />

  {/* ✅ VOICE BUTTON ADDED */}
  <VoiceAssistant
    onText={(text) => {
      setInput(text);
      setTimeout(() => sendMessage(), 300);
    }}
  />

  <motion.button
    onClick={sendMessage}
    disabled={loading || !input.trim()}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{
      width: "52px",
      height: "52px",
      borderRadius: "15px",
      border: "none",
      background: loading || !input.trim() 
        ? "linear-gradient(135deg, #ccc 0%, #999 100%)"
        : mode === "price"
          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "#fff",
      cursor: loading || !input.trim() ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: loading || !input.trim()
        ? "0 4px 12px rgba(0,0,0,0.1)"
        : mode === "price"
          ? "0 6px 20px rgba(34, 197, 94, 0.4)"
          : "0 6px 20px rgba(37, 99, 235, 0.4)"
    }}
  >
    {loading ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "20px",
          height: "20px",
          border: "2px solid white",
          borderTopColor: "transparent",
          borderRadius: "50%"
        }}
      />
    ) : (
      <SendIcon />
    )}
  </motion.button>
</div>

                <div style={{
                  fontSize: "11px",
                  color: "#999",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  {/* <div>
                    Mode: <span style={{ color: mode === "price" ? "#22c55e" : "#2563eb", fontWeight: 600 }}>
                      {modes.find(m => m.id === mode)?.name}
                    </span>
                  </div>
                  <div>
                    Language: <span style={{ color: "#2563eb", fontWeight: 600 }}>
                      {languages.find(l => l.code === language)?.name}
                    </span>
                  </div> */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Minimized State */}
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              cursor: "pointer",
              background: "linear-gradient(135deg, #2563eb, #38bdf8 100%)",
              color: "#fff",
              flexShrink: 0
            }}
            onClick={onMinimize}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <PackyatraAvatar style={{ fontSize: 20, color: "white" }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  PackYatra
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "2px" }}>
                  {languages.find(l => l.code === language)?.flag} • Click to chat
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ExpandMoreIcon style={{ color: "rgba(255,255,255,0.8)" }} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatbotWindow;