import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private firebaseService: FirebaseService) {}

  // Función de cerrar sesión
  logout() {
    localStorage.removeItem('registeredEmail');
    localStorage.removeItem('registeredPassword');
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }
  
}
