import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { article } from '../main/dtos';

@Injectable({
    providedIn: "root"
})
export class NewsService {


    constructor(private _http: HttpClient) {}

    private _newsURL: string = environment.newsUrlFirst
    private _apiKey: string = environment.newsUrlSecond

    getNews(country: string): Observable<any> {
        return this._http.get(`${this._newsURL}coronavirus ${country}${this._apiKey}`).pipe(
            map((item: {status: string, totalResults: number, articles: article}) => item.articles)
        )
    }

}