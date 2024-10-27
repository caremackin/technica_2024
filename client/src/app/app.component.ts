import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './homepage/homepage/home.component';
import {  OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              this.scrollToFragment();
          }
      });
  }

  scrollToFragment() {
      const fragment = this.router.routerState.snapshot.root.firstChild?.fragment;
      if (fragment) {
          const element = document.getElementById(fragment);
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  }
}