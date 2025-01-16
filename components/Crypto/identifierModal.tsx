import React, { useState } from "react";
import styles from "../../styles/IdentifierModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string) => void;
  onSkip: () => void;
}

const IdentifierModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeButton} onClick={onClose}>
          &times;
        </div>
        <h2 className={styles.modalTitle}>Enter Identifier</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.modalInput}
          placeholder="Type here..."
        />
        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              onSkip();
              onClose();
            }}
          >
            Skip
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentifierModal;
