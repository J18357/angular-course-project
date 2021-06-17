import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { Subject, throwError, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId:string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    
    constructor(private http: HttpClient,
        private router: Router){}
    
    //subject =  will inform all places whether user changes
    //beaviorsubject = on demand get user data whenever new data emitted 
    //+ get access to older data
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    
    
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn);
        })
        );
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
            ).pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn);
            }));
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        //manages a timer (millisec) to auto logout 
        this.tokenExpirationTimer = setTimeout(()=> {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string, 
        userId: string,
        token: string, 
        expiresIn: number
        ){
        const expirationDate = new Date(new Date().getTime()+ expiresIn*1000);
            const user = new User(email, userId, token, expirationDate);
            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            localStorage.setItem('userData', JSON.stringify(user));
    }

    //retrieve user data from local storage
    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData){
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        //token is a getter, also checking the token validity
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = 
                new Date(userData._tokenExpirationDate).getTime() - 
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage="An unknown error occured!";
            if(!errorRes.error || !errorRes.error.error){
                //can't access message bc error in diff format
                return throwError(errorMessage);
            }
            switch(errorRes.error.error.message){
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exits already';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage= 'This password is not correct.';
                    break;
                }
            //return observable (mandatory) using throwError
            return throwError(errorMessage);
    }
}
