import { useChatContext } from "../../context/ChatProvider";
import { CONNECTION_STATE } from "../../hooks/useWebSocketChat";

export default function ChatAssistantStatus() {

    const { status, connectionState } = useChatContext();

    return <div className="d-flex justify-content-center flex-column me-3">
        <span className="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1">
            Asistente
        </span>
        <div className="mb-0 lh-1">
            <span className={`badge badge-${connectionState === CONNECTION_STATE.CONNECTED ? 'success' : 'danger'} badge-circle w-10px h-10px me-1`}></span>
            <span className="fs-7 fw-semibold text-muted">
                {connectionState === CONNECTION_STATE.CONNECTED ? "En linea" : "Conectando..."} {status.description}
            </span>
        </div>
    </div>
}

