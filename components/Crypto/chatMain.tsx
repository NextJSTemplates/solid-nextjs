import { memo, useContext, useEffect, useState } from "react";
import sahaaiContractData from "../../contract_files/SahaaiManager.json";
import IdentifierModal from "./identifierModal";
import WalletConnector from "./wallet_connector";
import { ethers } from "ethers";
import { useActiveAccount } from "thirdweb/react";
import Networks from "../../network.json";
import { baseNetwork } from "../../utils";
import SignupModal from "./userSignup";
import toast, { Toaster } from "react-hot-toast";
import tokenContractData from "../../contract_files/TokenManager.json";
import AiWalletModal from "./aiWalletModal";
import { Button } from "../ui/button";
import styles from "../../styles/Sahaai.module.css";
import { ArrowUpIcon, BitcoinIcon } from "../ChatBot/icons";
import { CryptoContext } from "../ChatBot/chat";

export function ChatMain({
  submitForm,
  input,
  uploadQueue,
  isSendButton,
  setInput,
  chatId,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
  isSendButton: boolean;
  setInput: (input: string) => void;
  chatId: string;
}) {
  const activeAccount = useActiveAccount();
  //console.log("address", activeAccount?.address);

  const [identifier, setIdentifier] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [chainId, setChainId] = useState("8453");
  const [signature, setSignature] = useState("");
  const [userId, setUserId] = useState("");
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
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const { useCrypto, setUseCrypto } = useContext(CryptoContext);
  const [finalPrompt, setFinalPrompt] = useState(input);
  useEffect(() => {
    checkMetamask();
    performNecessaryChecks();
    //if (!activeAccount?.address) setUseCrypto(false);
  }, [activeAccount?.address]);
  const DepositETH = async (transactionType: string, data: any) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
      );

      const signer = provider.getSigner();
      console.log("contractAddress is:", tokenContract);
      const contract = new ethers.Contract(
        tokenContract,
        tokenContractData.abi,
        signer,
      );
      const address = await signer.getAddress();
      if (!contract) {
        return;
      }
      console.log(tokenContract, contract, address);
      let tx: any;
      if (transactionType === "ETH") {
        console.log("data is:", data);
        tx = await contract.depositETH(address, {
          value: ethers.utils.parseUnits(data.amount, "ether"),
        });
      } else {
        console.log("address for approval is", address);
        await approveERC20(tokenContract, data.address, data.amount);
        //await delay(5000);
        ethers.utils.parseUnits(data.amount, "18");
        console.log("data is:", data);

        tx = await contract.depositToken(
          address,
          data.address,
          ethers.utils.parseUnits(data.amount, "18"),
        );
      }

      const response = await tx.wait();
      console.log("Deposited Funds", response);
      toast.success(`Deposited Funds:${JSON.stringify(response)}`);
    } catch (err: any) {
      console.error("error while depositing tokens", err);
      toast.error(JSON.stringify(err.reason));
    }
  };

  async function approveERC20(
    spenderAddress: string,
    tokenAddress: string,
    amountToApprove: string,
  ) {
    try {
      // Create the data for the approve function
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
      );
      const signer = provider.getSigner();
      const functionSignature = "approve(address,uint256)";
      const functionSelector = ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes(functionSignature))
        .substring(0, 10);

      // Encode spender and amount to approve
      const spenderEncoded = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [spenderAddress],
      );
      const amountEncoded = ethers.utils.defaultAbiCoder.encode(
        ["uint256"],
        [ethers.utils.parseUnits(amountToApprove, 18)],
      );

      // Concatenate the encoded data
      const data =
        functionSelector +
        spenderEncoded.substring(2) +
        amountEncoded.substring(2);

      // Build transaction
      const tx = {
        to: tokenAddress,
        data: data,
      };

      // Send transaction
      const txResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", txResponse.hash);

      // Wait for transaction confirmation
      const receipt = await txResponse.wait();
      console.log("Transaction confirmed:", receipt);
    } catch (error) {
      console.error("Error approving ERC20:", error);
    }
  }

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

      if (chainId !== Number(8453) && chainId !== Number(84532)) {
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
        if (!provider) {
          setUseCrypto(false);
        }
        const chainId = (await provider.getNetwork()).chainId;
        console.log("chain Id is:", chainId, chainId !== Number(8453));
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
      const tx = await contract.registerIdentifier(String(`${identifier}.eth`));
      const response = await tx.wait;
      console.log("identifier is", response);
      setIdentifier(identifier);
    } catch (err: any) {
      console.error("Failed to register identifier:", err);
      toast.error(`failed to register indentifier${err.reason}`);
      setMessage("Failed to register identifier. Check console for errors.");
    }
  }

  const generateSecureNonce = (length = 16) => {
    const array = new Uint8Array(length); // Create a byte array
    crypto.getRandomValues(array); // Fill it with cryptographically secure random values
    // Convert bytes to a hexadecimal string
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };

  /********************* Signing a message ************************************** */

  // Sample function to sign data
  async function signEIP712Transaction(
    input: string,
  ): Promise<{ hash: string | undefined; signature: string | undefined }> {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
      );
      console.log(provider);
      const signer = provider.getSigner();
      ``;
      console.log("signer is", signer);

      const userAddress = await signer.getAddress();
      const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(input));
      console.log(userAddress, hash);
      // Define EIP-712 types

      const domain = {
        name: "sahaai",
        version: "1",
        chainId: (await provider.getNetwork()).chainId, // Replace with your chain ID
        verifyingContract: signatureContract, //CONTRACT_ADDRESS, // Replace with your contract address
      };

      const types = {
        RedeemRequest: [
          { name: "user", type: "address" },
          { name: "message_hash", type: "string" },
        ],
      };
      console.log(domain, types);
      const value = { user: userAddress, message_hash: hash };
      console.log(domain, types, value);
      const signature = await signer._signTypedData(domain, types, value);
      console.log("hash is:", hash, " signature is :", signature);
      setSignature(signature);
      return Promise.resolve({ hash, signature });
    } catch (e) {
      toast.error(String(e));
      console.error(e);
      return Promise.resolve({ hash: undefined, signature: undefined });
    }
  }

  /** Creating the crypto send button & building the prompt */

  const createCryptoPrompt = async () => {
    let user_id = userId;

    if (activeAccount) {
      user_id = activeAccount.address;
      setUserId(user_id);
    } else {
      toast.error("Please connect your wallet");
    }
    const nonce = generateSecureNonce();
    const { hash, signature } = await signEIP712Transaction(
      String((input as string) + nonce),
    );
    console.log(input, hash, signature);
    const _finalPrompt = `prompt:${input},threadId:${chatId},userId:${user_id},hash:${hash},signature:${signature},chainId:${chainId},nonce:${nonce}`;
    console.log("The final prompt is:", _finalPrompt);
    setInput(_finalPrompt);
    setFinalPrompt(_finalPrompt);
  };

  // Define the asynchronous function
  const handleSendCryptoPrompt = async () => {
    // Prevent the default action

    try {
      await createCryptoPrompt();
      submitForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error submitting form:${error}`);
    }
  };

  function PureSendButton({
    submitForm,
    input,
    uploadQueue,
  }: {
    submitForm: () => void;
    input: string;
    uploadQueue: Array<string>;
  }) {
    return (
      <Button
        className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
        onClick={(event) => {
          event.preventDefault();
          submitForm();
        }}
        disabled={input.length === 0 || uploadQueue.length > 0}
      >
        <BitcoinIcon size={14} />
      </Button>
    );
  }

  const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
    if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
      return false;
    if (prevProps.input !== nextProps.input) return false;
    return true;
  });

  return (
    <div>
      {!isSendButton ? (
        <div>
          <WalletConnector />
          <Button
            onClick={() => setOpenWalletModal(true)}
            className={styles.walletButtonRight}
            data-modal-target="wallet-ai"
            data-modal-toggle="wallet-ai"
            type="button"
          >
            AI-Wallet
          </Button>
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
        </div>
      ) : (
        <SendButton
          submitForm={handleSendCryptoPrompt}
          input={finalPrompt}
          uploadQueue={uploadQueue}
        />
      )}
      <Toaster />
      <AiWalletModal
        isOpen={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        onSubmit={DepositETH}
      />
      <IdentifierModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={registerIdentifier}
        onSkip={() => setIdentifier("newuser")}
      />
    </div>
  );
}
