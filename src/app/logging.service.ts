import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class LoggingService {
    //dummy service to test lazy loading v eagerly loaded services
    lastlog: string;
    printLog(message: string){
        console.log(message);
        console.log(this.lastlog);
        this.lastlog = message;
    }
}