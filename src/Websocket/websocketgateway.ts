import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//Note: Enables Cross-Origin Resource Sharing (CORS) for the WebSocket server
@WebSocketGateway({ cors: { origin: '*' } })

//@WebSocketGateway(80, { namespace: 'message' })
export class WebSocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('message', { sender: 'Server', message: 'Welcome!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message') // Listen for 'message' events from postman
  handleMessage(@MessageBody() payload: any): void {
    console.log('Raw received data:', payload);

    let data: any;
    try {
      // If the payload is a string, parse it
      data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    } catch (error) {
      console.error('Failed to parse incoming message:', error);
      return;
    }

    // Extract data from the payload
    data = data?.data ?? data;

    if (!data || typeof data.sender !== "string" || typeof data.message !== "string") {
      console.error('Invalid message format:', JSON.stringify(data, null, 2));
      return;
    }

    console.log(`Received message: ${data.message} from ${data.sender}`);
    this.server.emit('message', data);
  }
}
