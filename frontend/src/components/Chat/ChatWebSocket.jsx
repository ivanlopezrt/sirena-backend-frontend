import React, { useState, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";

const ChatWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { currentUser, token, setCurrentUser} = useAuth();
    const chatID = useRef(crypto.randomUUID());

    useEffect(() => {

        if(!token){
            return;
        }

        //Crear la conexión WebSocket
        const ws = new WebSocket("ws://localhost:8015?authorization="+token+"&chatId="+chatID.current);

        ws.onopen = () => {
            console.log("Conectado al servidor WebSocket");
        };

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        ws.onclose = () => {
            console.log("Desconectado del servidor WebSocket");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [token,chatID]);

    const sendMessage = () => {
        if(input.trim().includes("fake")){
            socket.send(JSON.stringify({type:"unknowtype",content:{question:input.trim(), history:[]}}));
            setInput("");
            return;
        }
       
        if (socket && input.trim() !== "") {
             socket.send(JSON.stringify({ type:"question",content:{chatId:chatID.current,messageId:crypto.randomUUID(),question:input.trim(), history:[]}}));
            setInput("");
        }

    };

    return (
        <div>
          
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
            <h3>Mensajes recibidos:</h3>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatWebSocket;
