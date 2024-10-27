import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { first, catchError } from "rxjs/operators";
import { ErrorHandlerService } from "./errorhandler.service";
import { Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class KeywordService {

    private url = 'http://127.0.0.1:5000/';

    headerDict = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    httpOptions: { headers: HttpHeaders } = {
        headers: new HttpHeaders(this.headerDict)
    }

    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

    getKeyWords(text): Observable<any> {
        return this.http.post<any>(this.url + 'keywords', { text });
    }

    getImageUrls(keywords:Array<string>): Observable<any> {
        return this.http.post<any>(this.url + 'images', { keywords });
    }

    getYouTubeVideos(keywords:Array<string>): Observable<any> {
        return this.http.post<any>(this.url + 'search', { 'keywords': keywords });
    }

    reGenImage(keyword:string): Observable<any> {
        return this.http.post<any>(this.url + 'regenImage', { keyword });
    }

    summarizeText(text:string): Observable<any> {
        return this.http.post<any>(this.url + 'summary', { text });
    }
}



