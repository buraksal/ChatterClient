import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { MessageDto } from '../Dto/MessageDto';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

   private  connection: any = new signalR.HubConnectionBuilder().withUrl("http://localhost:54116/chatsocket")
                                         .configureLogging(signalR.LogLevel.Information)
                                         .build();
   readonly POST_URL = "http://localhost:54116/chat/send"

  private receivedMessageObject: MessageDto = new MessageDto();
  private sharedObj = new Subject<MessageDto>();

  constructor(private http: HttpClient) { 
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on("SendMessage", (user: string, message: string) => { this.mapReceivedMessage(user, message); });
    this.start();                
  }

  public async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    } 
  }

  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessageObject.User = user;
    this.receivedMessageObject.Message = message;
    this.sharedObj.next(this.receivedMessageObject);
 }

  public sendMessage(msgDto: any) {
    this.http.post(this.POST_URL, msgDto).subscribe();
  }

  public retrieveMappedObject(): Observable<MessageDto> {
    return this.sharedObj.asObservable();
  }


}