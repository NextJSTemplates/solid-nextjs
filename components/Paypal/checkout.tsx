import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaypalCheckout({ planId }) {
  const initialOptions = {
    clientId:
      "AQZ5lEQfGXisk9OQPT7bfCD82QDtTMaOnUsYXuqgzQI4LwnjOmg7e3bpIjyy-nPMyoYGvviKzVoD4KpC",
    vault: true,
    // Add other options as needed
  };
  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons />
      </PayPalScriptProvider>
    </div>
  );
}
/*import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

export default function PaypalCheckout({ planId }) {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId:
      "AQZ5lEQfGXisk9OQPT7bfCD82QDtTMaOnUsYXuqgzQI4LwnjOmg7e3bpIjyy-nPMyoYGvviKzVoD4KpC", //"AQZ5lEQfGXisk9OQPT7bfCD82QDtTMaOnUsYXuqgzQI4LwnjOmg7e3bpIjyy-nPMyoYGvviKzVoD4KpC",
    vault: true,
    intent: "subscription",
  };

  const createSubscription: PayPalButtonsComponentProps["createSubscription"] =
    (data, actions) => {
      return actions.subscription.create({
        plan_id: planId, //"P-7F294816WX455453EM6F4CZQ",
      });
    };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    alert(`You have successfully subscribed to ${data.subscriptionID}`); // Optional message given to subscriber
  };

  return (
    <div className="PaypalCheckout">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createSubscription={createSubscription}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
}
*/
