import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* SECTION 1 */}
        <div className="footer-box">
          <h2 className="footer-logo">
               <span>PACKYATRA</span>
         </h2>

          {/* Social Media */}
          <div className="footer-social">
            <a href="https://wa.me/9071535535" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61588337520152" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/pack.yatra?utm_source=qr&igsh=MXMwdXo1cTh6MGg3eQ==" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            {/* <a href="https://twitter.com/packyatra" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a> */}
          </div>
        </div>

        {/* <div className="footer-line"></div> */}

        {/* SECTION 2 */}
        <div className="footer-box">
          <h4>Company</h4>
          <a href="/about">About</a>
          {/* <a href="/services">Services</a> */}
          {/* <a href="/team">Team</a> */}
          <a href="/contact">Contact</a>
          <a href="/terms-and-conditions">Terms & Conditions</a>
          <a href="/refund-policy">Refund & Privacy Policy</a>
        </div>

        {/* <div className="footer-line"></div> */}

        {/* SECTION 3 */}
        {/* <div className="footer-box">
          <h4>Support</h4>
          <a href="#faq">FAQs</a>
         <a href="/terms-and-conditions">Terms & Conditions</a>
          <a href="/refund-policy">Refund & Privacy Policy</a>
        </div> */}

        {/* <div className="footer-line"></div> */}

        {/* SECTION 4 */}
        <div className="footer-box">
          <h4>Contact</h4>
          <p><i className="fas fa-phone"></i>+91 90715 35535</p>
          <p><i className="fas fa-envelope"></i> info@packyatra.com</p>
          <p><i className="fas fa-map-marker-alt"></i>122, 4th Main, 1st stage,1st phase,
                    west of chord road,manjunath nagar,
                    Bangalore - 560010, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        {/* © {new Date().getFullYear()} Packyatra Relocation Pvt. Ltd. | All Rights Reserved */}
        <div className="footer-left">
        <a href="/terms-and-conditions" className="footer-link">Terms & Conditions</a>
        <a href="/refund-policy" className="footer-link">Payment Policy</a>
        <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
       </div>
       <div className="copyright">© Packyatra Relocation Pvt. Ltd. | All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;