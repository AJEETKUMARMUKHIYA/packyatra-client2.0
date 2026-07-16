import React, { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import "../styles/Cityddl.css";
import bangloreImg from "../assests/Images/banglore.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cities = [
  { name: "Bangalore", img: bangloreImg },
];

const FixedMovingForm = ({
  activeTab,
  setActiveTab,
  fromAddress,
  setFromAddress,
  toAddress,
  setToAddress,
  shiftingDate,
  setShiftingDate,
  selectedCity,
  setSelectedCity,
  error,
  setError, // ADDED THIS
  shiftFromSuggestion,
  setShiftFromSuggestion,
  shiftingToSuggestion,
  setShiftingToSuggestion,
  fetchAddressSuggestions,
  handleCheckPrices,
  fromCoords,
  setFromCoords,
  toCoords,
  setToCoords,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    setToAddress("");
    setShiftingToSuggestion([]);
    setError(""); // Clear error when tab changes
  }, [activeTab]);

  return (
    <aside className="right-section fixed-form">
      <div className="form-container">
        <h2>Planning to relocate? Tell us your destination</h2>
        
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "within" ? "active" : ""}
            onClick={() => {
              setActiveTab("within");
              setFromAddress("");
              setToAddress("");
              setFromCoords(null);
              setToCoords(null);
              setShiftFromSuggestion([]);
              setShiftingToSuggestion([]);
              setError("");
            }}
          >
            Within city
          </button>

          <button
            className={activeTab === "between" ? "active" : ""}
            onClick={() => {
              setActiveTab("between");
              setFromAddress("");
              setToAddress("");
              setFromCoords(null);
              setToCoords(null);
              setShiftFromSuggestion([]);
              setShiftingToSuggestion([]);
              setError("");
            }}
          >
            Between cities
          </button>
        </div>

        {/* City Selector */}
        {activeTab === "within" && (
          <div className="city-selector-compact">
            <label>Select your city</label>
            <div className="selected-city-display compact" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {selectedCity ? (
                <>
                  <img src={cities.find(c => c.name === selectedCity)?.img} alt={selectedCity} className="city-icon-small" />
                  <span className="city-name-text">{selectedCity}</span>
                </>
              ) : (
                <span className="placeholder">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Select a city
                </span>
              )}
              <span className="dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
              <div className="cities-grid-compact">
                {cities.map(city => (
                  <div
                    key={city.name}
                    className={`city-item-compact ${selectedCity === city.name ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCity(city.name);
                      setDropdownOpen(false);
                      setError("");
                    }}
                  >
                    <img src={city.img} alt={city.name} />
                    <span className="city-label">{city.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {/* Shifting From */}
        <div className="form-group location-input">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <input
            type="text"
            placeholder="Shifting from"
            value={fromAddress}
            onChange={(e) => {
              const val = e.target.value;
              setFromAddress(val);
              setFromCoords(null); // Clear coordinates when typing
              setError(""); // Clear error
              fetchAddressSuggestions(val, setShiftFromSuggestion, selectedCity);
            }}
          />
          {shiftFromSuggestion.length > 0 && (
            <div className="suggestions">
              {shiftFromSuggestion.map((p, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setFromAddress(p.properties?.formatted || "");
                    setFromCoords({ lat: p.properties?.lat, lon: p.properties?.lon });
                    setShiftFromSuggestion([]);
                    setError(""); // Clear error when selecting
                  }}
                >
                  <FontAwesomeIcon icon={faLocationArrow} />
                  <span>{p.properties?.formatted}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shifting To */}
        <div className="form-group location-input">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <input
            type="text"
            placeholder="Shifting to"
            value={toAddress}
            onChange={(e) => {
              const val = e.target.value;
              setToAddress(val);
              setToCoords(null); // Clear coordinates when typing
              setError(""); // Clear error
              fetchAddressSuggestions(val, setShiftingToSuggestion, selectedCity);
            }}
          />
          {shiftingToSuggestion.length > 0 && (
            <div className="suggestions">
              {shiftingToSuggestion.map((p, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setToAddress(p.properties?.formatted || "");
                    setToCoords({ lat: p.properties?.lat, lon: p.properties?.lon });
                    setShiftingToSuggestion([]);
                    setError(""); // Clear error when selecting
                  }}
                >
                  <FontAwesomeIcon icon={faLocationArrow} />
                  <span>{p.properties?.formatted}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Select shifting date</label>
          <div className="date-input-wrapper">
            <DatePicker
              selected={shiftingDate}
              onChange={(date) => setShiftingDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy"
              className="date-input"
              value={shiftingDate}
              minDate={new Date()}
            />
          </div>
        </div>

        {/* Submit */}
        <button className="submit-btn" onClick={handleCheckPrices}>
          Check prices
        </button>
      </div>
    </aside>
  );
};

export default FixedMovingForm;