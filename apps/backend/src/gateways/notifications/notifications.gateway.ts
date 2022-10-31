import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @SubscribeMessage('notification')
  async notification() {
    return undefined;
  }
}
