import { SessionProvider } from "next-auth/react";
import Home from "./crypto";
//import { Home } from "./crypto";
const Chat: React.FC = () => {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
};

export default Chat;
