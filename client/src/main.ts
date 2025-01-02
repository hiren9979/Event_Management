import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/login/login.component';
import { EventsComponent } from './app/components/events/events.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { appConfig } from './app/app.config';


bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
