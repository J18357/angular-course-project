import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        //take = take one value (user) from observable and then auto unsubscribe
        // exhaustMap = gets user from take, return new observable (http observable) w stuff in exhaustMap
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
            if (!user){
                return next.handle(req)
            }
            const modifiedReq = req.clone(
                {params: new HttpParams().set('auth',user.token)
            });
            return next.handle(modifiedReq)
        }));
        
    }
}

