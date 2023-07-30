import React from "react";
import Image from "next/image";

type FaqData = {
  activeFaq: number;
  id: number;
  handleFaqToggle: (id: number) => void;
  quest: string;
  ans: string;
};

const FAQItem = ({ faqData }: { faqData: FaqData }) => {
  const { activeFaq, id, handleFaqToggle, quest, ans } = faqData;

  return (
    <>
      <div className="flex flex-col border-b border-stroke dark:border-strokedark">
        <h4
          onClick={() => {
            handleFaqToggle(id);
          }}
          className="cursor-pointer flex justify-between items-center font-medium text-metatitle3 text-black dark:text-white py-5 lg:py-7.5 px-6 lg:px-9"
        >
          {quest}
          <Image
            width={28}
            height={16}
            src="./images/icon/icon-plus-light.svg"
            alt="plus"
            className={`dark:hidden ${activeFaq === id ? "hidden" : "block"}`}
          />
          <Image
            width={28}
            height={16}
            src="./images/icon/icon-minus-light.svg"
            alt="minus"
            className={`dark:hidden ${activeFaq === id ? "block" : "hidden"}`}
          />
          <Image
            width={28}
            height={16}
            src="/images/icon/icon-plus-dark.svg"
            alt="plus"
            className={`hidden ${
              activeFaq === id ? "dark:hidden" : "dark:block"
            }`}
          />
          <Image
            width={28}
            height={28}
            src="/images/icon/icon-minus-dark.svg"
            alt="minus"
            className={`hidden ${
              activeFaq === id ? "dark:block" : "dark:hidden"
            }`}
          />
        </h4>
        <p
          className={`py-5 lg:py-7.5 px-6 lg:px-9 border-t border-stroke dark:border-strokedark ${
            activeFaq === id ? "block" : "hidden"
          }`}
        >
          {ans}
        </p>
      </div>
    </>
  );
};

export default FAQItem;
