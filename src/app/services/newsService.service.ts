import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: "root"
})
export class NewsService {

    // newapi.org is a public api, no need to hide API key
    private _newsURL: string = environment.newsUrl

}