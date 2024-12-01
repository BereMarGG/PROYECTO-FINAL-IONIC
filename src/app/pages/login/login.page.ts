import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Simulación de autenticación
  login() {
    // Obtener los datos almacenados en localStorage
    const storedEmail = localStorage.getItem('registeredEmail');
    const storedPassword = localStorage.getItem('registeredPassword');

    if (this.validateEmail(this.email) && this.password.length >= 6) {
      // Verificar si las credenciales coinciden con las almacenadas
      if (this.email === storedEmail && this.password === storedPassword) {
        // Redirigir a la página principal
        this.router.navigate(['/home-page']); 
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos.';
        this.clearErrorMessage();
      }
    } else {
      this.errorMessage = 'Por favor, ingrese un email válido y una contraseña de al menos 6 caracteres.';
      this.clearErrorMessage();
    }
  }

  // Función para validar el formato del email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para limpiar el mensaje de error después de 3 segundos
  clearErrorMessage() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000); // 3 segundos
  }
}
