import { useChatContext } from "../../context/ChatProvider";
import Chat from "../../models/Chat";

export interface ChatListItemProp {
    chat: Chat;
}

export default function ChatListItem(props: ChatListItemProp) {
    const { deleteChat, setActiveChat } = useChatContext();
    const { chat } = props;

    const confirmDelete = () => {
        if (window.confirm("¿Eliminar conversación?")) {
            deleteChat(chat);
        }
    };

    return (
        <div
            className="d-flex flex-row flex-stack p-4 bg-light bg-hover-light-primary rounded mb-5"
            onClick={() => {
                setActiveChat(chat);
            }}
        >
            <div className="d-flex flex-column w-50">
                <span
                    className="fs-5  fw-bold text-gray-900 text-hover-primary mb-2"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {chat.title}
                </span>

                <div className="d-flex">
                    <span className="text-muted small mb-1">
                        {new Date(chat.creation_date).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="d-flex flex-column align-items-end ms-2">
                <div
                    className="btn btn-sm btn-icon btn-light-danger btn-active-danger w-30px h-30px"
                    onClick={confirmDelete}
                >
                    <i className="bi bi-trash"></i>
                </div>
            </div>
        </div>
    );
}
