import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: any;
    handleMessage(client: any, payload: any): void;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
}
