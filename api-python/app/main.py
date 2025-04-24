import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from typing import Optional
from security.TokenVerifier import TokenVerifier
from security.BypassTokenVerifier import BypassTokenVerifier
from messages.MessageFactory import MessageFactory
from processors.MessageProcessorFactory import MessageProcessorFactory
from responders.WebSocketResponder import WebSocketResponder
from dotenv import load_dotenv

def load_environment()->bool:
    env_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/app/conf/.env'
    load_dotenv(dotenv_path=env_path, verbose=True, override=True)

load_environment()
    
app = FastAPI()

@app.get("/ws/ping")
async def ping(token: Optional[str] = None):
    return {"response": "pong"}

@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket, token: Optional[str] = None):
    
    tokenVerifier = TokenVerifier()
    if not tokenVerifier.verify(token):
        raise HTTPException(status_code=401, detail="Token inválido")
    
    await websocket.accept()
    responder = WebSocketResponder(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            message = MessageFactory(data)
            print(message, flush=True)
            processor = MessageProcessorFactory(message.type, responder)
            await processor.process(message)
    except WebSocketDisconnect:
        print("Cliente desconectado")
        
