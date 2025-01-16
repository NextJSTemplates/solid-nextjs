import React, { useState } from "react";
import styles from "../../styles/SignupModal.module.css"; // CSS module for styling
import toast, { Toaster } from "react-hot-toast";

type SignupProps = {
  walletAddress: string;
  onClose: () => void;
  onSignup: (data: any) => void;
};

const SignupModal: React.FC<SignupProps> = ({
  walletAddress,
  onClose,
  onSignup,
}) => {
  const [step, setStep] = useState(1); // Step 1: User Info, Step 2: OTP Verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: walletAddress,
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      console.log("formData is :", formData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OTP_URL}/request-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setMessage("OTP sent to your email.");
      } else {
        setMessage(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage(`Something went wrong. Please try again.${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OTP_URL}/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
            userAdd: walletAddress,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        onSignup(formData); // Pass user data to parent component on successful signup
        setMessage("Email verified successfully!");

        toast.success("Funds successfully deposited");
        onClose();
      } else {
        setMessage(data.error || "Invalid or expired OTP.");
      }
    } catch (error) {
      setMessage(`Something went wrong. Please try again.${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeButton} onClick={onClose}>
          &times;
        </div>
        <Toaster />
        {step === 1 && (
          <>
            <h2 className={styles.modalTitle}>Sign Up</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.modalInput}
              placeholder="Enter your name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.modalInput}
              placeholder="Enter your email"
            />
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              className={styles.modalInput}
              placeholder="Enter your wallet address"
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  onClose();
                }}
              >
                cancel
              </button>
              <button
                className={styles.submitButton}
                onClick={handleRequestOtp}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Next"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.modalTitle}>Verify OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.modalInput}
              placeholder="Enter OTP"
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setStep(1)} // Go back to user info
              >
                Back
              </button>
              <button
                className={styles.submitButton}
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Submit"}
              </button>
            </div>
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default SignupModal;
