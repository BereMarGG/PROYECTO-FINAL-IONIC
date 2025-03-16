import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';  // Para notificaciones push
import { LocalNotifications } from '@capacitor/local-notifications';  // Para notificaciones locales

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user: User = userCredential.user;

      // Actualizar el perfil del usuario
      await updateProfile(user, { displayName: name });

      // Enviar correo de verificación
      await sendEmailVerification(user);

      // Enviar notificación push local
      this.showNotification('Registro exitoso', 'Verifica tu correo antes de iniciar sesión.');

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar', error);
      this.showNotification('Error', 'Hubo un error al registrar tu cuenta.');
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user: User = userCredential.user;
      if (user.emailVerified) {
        this.router.navigate(['/home']);
      } else {
        this.showNotification('Correo no verificado', 'Verifica tu correo antes de iniciar sesión.');
      }
    } catch (error) {
      this.showNotification('Error de autenticación', 'Credenciales incorrectas.');
    }
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      this.router.navigate(['/home']);
    } catch (error) {
      this.showNotification('Error en Google Sign-In', 'Hubo un error al intentar iniciar sesión con Google.');
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
    this.showNotification('Sesión cerrada', 'Has cerrado sesión exitosamente.');
  }

  // Función para mostrar notificaciones push locales
  async showNotification(title: string, body: string) {
    try {
      // Solicitar permiso para recibir notificaciones locales
      await LocalNotifications.requestPermissions();

      // Programar la notificación local
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: new Date().getTime(),
            schedule: { at: new Date(Date.now() + 1000 * 5) },  // Programada para 5 segundos después
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: null
          }
        ]
      });

    } catch (error) {
      console.error('Error al mostrar la notificación', error);
    }
  }
}
