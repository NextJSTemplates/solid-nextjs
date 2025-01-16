import { useState } from "react";
import Head from "next/head";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useConnect } from "thirdweb/react";
import styles from "../../styles/wallet_connector.module.css";
const client = createThirdwebClient({
  clientId: "19490c4ed25bd67afd3cceec71670335",
});
export default function WalletConnector() {
  return (
    <div className="100hw flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-900 via-purple-800 to-black text-white">
      <Head>
        <title>Sahaai - Automate Your Crypto Commerce</title>
      </Head>

      <main className="p-8 text-center">
        <div className="mb-8">
          <h1 className="neon-text text-6xl font-extrabold">Sahaai</h1>
          <p className="mt-4 text-xl text-gray-300">
            Live on{" "}
            <a
              href="https://docs.base.org/docs/using-base/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.styledlink}
            >
              {" "}
              Base Mainnet
            </a>{" "}
            Test Net!
          </p>
        </div>

        {<ConnectButton client={client} theme={"light"} />}
      </main>

      <style jsx>{`
        .neon-text {
          text-shadow:
            0 0 10px #ff00ff,
            0 0 20px #ff00ff,
            0 0 40px #ff00ff;
        }
      `}</style>
    </div>
  );
}
