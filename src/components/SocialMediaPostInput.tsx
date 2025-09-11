// src/components/SocialMediaPostInput.tsx
import { useState } from "react";
import ShareChallengeForm from "./ShareChallengeForm";
import { Plus, X } from "lucide-react";
import "../assets/styles/share-challenge-input.scss";

const SocialMediaPostInput = () => {
  const [showForm, setShowForm] = useState(false);

  const handleInputClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="social-media-input-container-cyb">
      {/* Short Input Bar */}
      {!showForm && (
        <div className="short-input-cyb" onClick={handleInputClick}>
          <Plus size={24} className="icon-cyb" />
          <span className="placeholder-cyb">
            Bạn có challenge nào hay không?
          </span>
        </div>
      )}

      {/* Share Form */}
      {showForm && (
        <div className="form-wrapper-cyb">
          <button
            className="close-btn-cyb"
            onClick={handleCloseForm}
            aria-label="Đóng form">
            <X size={20} />
          </button>
          <ShareChallengeForm onSuccess={handleFormSuccess} />
        </div>
      )}
    </div>
  );
};

export default SocialMediaPostInput;
