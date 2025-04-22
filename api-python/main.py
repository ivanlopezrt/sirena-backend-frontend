from fastapi import FastAPI, WebSocket
from messages.MessageFactory import MessageFactory
from processors.MessageProcessorFactory import MessageProcessorFactory
from responders.WebSocketResponder import WebSocketResponder

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    responder = WebSocketResponder(websocket)
    
    while True:
        data = await websocket.receive_json()
        message = MessageFactory(data)
        processor = MessageProcessorFactory(message.type, responder)
        await processor.process(message)

