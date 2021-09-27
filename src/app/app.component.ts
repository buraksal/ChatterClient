import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto } from 'src/app/Dto/MessageDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe((receivedObj: MessageDto) => { this.addToInbox(receivedObj);});
                                                     
  }

  msgDto: MessageDto = new MessageDto();
  msgInbox: MessageDto[] = [];

  send(): void {
    if(this.msgDto) {
      if(this.msgDto.User.length == 0 || this.msgDto.User.length == 0){
        window.alert("Both fields are required.");
        return;
      } else {
        this.chatService.sendMessage(this.msgDto);
        this.msgDto.Message = "";
      }
    }
  }

  addToInbox(obj: MessageDto) {
    let newObj = new MessageDto();
    newObj.User = obj.User;
    newObj.Message = obj.Message;
    this.msgInbox.push(newObj);

  }
}