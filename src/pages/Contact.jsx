import React from "react";
import "../styles/Contact.css"; // you can create and reuse global CSS if already present

const Contact = () => {
  return (
    <>
   {/* Hero Banner */}
      <div className="contact-page">
      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            {/* Contact Info */}
            <div className="contact-info">
              <h3>Packyatra Office Addresses</h3>
              <p>
                We're here to help you with your moving needs. Feel free to reach
                out through any channel.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Head  Office</h4>
                    <h4>Packyatra Relocations private limited</h4>
                    <p>
                      122, 4th Main, 1st stage,1st phase,
                      <br />
                      west of chord road,manjunath nagar,
                        <br />
                      Bangalore - 560010, India
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Phone Numbers</h4>
                    <p>
                        +91 90715 35535
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email Address</h4>
                    <p>
                       customercare@packyatra.com
                      <br />
                      contact@packyatra.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="footer-social" style={{ marginTop: "30px" }}>
                <h4>Follow us on :</h4>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
              </div>
            </div>
                {/* <div className="col-md-12 pt-5">
                   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.970004902728!2d77.61520809999999!3d12.9737703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1683e3538b95%3A0x4ea384007ad549d6!2sPikkol!5e0!3m2!1sen!2sin!4v1761215571788!5m2!1sen!2sin" width="800" height="400" style={{ border: 'none' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div> */}
            {/* Contact Form */}
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Contact;
