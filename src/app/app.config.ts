import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),provideHttpClient(),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "adding-poduct", appId: "1:890097519125:web:bf2033dd7eed170990dc1c", storageBucket: "adding-poduct.appspot.com", apiKey: "AIzaSyBqu2-QY50umbVYch2VGyh9w2DM18dDVDE", authDomain: "adding-poduct.firebaseapp.com", messagingSenderId: "890097519125", measurementId: "G-G0H6FETCE8" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
