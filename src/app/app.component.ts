import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  // Función de cerrar sesión
  logout() {
    localStorage.removeItem('registeredEmail');
    localStorage.removeItem('registeredPassword');
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }
}
