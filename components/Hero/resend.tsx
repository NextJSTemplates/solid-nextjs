"use client";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";

export function SignIn() {
  const resendAction = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.target);
    const email = formData.get("email");

    // Trigger the NextAuth `signIn` function
    await signIn("resend", { email });
  };
  return (
    <div className="mt-10">
      <form onSubmit={resendAction}>
        <div className="flex flex-wrap gap-5">
          <input
            name="email"
            type="text"
            placeholder="Enter your email address"
            className="rounded-full border border-stroke px-6 py-2.5 shadow-solid-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
            required
          />
          <button
            aria-label="get started button"
            className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
            type="submit"
          >
            Get Started
          </button>
        </div>
      </form>

      <p className="mt-5 text-black dark:text-white">
        Try for free no credit card required.
      </p>
      <Toaster />
    </div>
  );
}
