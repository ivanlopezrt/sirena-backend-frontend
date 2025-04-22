import {MessageEditModalProps} from "./MessageEditModal";
import {useState} from "react";

export default function ModifiedMessage(props: MessageEditModalProps) {
    const [visibleOriginal, setVisibleOriginal] = useState(false);
    const message = props.message;

    return (
        <>
            <div className="message-already-rated text-gray-500 font-italic">
                <p className={""}>La respuesta de este mensaje fue editada.</p>

                {visibleOriginal && (
                    <div className="message-already-rated text-gray-500 font-italic">
                        <p>Respuesta original:</p>
                        <p>
                            {message.text}
                        </p>
                    </div>
                )}

                <p className="text-decoration-underline cursor-pointer" onClick={() => {
                    setVisibleOriginal(!visibleOriginal)
                }}>{visibleOriginal ? "Ocultar" : "Ver original"}</p>
            </div>

        </>
    );
}
