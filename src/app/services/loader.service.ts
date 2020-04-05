import { Injectable } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Injectable({
    providedIn: "root"
})
export class LoaderService {

    private _loader: LoaderComponent;

    setLoader(loader: LoaderComponent) {
        this._loader = loader
    }

    show() {
        this._loader.show = true;
    }

    hide() {
        this._loader.show = false;
    }

    constructor() {}

}