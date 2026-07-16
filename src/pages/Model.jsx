import { useNavigate } from "react-router-dom";
import "../styles/Modal.css";
import moviingTeam from "../assests/Images/moving-team.webp";
import OtpLogin from "../components/OtpLogin.jsx";
import { isOtpValid } from "../utils/auth";

const Modal = ({ isOpen, closeModal, distance, activeTab, shiftingDate, fromAddress, toAddress, selectedCity }) => {
  const navigate = useNavigate();

  const continueBooking = () => {
    closeModal();
    navigate(`/booking?distance=${distance}&activeTab=${activeTab}`, {
      state: { distance, activeTab, shiftingDate, fromAddress, toAddress, selectedCity }
    });
  };

  if (!isOpen) return null;

  // Already logged in (within 30 minutes)
  if (isOtpValid()) {
    continueBooking();
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="modal-close-btn" onClick={closeModal}>×</button>
        <div className="modal-image">
          <img src={moviingTeam} alt="Delivery" />
        </div>
        <div className="modal-content">
          <OtpLogin 
            onSuccess={continueBooking}
            userData={{
              address: { fromAddress, toAddress }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;