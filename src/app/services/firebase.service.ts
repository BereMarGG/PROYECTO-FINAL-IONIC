import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: 'AIzaSyBunyqAOWosRyfXfKHNpxFEdjlNhWi77lU',
    authDomain: 'app-notificaciones-9e7fe.firebaseapp.com',
    projectId: 'app-notificaciones-9e7fe',
    storageBucket: 'app-notificaciones-9e7fe.firebasestorage.app',
    messagingSenderId: '908584079158',
    appId: '1:908584079158:web:33d76634bea7c068296d97',
    measurementId: 'G-PRYCTGZG5B',
  };

  private app: any;
  private analytics: any;
  private messaging: any;

  constructor() {
    this.app = initializeApp(this.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.messaging = getMessaging(this.app);

    this.requestPermission();
    this.listenForMessages();
  }

  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BCbErmlbQZqdwMyDE5Jt9d3BJ7-K86S3EdgHO7RGAMJ9r4YnZ8tQFo5wmhhvT9ayzLPsEwsOMtYeuwYtEH6H1JU',
      });
      console.log('FCM Token:', token);
      // Aquí puedes enviar el token al backend o guardarlo localmente.
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido:', payload);
      // Aquí puedes manejar la notificación recibida.
    });
  }
}
