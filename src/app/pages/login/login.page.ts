import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';  // Limpiar cualquier mensaje de error previo
    this.isLoading = true;   // Activar el estado de carga

    this.authService.login(this.email, this.password)
      .then(() => {
        this.isLoading = false; // Desactivar el estado de carga
        this.router.navigate(['/home-page']); // Redirigir a la página de inicio
      })
      .catch((error) => {
        this.isLoading = false; // Desactivar el estado de carga
        this.errorMessage = error.message; // Mostrar el mensaje de error
      });
  }

  googleLogin() {
    this.errorMessage = '';  // Limpiar cualquier mensaje de error previo
    this.isLoading = true;   // Activar el estado de carga

    this.authService.googleSignIn()
      .then(() => {
        this.isLoading = false; // Desactivar el estado de carga
        this.router.navigate(['/home-page']); // Redirigir a la página de inicio
      })
      .catch((error) => {
        this.isLoading = false; // Desactivar el estado de carga
        this.errorMessage = error.message; // Mostrar el mensaje de error
      });
  }

  // Redirigir al formulario de registro
  goToRegister() {
    this.router.navigate(['/register']); // Asegúrate de tener una página de registro configurada
  }
}
