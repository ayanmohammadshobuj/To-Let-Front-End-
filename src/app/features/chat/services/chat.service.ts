// src/app/features/chat/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ChatRoom } from '../models/chat-room.model';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  createChatRoom(chatRoom: Partial<ChatRoom>): Observable<ChatRoom> {
    return this.apiService.post<ChatRoom>('/api/chat-rooms', chatRoom);
  }

  getMessagesByChatRoomId(chatRoomId: number): Observable<ChatMessage[]> {
    return this.apiService.get<ChatMessage[]>(`/api/chat-rooms/${chatRoomId}/messages`);
  }

  sendMessage(message: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.apiService.post<ChatMessage>('/api/chat-messages', message);
  }
}
