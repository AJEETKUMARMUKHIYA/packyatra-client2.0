import React from "react";
//import "../styles/About.css"; // you can create and reuse global CSS if already present

const About = () => {
  return (
    <>
    <div className="about-page">
      {/* Our Story & Mission */}
      <section className="services-section">
        <div className="container">
          <div className="section-title">
            <h2>Our story & mission</h2>
            <p>Building trust through reliable relocation services since 2008</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3>Our Journey</h3>
              <p>
                Founded in 2008, Packyatra started with a single truck and a
                vision to make relocations stress-free. Today, we serve
                thousands of customers annually across 50+ cities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional relocation services with transparency,
                reliability, and care, ensuring a seamless transition for our
                customers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Our Vision</h3>
              <p>
                To become India’s most trusted relocation partner by setting new
                standards in safety, efficiency, and customer satisfaction.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3>Our Values</h3>
              <p>
                Integrity, transparency, safety, and customer satisfaction are
                the core values driving everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="features-section">
        <div className="container">
          <div className="section-title">
            <h2>Our certifications & Recognition</h2>
            <p>Accredited and recognized for our quality services</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-award"></i>
              </div>
              <div className="service-content">
                <h3>ISO 9001:2015 Certified</h3>
                <p>
                  Certified for Quality Management Systems ensuring consistent
                  service delivery and continuous improvement.
                </p>
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="service-content">
                <h3>Fully Insured</h3>
                <p>
                  Comprehensive insurance coverage for all shipments with
                  leading insurance partners.
                </p>
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <div className="service-content">
                <h3>Industry Associations</h3>
                <p>
                  Active member of Indian Packers & Movers Association (IPMA)
                  and other recognized industry bodies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
    </>
  );
};

export default About;
