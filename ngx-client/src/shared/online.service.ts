import { Injectable } from '@angular/core';


import { Headers, Http, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from "../environments/environment"

@Injectable()
export class OnlineService {

    url: string

    constructor(
        private http: Http

    ) {
        this.url = environment.public_api_endpoint
    }

    getBalance(pubkey: string): Observable<any> {
        let headers = new Headers();
        headers.append('x-api-key', environment.api_key);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.url + '/api/user/'+pubkey, options)
            .map((res: Response) => res.json())
            .catch(
                (error: Response) => {
                    return Observable.throw(error);
                }
            )
    }


    getDefaultConfig(): Observable<any> {
        let headers = new Headers();
        headers.append('x-api-key', environment.api_key);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.url + '/api/config', options)
            .map((res: Response) => res.json())
            .catch(
                (error: Response) => {
                    return Observable.throw(error);
                }
            )
    }
}