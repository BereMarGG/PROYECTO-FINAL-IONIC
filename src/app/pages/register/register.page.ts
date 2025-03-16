import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  async register() {
    this.errorMessage = '';

    if (!this.name.trim()) {
      this.errorMessage = 'El nombre es obligatorio.';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Ingrese un correo válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.name);
      console.log('Registro exitoso');
      // Aquí puedes redirigir al login o dashboard, por ejemplo:
      //this.Router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = 'Error en el registro. Intente de nuevo.';
      console.error(error);
    }
  }
}