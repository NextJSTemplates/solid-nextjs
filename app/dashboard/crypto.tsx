"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { Main } from "../../components/Crypto/main";
import { redirect, usePathname, } from "next/navigation";
import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useSession } from "next-auth/react";
import { auth } from "../../auth";
export default function Home() {
  const { data: session, status } = useSession();
  console.log("The session is ", session);

  const pathname = usePathname();
  //Add analytics for Sahaai page
  useEffect(() => {
    // Notify Google Analytics about the page change
    const url = `${pathname}`;
    console.log(url);
    sendGAEvent("conversion", { page_path: url });
  }, []);
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
    console.log(session, status);
  }, [session]);
  /*if (!session?.user) {
    redirect("/auth/signin");
  }*/
  if (status === "loading") return <div>loading...</div>;

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
