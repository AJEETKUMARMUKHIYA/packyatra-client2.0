import React, { useState } from "react";
import FixedMovingForm from "./FixedMovingFormAdmin";
import Modal from "../pages/ModelAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faBoxOpen,
  faCheck,
  faShieldAlt,
  faTruck,
  faHandshake,
  faUsers,
  faChevronDown,
  faCar,faTruckMoving, faPeopleCarry,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/app-styles.css";

const HomeSelection = ({ onLoginStatusChange }) => {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [shiftingDate, setShiftingDate] = useState("");
  const [activeTab, setActiveTab] = useState("within");
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");
  const [shiftFromSuggestion, setShiftFromSuggestion] = useState([]);
  const [shiftingToSuggestion, setShiftingToSuggestion] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [distance, setDistance] = useState(0);

  const BANGALORE_COORDS = { lat: 12.9716, lon: 77.5946 };
  const CITY_RADIUS_KM = 30;
  const BETWEEN_RADIUS_KM = 200;

  const fetchAddressSuggestions = async (query, setSuggestions, city = "") => {
    if (query.length < 2) return;

    const searchQuery = city ? `${query}, ${city}` : query;

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      searchQuery
    )}&limit=10&apiKey=6c4609acb64b46699389f4929be8af24`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      let results = data.features || [];

      results = results.filter((f) => {
        if (!f.properties?.lat || !f.properties?.lon) return false;

        const point = {
          lat: f.properties.lat,
          lon: f.properties.lon,
        };

        const dist = calculateDistance(BANGALORE_COORDS, point);

        if (activeTab === "within") {
          return true;
        }

        if (activeTab === "between") {
          if (setSuggestions === setShiftFromSuggestion) {
            return dist <= BETWEEN_RADIUS_KM;
          }
          if (setSuggestions === setShiftingToSuggestion) {
            return dist > CITY_RADIUS_KM;
          }
        }

        return true;
      });

      setSuggestions(results);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return 0;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCheckPricesAdmin = () => {
    // Check if both addresses are filled
    if (!fromAddress || !toAddress) {
      setError("Please fill both From address and To address.");
      return;
    }

    // Check if addresses were selected from suggestions
    if (!fromCoords) {
      setError("Please select 'From' address from the suggestions.");
      return;
    }

    if (!toCoords) {
      setError("Please select 'To' address from the suggestions.");
      return;
    }

    setError("");

    const dist = calculateDistance(fromCoords, toCoords);
    setDistance(dist.toFixed(2));
    localStorage.setItem("fromAddress", fromAddress);
    localStorage.setItem("toAddress", toAddress);
    localStorage.setItem("shiftingDate", shiftingDate);
    localStorage.setItem("fromCoords", JSON.stringify(fromCoords));
    localStorage.setItem("toCoords", JSON.stringify(toCoords));
    openModal();
  };

  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="content-wrapper">
      <div className="main-content">
        <div id="home" className="page-section active">
          <section className="hero-banner">
            <div className="container">
              <div className="hero-content">
                <h2>India Ka Most Trusted Packers & Movers</h2>
                <h3>Har Move Mein Bharosa, Har Shift Mein Safety.</h3>
                <p>
                  Professional relocation services with years of proven experience,
                  offering secure door-to-door moving with full safety and insurance coverage
                  across 50+ cities in India.
                </p>
              </div>
            </div>
          </section>

          {!isModalOpen && (
            <FixedMovingForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              fromAddress={fromAddress}
              setFromAddress={setFromAddress}
              toAddress={toAddress}
              setToAddress={setToAddress}
              shiftingDate={shiftingDate}
              setShiftingDate={setShiftingDate}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              error={error}
              setError={setError}
              shiftFromSuggestion={shiftFromSuggestion}
              setShiftFromSuggestion={setShiftFromSuggestion}
              shiftingToSuggestion={shiftingToSuggestion}
              setShiftingToSuggestion={setShiftingToSuggestion}
              fetchAddressSuggestions={fetchAddressSuggestions}
              handleCheckPricesAdmin ={handleCheckPricesAdmin}
              fromCoords={fromCoords}
              setFromCoords={setFromCoords}
              toCoords={toCoords}
              setToCoords={setToCoords}
            />
          )}

          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            distance={distance}
            activeTab={activeTab}
            shiftingDate={shiftingDate}
            fromAddress={fromAddress}
            toAddress={toAddress}
            onLoginStatusChange={onLoginStatusChange}
          />

          {/* Rest of your sections remain the same */}
          <section>
            <div className="container section-title">
              <h2>Our Comprehensive Services</h2>
              <p>
                Complete packing and moving solutions tailored to your specific needs
              </p>
            </div>

            <div className="full-width-grid services-grid">
              <ServiceCard
                icon={faHome}
                title="Household Relocation"
                desc="Complete home shifting services including packing, loading, transport and unpacking."
                features={[
                  "Complete packing & unpacking",
                  "Furniture dismantling",
                  "Fragile item handling",
                  "Vehicle transportation",
                ]}
              />

              <ServiceCard
                icon={faBuilding}
                title="Office Relocation"
                desc="Fast and secure office moving services with minimal business downtime."
                features={[
                  "IT equipment handling",
                  "Document safety",
                  "Weekend relocation",
                  "Post-move setup",
                ]}
              />

              <ServiceCard
                icon={faBoxOpen}
                title="Packing & Storage"
                desc="High-quality packing materials and secure storage solutions."
                features={[
                  "Premium packing material",
                  "Climate-controlled storage",
                  "Inventory management",
                  "Short & long-term storage",
                ]}
              />
              <ServiceCard
                icon={faTruckMoving }
                title="Local Shifting Services"
                desc="Quick and affordable relocation within the same city."
                features={[
                  "Same-day shifting",
                  "Budget-friendly packages",
                  "Small load transport",
                  "Quick turnaround service",
                ]}
              />
              <ServiceCard
                icon={faPeopleCarry}
                title="Furniture Dismantling & Assembly"
                desc="Expert handling of large and modular furniture."
                features={[
                  "Bed & wardrobe dismantling",
                  "Modular kitchen setup",
                  "Office workstation setup",
                  "Reinstallation at destination",
                ]}
              />
              <ServiceCard
                icon={faCar}
                title="Vehicle Transportation"
                desc="Secure bike and car transportation across cities."
                features={[
                  "Enclosed vehicle carriers",
                  "Door-to-door pickup & delivery",
                  "Damage-free transport",
                  "Tracking feature available",
                ]}
              />
            </div>
          </section>

          <section className="features-section">
            <div className="container section-title">
              <h2>Why Choose Packyatra?</h2>
              <p>Trusted by thousands of customers across India</p>
            </div>

            <div className="full-width-grid features-grid">
              <Feature icon={faShieldAlt} title="100% Insured" desc="Complete transit insurance coverage." />
              <Feature icon={faHandshake} title="Transparent Pricing" desc="No hidden charges." />
              <Feature icon={faUsers} title="Expert Staff" desc="Highly trained professionals." />
              <Feature icon={faTruck} title="Nationwide Network" desc="Services across 50+ cities." />
              <Feature icon={faCheck} title="Timely Delivery" desc="On-time relocation guarantee." />
              <Feature icon={faBoxOpen} title="Quality Packing" desc="Premium packing materials." />
            </div>
          </section>

          <section>
            <div className="container section-title">
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="container faq-container">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeFaq === index ? "active" : ""}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.q}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, features }) => (
  <div className="service-card">
    <div className="service-icon">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <ul>
      {features.map((f, i) => (
        <li key={i}>
          <FontAwesomeIcon icon={faCheck} /> {f}
        </li>
      ))}
    </ul>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div className="feature-card">
    <FontAwesomeIcon icon={icon} />
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const Stat = ({ number, text }) => (
  <div className="stat-item">
    <div className="stat-number">{number}</div>
    <div className="stat-text">{text}</div>
  </div>
);
const faqData = [
  {
    q: "How much does packing and moving cost?",
    a: "Pricing depends on distance, volume and services. Local moves start from ₹1,000.",
  },
  {
    q: "Is insurance included?",
    a: "Yes, all shipments are fully insured.",
  },
  {
    q: "How long does the moving process take?",
    a: "Local moves typically take same days, long-distance moves depends on KM.",  
  },
  {    q: "Do you provide packing materials?",
       a: "Yes, we use high-quality packing materials to ensure safety.",
  },
  {    q: "Can I track my shipment?",
       a: "Yes, we provide tracking  facilities for all shipments.",
  },
  {    q: "What areas do you serve?",
       a: "We operate in over 50 cities across India.",
  },
  {
      q: "How do I get a quote?",
      a: "You can get a free quote by contacting us via phone, email or our website.",    
  },
  {    q: "What payment methods do you accept?",
       a: "We accept all major credit/debit cards, net banking and UPI.",
  },
  {    q: "What if I need to reschedule my move?",
       a: "You can reschedule up to 24 hours before the move date without any charges.",
  },
  {    q: "Are there any items you do not move?",
       a: "We do not transport hazardous materials.",
  },
  {    q: "How experienced is your staff?",
       a: "Our team has over 16 years of experience in the packing and moving industry.",
  },
  {    q: "Can I get help with unpacking?",
       a: "Yes, we offer unpacking services at your new location.",
  },
  {    q: "Do you offer storage solutions?",
       a: "Yes, we provide secure short-term and long-term storage options.",
  },
  {    q: "How do I prepare for my move?",
       a: "We provide a detailed moving checklist to help you prepare efficiently.",
  },
  {    q: "What if something gets damaged during the move?",
       a: "In the unlikely event of damage, our insurance policy covers repairs or replacements.",
  },
  {    q: "Can I customize my moving package?",
       a: "Yes, we offer customizable packages to suit your specific needs and budget.",
  },
  {    q: "How do I book your services?",
       a: "You can book our services online through our website or by calling our customer service.",
  },
  {   q: "What sets Packyatra apart from other movers?",
      a: "We offer personalized service, competitive pricing, and a commitment to safety and reliability."
 },
 {
    q:"Why should I pay token in advance before the move?",
    a:"Paying a token helps secure your move date and ensures priority service."
 }
];

export default HomeSelection;
