import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Sign Up Page",
  description: "Signup to Sahaai",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
