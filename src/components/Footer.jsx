import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Truck, 
  HelpCircle 
} from "lucide-react";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-top-wave"></div>
      
      <div className="footer-container">
        {/* COLUMN 1: BRAND PLATFORM */}
        <div className="footer-box brand-col">
          <div className="footer-logo-container">
            <div className="footer-logo-icon">
              <Truck size={24} />
            </div>
            <h2 className="footer-logo">
              <span className="brand-pack">PACK</span>
              <span className="brand-yatra">YATRA</span>
            </h2>
          </div>
          
          <p className="footer-description">
            India's most premium, transparent, and technology-driven relocation partner. 
            We make shifting stress-free, secure, and fully insured.
          </p>

          {/* Trust Badge */}
          <div className="footer-trust-badge">
            <ShieldCheck className="trust-icon" size={16} />
            <span>100% Safe & Insured Shifting</span>
          </div>

          {/* Social Media Links */}
          <div className="footer-social">
            <a href="https://wa.me/9071535535" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-icon wa">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61588337520152" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon fb">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/pack.yatra?utm_source=qr&igsh=MXMwdXo1cTh6MGg3eQ==" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon ig">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* COLUMN 2: SERVICES OFFERED */}
        <div className="footer-box links-col">
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li>
              <a href="/#services">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Household Shifting</span>
              </a>
            </li>
            <li>
              <a href="/#services">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Office Relocation</span>
              </a>
            </li>
            <li>
              <a href="/#services">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Vehicle Transportation</span>
              </a>
            </li>
            <li>
              <a href="/#services">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Local & Interstate Moving</span>
              </a>
            </li>
            <li>
              <a href="/#services">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Premium Packing & Storage</span>
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: CORPORATE LINKS */}
        <div className="footer-box links-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li>
              <a href="/about">
                <ArrowRight size={12} className="arrow-icon" />
                <span>About Us</span>
              </a>
            </li>
            <li>
              <a href="/contact">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Contact Support</span>
              </a>
            </li>
            <li>
              <a href="/terms-and-conditions">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Terms & Conditions</span>
              </a>
            </li>
            <li>
              <a href="/refund-policy">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Refund Policy</span>
              </a>
            </li>
            <li>
              <a href="/privacy-policy">
                <ArrowRight size={12} className="arrow-icon" />
                <span>Privacy Policy</span>
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: DIRECT CONTACT DETAILED */}
        <div className="footer-box contact-col">
          <h4>Get in Touch</h4>
          
          <div className="footer-contact-items">
            <a href="tel:+919071535535" className="footer-contact-card">
              <div className="contact-card-icon">
                <Phone size={16} />
              </div>
              <div className="contact-card-text">
                <span className="contact-label">Call Customer Care</span>
                <span className="contact-value">+91 90715 35535</span>
              </div>
            </a>

            <a href="mailto:info@packyatra.com" className="footer-contact-card">
              <div className="contact-card-icon">
                <Mail size={16} />
              </div>
              <div className="contact-card-text">
                <span className="contact-label">Email Support</span>
                <span className="contact-value">info@packyatra.com</span>
              </div>
            </a>

            <div className="footer-contact-card non-clickable">
              <div className="contact-card-icon">
                <MapPin size={16} />
              </div>
              <div className="contact-card-text">
                <span className="contact-label">Corporate Office</span>
                <span className="contact-value address-text">
                  122, 4th Main, 1st Stage, 1st Phase, West of Chord Road, Manjunath Nagar, Bangalore - 560010
                </span>
              </div>
            </div>

            <div className="footer-contact-card non-clickable">
              <div className="contact-card-icon timeline">
                <Clock size={16} />
              </div>
              <div className="contact-card-text">
                <span className="contact-label">Working Hours</span>
                <span className="contact-value">Mon - Sun: 24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-left">
            <span className="copyright-text">
              © {currentYear} <strong>Packyatra Relocation Pvt. Ltd.</strong> All Rights Reserved.
            </span>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-legal-links">
              <a href="/terms-and-conditions">Terms</a>
              <span className="legal-dot">•</span>
              <a href="/refund-policy">Payments</a>
              <span className="legal-dot">•</span>
              <a href="/privacy-policy">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
