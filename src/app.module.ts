import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketGatewayService } from './Websocket/websocketgateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebSocketGatewayService],
})
export class AppModule {}
