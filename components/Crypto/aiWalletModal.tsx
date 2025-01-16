import React, { useState } from "react";
import styles from "../../styles/AiWalletModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, inputs: Record<string, string>) => void;
}

const AiWalletModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [transactionType, setTransactionType] = useState("ETH");
  const [ethAmount, setEthAmount] = useState("");
  const [erc20Address, setErc20Address] = useState(
    "0x0000000000000000000000000000000000000000",
  );
  const [erc20Amount, setErc20Amount] = useState("");

  const handleSubmit = () => {
    if (transactionType === "ETH") {
      onSubmit(transactionType, { amount: ethAmount });
    } else {
      onSubmit(transactionType, { address: erc20Address, amount: erc20Amount });
    }
    setEthAmount("");
    setErc20Address("");
    setErc20Amount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Send Transaction</h2>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className={styles.modalSelect}
        >
          <option value="ETH">ETH</option>
          <option value="ERC20">ERC20</option>
        </select>
        {transactionType === "ETH" && (
          <input
            type="text"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            className={styles.modalInput}
            placeholder="ETH Amount"
          />
        )}
        {transactionType === "ERC20" && (
          <>
            <input
              type="text"
              value={erc20Address}
              onChange={(e) => setErc20Address(e.target.value)}
              className={styles.modalInput}
              placeholder="ERC20 Address"
            />
            <input
              type="text"
              value={erc20Amount}
              onChange={(e) => setErc20Amount(e.target.value)}
              className={styles.modalInput}
              placeholder="ERC20 Amount"
            />
          </>
        )}
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiWalletModal;
