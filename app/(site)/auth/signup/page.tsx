import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Page - Solid SaaS Boilerplate",

  // other metadata
  description: "This is Sign Up page for Startup Pro"
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
