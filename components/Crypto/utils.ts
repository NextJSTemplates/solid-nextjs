import axios from "axios";

export const SendToAIAgent = async (prompt: string | null, threadId: string | null, userId: string | null, hash: string | null, signature: string | null, chainId: string | null, nonce: string): Promise<string | undefined> => {
    if (!prompt || prompt === "") {
        return "no input provided";
    }

    if (!threadId) {
        return "chat Id not provided"
    }
    if (!userId) {
        return "user ethereum address not provided"
    }
    if (!hash || !signature) {
        return "EIP-712 Signature error"
    }
    if (!chainId) {
        return "chainId not provided"
    }
    if (!nonce) {
        return "random nonce not provided"
    }
    try {

        // Define the API endpoint
        const chatApiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        console.log(
            "The prompt is:",
            String(
                `My Address:${userId}${prompt},hash is:${hash}  & signature is:${signature}`,
            ),
        );
        //setTranscript(null);
        if (!hash || !signature) return;
        const response = await axios.post(
            chatApiUrl as string,
            {
                message: String(
                    `My Address:${userId},query:${prompt},hash is:${hash},&signature is:${signature}`,
                ),
                thread_id: threadId,
                user_id: userId,
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
        console.log("the llm response is:", text);
        return removeSpecialCharacters(String(text))
    } catch (error) {
        console.error("Error:", error);
        return `error executing the crypto Tool: ${JSON.stringify(error)}`
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