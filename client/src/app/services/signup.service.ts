import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user";
import { Observable } from "rxjs";
import { first, catchError } from "rxjs/operators";
import { ErrorHandlerService } from "./errorhandler.service";
import { Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SignUpService {

    private url = 'http://localhost:4000/users';

    headerDict = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    httpOptions: { headers: HttpHeaders } = {
        headers: new HttpHeaders(this.headerDict)
    }

    constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user, this.httpOptions).pipe(
            first(), catchError(this.errorHandlerService.handleError<User>())
        )
    }

    updateUserFromId(user: User, id: number) {
        return this.http.put<User>(this.url + id, user).pipe(
            first(), catchError(this.errorHandlerService.handleError<User>()))
    }

}
