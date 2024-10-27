import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './homepage/homepage/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
}