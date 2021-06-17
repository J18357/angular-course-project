

export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date
    ){}

    //getter - special property that you can run code to get token
    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return;
        }
        return this._token;
    }
}
