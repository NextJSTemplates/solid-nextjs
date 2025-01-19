import type { FAQ } from "@/types/faq";

const faqData: FAQ[] = [
  {
    id: 1,
    quest: "Can we execute crypto transactions?",
    ans: "Yes Sahaai allows you to perform on chain actions crypto actions like transfer, erc20 token creation, NFT minting and much more",
  },
  {
    id: 2,
    quest: "Can it help me build websites?",
    ans: "Sahaai's programming tools allow users to quickly build and launch their websites using simple prompts",
  },
  {
    id: 3,
    quest: "What framework can I use to build & monetize custom tools?",
    ans: "Currently Sahaai is using LangChain & Lang graph to build agents and tools.It supports multiple LLM models like GPT-4o , llama.You can refer to documentation section to get started on building with us",
  },
];

export default faqData;
