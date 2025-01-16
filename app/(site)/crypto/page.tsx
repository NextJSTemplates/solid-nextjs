"use client";

import { ThirdwebProvider } from "thirdweb/react";
import Script from "next/script";
import { Main } from "../../../components/Crypto/main";
import Head from "next/head";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function Home() {
  const pathname = usePathname();
  //Add analytics for Sahaai page
  useEffect(() => {
    // Notify Google Analytics about the page change
    const url = `${pathname}`;
    console.log(url);
    sendGAEvent("conversion", { page_path: url });
  }, []);
  return (
    <div className="animate_top mx-auto mt-20 text-center">
      <ThirdwebProvider>
        <Main />
      </ThirdwebProvider>
    </div>
  );
}
