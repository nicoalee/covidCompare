import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class GraphTypeService {
    emitGraphChange = new Subject<string>();

    emit(str: string) {
        this.emitGraphChange.next(str);
    }
}