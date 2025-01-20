import Head from "next/head";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import styles from "../../styles/wallet_connector.module.css";
const client = createThirdwebClient({
  clientId: "19490c4ed25bd67afd3cceec71670335",
});
export default function WalletConnector() {
  return (
    <>
      <ConnectButton
        connectButton={{
          style: {
            padding: "8px 16px",
            height: "40px",
            minWidth: "0",
          },
        }}
        client={client}
        theme={"light"}
      />
    </>
  );
}
