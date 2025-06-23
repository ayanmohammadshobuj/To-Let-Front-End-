// src/app/features/chat/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { TokenService } from '../../../core/authentication/token.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);

  constructor(private tokenService: TokenService) {
    this.client = new Client({
      brokerURL: environment.websocketUrl,
      connectHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      },
      debug: function (str) {
        console.log(str);
      }
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  subscribeToChatRoom(roomId: number): Observable<ChatMessage> {
    this.client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      this.messageSubject.next(chatMessage);
    });

    return this.messageSubject.asObservable();
  }

  sendMessage(roomId: number, message: ChatMessage): void {
    this.client.publish({
      destination: `/chat/${roomId}/sendMessage`,
      body: JSON.stringify(message)
    });
  }
}
