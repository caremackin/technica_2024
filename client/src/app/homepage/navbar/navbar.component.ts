import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../models/user';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavComponent {
  title = 'project';
  isAuthenticated = false;
  isAdmin = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
}
}