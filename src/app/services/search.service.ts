import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class SearchService {

    emitSearchResults = new Subject<string>();

    emitRemoveResult = new Subject<string>();

    constructor() {}
    
    emitSearched(search: string) {
        this.emitSearchResults.next(search);
    }

    emitRemoved(search: string) {
        this.emitRemoveResult.next(search)
    }


}