import { FAQ } from "@/types/faq";

const faqData: FAQ[] = [
  {
    id: 1,
    quest: "Why Graphs?",
    ans: "Graphs make complex data relationships easy to understand and explore. They let you connect the dots—literally—between different pieces of information, uncovering patterns and insights that might otherwise go unnoticed. With our tool, you don't need a background in machine learning or technical expertise. Just upload your tabular data (like a CSV file), and we'll turn it into a visual knowledge base. From there, you can explore connections, run optimized searches, and quickly link your documents to your data, helping you make smarter decisions without the heavy lifting.",
  },
  {
    id: 2,
    quest: "Is Preprocessing Really Important?",
    ans: "Bad data leads to bad decisions. Missing values, inconsistent formats, and improper encoding can quietly sabotage your models, making results unreliable. Preprocessing isn't just tedious—it's critical. The choices you make here directly affect your outcomes, and getting it wrong can mean starting over. That's why we rely on graph-based models that handle these challenges more gracefully. They're better at preserving the structure of your data, minimizing preprocessing headaches, and delivering reliable insights without the risk of critical missteps.",
  },
  {
    id: 3,
    quest: "Curse of Dimensionality?",
    ans: "As datasets grow in size and complexity, traditional tools struggle to uncover meaningful insights—drowning you in irrelevant noise. Our service cuts through this challenge by simplifying high-dimensional data into clear, actionable insights. We transform your data into an intuitive knowledge base, helping you focus on what matters without wasting time or resources.",
  },
];

export default faqData;
