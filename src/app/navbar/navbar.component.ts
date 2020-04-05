import { Component, OnInit } from '@angular/core';
import { faVirus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faVirus = faVirus

  constructor() { }

  ngOnInit(): void {
  }

}
