import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "ramadan-3fa9a", 
      appId: "1:696987567063:web:0a0fcd647fd9b92675c192",
       storageBucket: "ramadan-3fa9a.firebasestorage.app", 
       apiKey: "AIzaSyC7xlAdqsW8dkh_Ied1y1rWNsnfy1BHX90",
        authDomain: "ramadan-3fa9a.firebaseapp.com", 
        messagingSenderId: "696987567063",
         measurementId: "G-QSP68VSZ3J",
          })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
