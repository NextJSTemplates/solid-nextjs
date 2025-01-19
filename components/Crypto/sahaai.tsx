"use client";

import React, { useEffect, useState } from "react";
import tokenContractData from "../../contract_files/TokenManager.json";
import styles from "../../styles/Sahaai.module.css";
import AiWalletModal from "./aiWalletModal";
import axios from "axios";
import { ethers } from "ethers";
import ReactMarkdown from "react-markdown";
import { createThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  useActiveAccount,
  useChainMetadata,
} from "thirdweb/react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

let recognition: SpeechRecognition | null = null;

const client = createThirdwebClient({
  clientId: "19490c4ed25bd67afd3cceec71670335",
});

const Sahaai: React.FC<sahaaiProps> = ({
  chainId,
  sahaai_manager_contract,
  token_manager_contract,
  subscription_manager_contract,
  signature_manager_contract,
}) => {
  const [status, setStatus] = useState<
    "idle" | "listening" | "processing" | "speaking"
  >("idle");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [longPressTimeout, setLongPressTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const _trans = `Here is another image banner for your conversational AI platform focused on automating crypto transactions:![Revolutionize Your Crypto Transactions with AI Automation](https://oaidalleapiprodscus.blob.core.windows.net/private/org-rdZKrdBWaM3pv3NYd4bl404b/user-oIJ7vJNlK0vKaL408Fr9LDE6/img-n3PkQBN31zqrmzgG4ExsZZ0B.png?st=2024-12-16T15%3A35%3A42Z&se=2024-12-16T17%3A35%3A42Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-12-16T03%3A42%3A41Z&ske=2024-12-17T03%3A42%3A41Z&sks=b&skv=2024-08-04&sig=PNlFGnkh/F6NGupJODIEmOONHl%2BHkmnwfvK2FkYfIp0%3D) Feel free to use this banner for your platform! If you need any further modifications or a different design, let me know![ActionTaken(helper_text="Thank you for sharing the banner for the conversational AI platform !Its a great visual to attract users to automate their crypto transactions.", next_steps=['Request modifications to the banner', 'Provide feedback on the current design', 'Explore additional marketing materials'], type='General')]'`;
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const activeAccount = useActiveAccount();
  const chainData = useChainMetadata();
  const [input, setInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string>("");
  const sahaaiContract = sahaai_manager_contract;
  const tokenContract = token_manager_contract;
  const subscriptionContract = subscription_manager_contract;
  const signatureContract = signature_manager_contract;

  const firstPlay = () => {
    if (audioPlayed) {
      return;
    }
    // Create an audio object
    const audio = new Audio("/sahaai.wav");

    // Play the audio on the first render
    audio.play().catch((error) => {
      console.error("Audio play failed:", error);
    });
    setAudioPlayed(true);
  };
  const handleLongPress = () => {
    setStatus("listening");
    if (audio) audio.pause();
    startListening();
    console.log("Listening started");
  };

  const generateSecureNonce = (length = 16) => {
    const array = new Uint8Array(length); // Create a byte array
    crypto.getRandomValues(array); // Fill it with cryptographically secure random values
    // Convert bytes to a hexadecimal string
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };

  //const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const SendToAIAgent = async (prompt: string | null) => {
    if (!prompt || prompt === "") {
      toast.error("no input recorded try again...");
      setStatus("idle");
      return;
    }
    setStatus("processing");
    console.log("Listening stopped. Processing input...");

    try {
      let threadId = chatId;
      let user_id = userId;
      if (activeAccount) {
        threadId = !chatId || chatId === null ? uuidv4() : chatId;
        setChatId(threadId);
        user_id = activeAccount.address;
        setUserId(user_id);
      } else {
        toast.error("Please connect your wallet");
      }
      // Define the API endpoint
      const chatApiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const nonce = generateSecureNonce();
      console.log("sending a request with nonce", nonce);
      // Send a POST request to the chat server
      const { hash, signature } = await signEIP712Transaction(
        String((prompt as string) + nonce),
      );
      console.log(prompt, hash, signature);
      console.log(
        "The prompt is:",
        String(
          `My Address:${user_id}${prompt},hash is:${hash}  & signature is:${signature}`,
        ),
      );
      //setTranscript(null);
      if (!hash || !signature) return;
      const response = await axios.post(
        chatApiUrl as string,
        {
          message: String(
            `My Address:${user_id},query:${prompt},hash is:${hash},&signature is:${signature}`,
          ),
          thread_id: threadId,
          user_id: user_id,
          hash: hash,
          prompt: prompt,
          signature: signature,
          chain_id: chainId,
          nonce: nonce,
        },
        {
          headers: {
            "Content-Type": "application/json", // Standard header
            chain_id: "31337", // Custom header
          },
          responseType: "json",
        },
      );
      console.log(response);

      // Check if the request was successful
      if (!response) {
        throw new Error("Failed to call chat server");
      }
      const { text } = response.data;
      setChatResponse(`${chatResponse}\nSahaai:   ${text}\n`);
      console.log("the llm response is:", text);
      await TTS(String(response.data.text));
    } catch (error) {
      setStatus("idle");
      console.error("Error:", error);
    }
  };

  function removeSpecialCharacters(input: string): string {
    const _input = extractText(input);
    // Regular expression to remove all characters except a-z, A-Z, 0-9, ., , and !
    return _input.replace(/[^a-zA-Z0-9.,! ]/g, "");
  }
  const extractText = (md: string): string => {
    return md
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links but keep text
      .replace(/`{1,3}.*?`{1,3}/g, "") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/[#>*_\-~`]+/g, "") // Remove Markdown symbols
      .replace(/\n{2,}/g, "\n") // Remove extra newlines
      .trim();
  };

  const handleLongPressRelease = async () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
    stopListening();
    if (status === "listening") await SendToAIAgent(transcript);
  };
  const handleTap = () => {
    if (status === "speaking" && audio) {
      audio.pause();
      setStatus("idle");
      console.log("speaking stopped");
    } else if (audio && status === "idle") {
      audio.play();
      setStatus("speaking");
      console.log("speaking started");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        if (!recognition) {
          return;
        }
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
          const speechResult = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ");
          setTranscript(speechResult);
          setChatResponse(`${chatResponse}\nYou:   ${speechResult}\n`);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setStatus("idle");
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
      //setChatResponse(null);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleMouseDown = () => {
    const timeout = setTimeout(handleLongPress, 500);
    setLongPressTimeout(timeout);
  };

  const handleMouseUp = () => {
    handleLongPressRelease();
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault(); // Prevent new line on Enter
      setTranscript(input);
      setChatResponse(`${chatResponse}\nYou:   ${input}\n`);
      SendToAIAgent(input);
      setInput("");
    }
  };

  const handleButtonClick = async () => {
    if (input.trim()) {
      setTranscript(input);
      setChatResponse(`${chatResponse}\nYou:   ${input}\n`);
      SendToAIAgent(input);
      setInput("");
    }
    console.log(chainData);
  };

  const TTS = async (input: string | null) => {
    // Create a blob from the audio file response

    // Decode audio file and create a Blob

    // const audioBuffer = Uint8Array.from(atob(audio_file.content), (c) =>
    // c.charCodeAt(0)
    //);
    try {
      const formatted_input = removeSpecialCharacters(input as string);
      console.log("formatted input is:", formatted_input);
      const audio_file = await fetch(
        `${process.env.NEXT_PUBLIC_TTS_URL}/api/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: formatted_input }),
        },
      );
      console.log(audio_file);
      const audioBlob = new Blob([Buffer.from(await audio_file.arrayBuffer())]);

      // Create a URL for the audio file
      const audioUrl = window.URL.createObjectURL(audioBlob);
      //play the audio inside the browser
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => {
        setStatus("idle");
        setAudio(null);
      };
      setAudio(newAudio);
      console.log("Audio file saved successfully!");
      setStatus("speaking");
      newAudio.play();
      console.log("speaking started");
    } catch (e) {
      console.log("error fetching Audio", e);
      setStatus("idle");
    }
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
      setStatus("idle");
      return Promise.resolve({ hash: undefined, signature: undefined });
    }
  }

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

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
  //  const renderContent = (content: any) => {
  //    if (!content) {
  //      return <p>No results available</p>;
  //    }
  //
  //    // Split content by spaces and render text or images accordingly
  //    const contentElements = content.split(" ").map((item: any, index: any) => {
  //      if (item.startsWith("http://") || item.startsWith("https://")) {
  //        // Render image if URL is detected
  //        return (
  //          <img
  //            key={index}
  //            src={item}
  //            alt={`Result ${index}`}
  //            className={styles.resultImage}
  //          />
  //        );
  //      }
  //      // Render text otherwise
  //      return (
  //        <span key={index} className={styles.resultText}>
  //          {item}&nbsp;
  //        </span>
  //      );
  //    });
  //
  //    return contentElements;
  //  };

  return (
    <div>
      <div className={styles.walletButtonLeft}>
        <ConnectButton client={client} theme={"light"} />
      </div>
      <button
        onClick={() => setOpenWalletModal(true)}
        className={styles.walletButtonRight}
      >
        AI-Wallet
      </button>
      <AiWalletModal
        isOpen={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        onSubmit={DepositETH}
      />
      <div className={styles.container} onClick={firstPlay}>
        <div
          className={`${styles.circle} ${styles[status]}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleTap}
        >
          <img src="sahaai_logo.png" alt="S" className={styles.icon} />
        </div>
        {chatResponse && chatResponse !== "" && (
          <div className={styles.resultBox}>
            <ReactMarkdown>
              {isListening ? transcript : chatResponse}
            </ReactMarkdown>
          </div>
        )}
        <Toaster />
        <div className={styles.chatinputcontainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            //rows={1}
            type="text"
            className={styles.chatinput}
          />
          <button onClick={handleButtonClick} className={styles.sendbutton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Sahaai;
