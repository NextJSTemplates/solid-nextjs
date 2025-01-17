import React, { useEffect } from "react";

const RazorpayProSubscriptionButton = () => {
  useEffect(() => {
    // Create the Razorpay script element
    const script = document.createElement("script");
    script.src =
      "https://cdn.razorpay.com/static/widget/subscription-button.js";
    script.dataset.subscription_button_id = "pl_PkXYuKLion4TiG"; // Replace with your Subscription Button ID
    script.dataset.button_theme = "brand-color"; // Optional: customize the button theme
    script.async = true;

    // Append the script to the form
    const form = document.getElementById("razorpay-subscription-form");
    if (form) {
      form.appendChild(script);
    }

    return () => {
      // Cleanup: Remove script when component unmounts
      if (form) {
        form.innerHTML = "";
      }
    };
  }, []);

  return (
    <div>
      <h2>Subscribe to Our Plan</h2>
      {/* Add the form */}
      <form id="razorpay-subscription-form" action="#">
        {/* The Razorpay script will insert the button here */}
      </form>
    </div>
  );
};

export default RazorpayProSubscriptionButton;
