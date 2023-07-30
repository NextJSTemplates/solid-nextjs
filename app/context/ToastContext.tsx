"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ToasterContext;
