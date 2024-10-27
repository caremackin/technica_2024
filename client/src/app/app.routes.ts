import { Routes } from '@angular/router';
import { HomeComponent } from './homepage/homepage/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CanopyComponent } from './comprehension_canopy/canopy.component'

export const routes: Routes = [
    { path: '', component: HomeComponent}, 
    { path: 'signup', component: SignupComponent},
    { path: 'login', component: LoginComponent},
    { path: 'canopy', component: CanopyComponent},
];
