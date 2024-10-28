import ChatRoot from "../components/Chat/ChatRoot";
import { ChatProvider } from "../context/ChatProvider";

export default function Chat() {
    return (
        <ChatProvider>
            <ChatRoot />
        </ChatProvider>
    );
}
