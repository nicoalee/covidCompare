import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild("loader") loader;

  constructor(private _loaderService: LoaderService) {}

  ngAfterViewInit() {
    this._loaderService.setLoader(this.loader)
  }

}
