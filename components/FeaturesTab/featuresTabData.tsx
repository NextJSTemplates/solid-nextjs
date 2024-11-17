import { FeatureTab } from "@/types/featureTab";

const featuresTabData: FeatureTab[] = [
  {
    id: "tabOne",
    title: "LLMs Have Limits",
    desc1: `LLMs, RAG, and predictive ML tools are transforming industries, but they struggle with small, niche, sparse, high-dimensional, and noisy datasets — typical of real-world data, especially for smaller organizations. Industry professionals can't get quality analytics by simply uploading a local CSV to ChatGPT.`,
    desc2: `    With Krv, now they can. Tabular knowledge graphs bring the accessibility, sophistication, and interpretability of LLMs and RAG to high dimensional, sparse datasets.`,
    image: "/images/features/features-light-01.svg",
    imageDark: "/images/features/features-dark-01.svg",
  },
  {
    id: "tabTwo",
    title:
      "Effortless, Sophisticated, and Reliable Data Preprocessing and Exploration for SME's",
    desc1: `Unlike traditional solutions that require deep technical expertise or large data teams, our tool empowers SMEs to use cutting-edge machine learning techniques with minimal setup.`,
    desc2: `    No PhD in Data Science Required.`,
    image: "/images/features/features-light-01.svg",
    imageDark: "/images/features/features-dark-01.svg",
  },
  {
    id: "tabThree",
    title: "The Curse of Dimensionality is Knocking at our Door",
    desc1: `Effective data cleaning, preprocessing, and representation are crucial for extracting insights, especially with small, industry-specific datasets. While research offers many methods, not everyone has the expertise to navigate them. With so many options, making reliable choices is a challenge — even for data scientists.`,
    desc2: `Our tools automate the machine-learning data handling for you. Save time and understand the trustworthiness of your data's ability to address your end goal.`,
    image: "/images/features/features-light-01.svg",
    imageDark: "/images/features/features-dark-01.svg",
  },
];

export default featuresTabData;
