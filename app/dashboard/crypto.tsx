"use client";

import { ThirdwebProvider } from "thirdweb/react";
import Script from "next/script";
import { Main } from "../../components/Crypto/main";
import Head from "next/head";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useSession } from "next-auth/react";
import { auth } from "../../auth";
export default function Home() {
  const { data: session } = useSession();
  console.log("The session is ", session);

  const pathname = usePathname();
  //Add analytics for Sahaai page
  useEffect(() => {
    // Notify Google Analytics about the page change
    const url = `${pathname}`;
    console.log(url);
    sendGAEvent("conversion", { page_path: url });
  }, []);
  /*if (!session?.user) {
    redirect("/auth/signin");
  }*/
  if (!session || !session) return <div></div>;

  return (
    <div className="animate_top mx-auto text-center">
      <ThirdwebProvider>
        <Main />
      </ThirdwebProvider>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await auth(ctx);

  return {
    props: {
      session,
    },
  };
}
