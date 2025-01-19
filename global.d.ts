// global.d.ts

interface Window {
    webkitSpeechRecognition: any;
    ethereum?: import("@metamask/providers").MetamaskInpageProvider; // Add MetaMask type

}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare let SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};


interface Network {
    name: string,
    rpc_url: string,
    chain_id: string
    AccessManager: string
    SignatureManager: string
    SubscriptionManager: string
    TokenManager: string,
    SahaaiManager: string
}

type sahaaiProps = {
    chainId: string;
    sahaai_manager_contract: string;
    token_manager_contract: string,
    subscription_manager_contract: string;
    signature_manager_contract: string;
};


type Subscription = {
    expiry: number // Timestamp of subscription expiry
    planId: number; // Subscription plan ID
    active: bool;
}