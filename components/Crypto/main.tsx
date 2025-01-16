import { useEffect, useState } from "react";
import sahaaiContractData from "../../contract_files/SahaaiManager.json";
import IdentifierModal from "./identifierModal";
import Sahaai from "./sahaai";
import WalletConnector from "./wallet_connector";
import { ethers } from "ethers";
import { useActiveAccount, useChainMetadata } from "thirdweb/react";
import Networks from "../../network.json";
import { baseNetwork } from "../../utils";
import SignupModal from "./userSignup";
import toast, { Toaster } from "react-hot-toast";

export function Main() {
  const activeAccount = useActiveAccount();
  console.log("address", activeAccount?.address);

  const [identifier, setIdentifier] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [chainId, setChainId] = useState("8453");
  const [walletAddress, setWalletAddress] = useState("");
  const networks: Network[] = Networks;
  const [hasBalance, setHasBalance] = useState(false);
  const [sahaaiContract, setSahaaiContract] = useState(
    networks[0].SahaaiManager,
  );
  const [tokenContract, setTokenContract] = useState(networks[0].TokenManager);
  const [subscriptionContract, setSubscriptionContract] = useState(
    networks[0].SubscriptionManager,
  );
  const [signatureContract, setSignatureContract] = useState(
    networks[0].SignatureManager,
  );

  useEffect(() => {
    checkMetamask();
    performNecessaryChecks();
  }, [activeAccount]);

  const checkMetamask = async () => {
    try {
      console.log("performing Metamask checks");
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        window.open("https://metamask.io/download");
        return undefined;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
      );
      const chainId = (await provider.getNetwork()).chainId;
      console.log("chain Id is:", chainId);

      if (chainId !== Number(8453) && chainId != Number(84532)) {
        console.log("switching chain");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [baseNetwork],
        });
        console.log("Network added successfully!");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: baseNetwork.chainId }], // Chain ID must be in hexadecimal format
        });
        console.log(`Switched to chain ${baseNetwork.chainId}`);
      }
    } catch (err) {
      console.error("failed to setup Metamask:", err);
      toast.error("Sahaai Works on BaseMainnet : https://www.base.org/");
      // alert(
      //   "Sahaai Works on BaseSepolia Testnet : https://thirdweb.com/base-sepolia-testnet"
      // );
    }
  };

  //Perform unique identifier lookup
  async function performNecessaryChecks() {
    if (activeAccount) {
      try {
        console.log("performing necessary checks");
        if (!window.ethereum) {
          alert("MetaMask is not installed!");
          window.open("https://metamask.io/download");
          return undefined;
        }
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any,
        );
        const chainId = (await provider.getNetwork()).chainId;
        console.log("chain Id is:", chainId, chainId !== Number(8453));
        /*    if (chainId !== Number(8453) && chainId != Number(84532)) {
          console.log("switching chain");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [baseNetwork],
          });
          console.log("Network added successfully!");
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: baseNetwork.chainId }], // Chain ID must be in hexadecimal format
          });
          console.log(`Switched to chain ${baseNetwork.chainId}`);
        }*/
        let _sahaaiContract = sahaaiContract;
        let _tokenContract = tokenContract;
        let _subscriptionContract = subscriptionContract;
        let _signatureContract = signatureContract;

        for (const index in networks) {
          if (networks[index].chain_id === String(chainId)) {
            _sahaaiContract = networks[index].SahaaiManager;
            _tokenContract = networks[index].TokenManager;
            _subscriptionContract = networks[index].SubscriptionManager;
            _signatureContract = networks[index].SignatureManager;
            console.log(
              "chainID is:",
              chainId,
              "contract-address is:",
              _sahaaiContract,
              _tokenContract,
              _subscriptionContract,
            );
            setChainId(String(chainId));
            setSahaaiContract(_sahaaiContract);
            setTokenContract(_tokenContract);
            setSubscriptionContract(_subscriptionContract);
            setSignatureContract(_signatureContract);
            break;
          }
        }

        console.log("the provider is:", provider);
        const signer = provider.getSigner();
        // const userAddress = await signer.getAddress();
        const SahaaiContract = new ethers.Contract(
          _sahaaiContract,
          sahaaiContractData.abi,
          signer,
        );

        if (!SahaaiContract) {
          setMessage("Contract not loaded.");
          console.log(message);
          return;
        }

        console.log("contract loaded", SahaaiContract, activeAccount?.address);
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log("The wallet addres is:", address);
        const balance = String(await provider.getBalance(address));
        console.log("The balance is:", balance);
        if (balance === "0") {
          setHasBalance(true);
        } else {
          setHasBalance(false);
          const tx = await SahaaiContract.addressesToIdentifiers(address);
          if (!tx) {
            toast.error("no identifier registered");
            //alert("no identifier registered");
            setOpenModal(true);
          } else {
            setIdentifier(tx);
          }
          console.log("the identifier is", tx);
        }
      } catch (err) {
        console.error("failed to fetch identifier:", err);
        toast.error("Sahaai Works on BaseMainnet : https://www.base.org/");
        // alert(
        //   "Sahaai Works on BaseSepolia Testnet : https://thirdweb.com/base-sepolia-testnet"
        // );
      }
    }
  }

  async function registerIdentifier(identifier: string) {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
      );

      console.log("the provider is:", provider);
      const signer = provider.getSigner();
      // const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(
        sahaaiContract,
        sahaaiContractData.abi,
        signer,
      );

      if (!contract) {
        setMessage("Contract not loaded.");
        return;
      }
      console.log(contract);
      const tx = await contract.registerIdentifier(String(identifier + ".eth"));
      const response = await tx.wait;
      console.log("identifier is", response);
      setIdentifier(identifier);
    } catch (err: any) {
      console.error("Failed to register identifier:", err);
      toast.error("failed to register indentifier" + err.reason);
      //alert(err.reason);
      setMessage("Failed to register identifier. Check console for errors.");
    }
  }
  return (
    <div>
      {activeAccount && identifier && !hasBalance ? (
        <Sahaai
          chainId={chainId}
          sahaai_manager_contract={sahaaiContract}
          token_manager_contract={tokenContract}
          subscription_manager_contract={subscriptionContract}
          signature_manager_contract={signatureContract}
        />
      ) : (
        <WalletConnector />
      )}
      {hasBalance && (
        <SignupModal
          walletAddress={walletAddress}
          onClose={() => {
            setHasBalance(false);
            if (!identifier) {
              setOpenModal(true);
            }
          }}
          onSignup={(data: any) => console.log("User signed up:", data)}
        />
      )}
      <Toaster />

      <IdentifierModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={registerIdentifier}
        onSkip={() => setIdentifier("newuser")}
      />
    </div>
  );
}
