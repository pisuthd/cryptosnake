import { Injectable } from '@angular/core';


import { Headers, Http, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from "../environments/environment"

@Injectable()
export class OnlineService {

    url : string 

    constructor(
        private http: Http

    ) {
        this.url  = environment.public_api_endpoint
    }

    getDefaultConfig(): Observable<any> {
        return this.http.get(this.url+'/api/public/defaultConfig')
            .map((res: Response) => res.json())
            .catch(
            (error: Response) => {
                return Observable.throw(error);
            }
            )
    }
}