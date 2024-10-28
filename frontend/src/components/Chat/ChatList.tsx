import ChatListItem from "./ChatListItem";
import { ChatModel } from "../../models/ChatModel";
import { useChatContext } from "../../context/ChatProvider";

export default function ChatList() {
    const { data, setActiveChat } = useChatContext();
    return (
        <div className="chat-list flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
            <div className="card card-flush sticky">
                <div className="card-header" id="kt_chat_messenger_header">
                    <div className="card-title w-100 justify-content-between">
                        <div className="d-flex justify-content-center flex-column me-3">
                            <span className="fs-4 fw-bold text-gray me-1 mb-2 lh-1">
                                Últimas consultas
                            </span>
                        </div>
                        <div
                            onClick={() => {
                                setActiveChat(new ChatModel());
                            }}
                            className="btn btn-sm btn-icon btn-light-primary btn-active-primary w-30px h-30px"
                        >
                            <i className="ki-duotone ki-plus fs-2 text-gray-500"></i>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div>
                        {data?.map((chat) => (
                            <ChatListItem key={chat.id} chat={chat} />
                        ))}
                        <div className="separator separator-dashed d-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
