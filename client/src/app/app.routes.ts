import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventsComponent } from './components/events/events.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventsComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' }
  ];
  