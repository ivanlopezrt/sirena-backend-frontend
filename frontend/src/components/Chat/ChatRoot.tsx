import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { useChatContext } from "../../context/ChatProvider";

export default function ChatRoot() {
    const { chat } = useChatContext();

    return (
        <>
            <div className="d-flex flex-column flex-lg-row  h-100">
                <ChatList />
                <ChatWindow model={chat!} />
            </div>
        </>
    );
}
