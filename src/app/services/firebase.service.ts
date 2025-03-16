import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    const messaging = getMessaging(app);

    // Verificar si el service worker se registra correctamente
    /*if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/assets/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registrado', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });
    }

    // Obtener el token para la mensajería
    this.getToken(messaging);*/
  }

  private async getToken(messaging: Messaging) {
    try {
      const token = await getToken(messaging, { vapidKey: 'your-vapid-key' });
      console.log('Token de FCM:', token);
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  }
}
