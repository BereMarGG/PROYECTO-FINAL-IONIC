import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  // Método para registrar al usuario
  register() {
    if (this.validateEmail(this.email) && this.passwordsMatch()) {
      // Guardar los datos del usuario registrado en localStorage
      localStorage.setItem('registeredEmail', this.email);
      localStorage.setItem('registeredPassword', this.password);

      // Redirigir al login después del registro
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = 'Por favor, verifique los datos ingresados.';
    }
  }

  // Validar formato del email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Verificar si las contraseñas coinciden
  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
