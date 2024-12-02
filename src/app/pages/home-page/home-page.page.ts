import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from 'src/environments/environment'; 

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage {
  activos: any[] = [];
  isModalOpen = false;
  currentActivo: any = {};
  editing = false;
  capturedImage: string | undefined;

  latitude: number = 0;
  longitude: number = 0;

 // Configuración para mostrar el mapa
 center: google.maps.LatLngLiteral = {
  lat: this.latitude,
  lng: this.longitude
};

zoom = 15;
googleMapsApiKey = environment.googleMapsApiKey; 

constructor(private geolocation: Geolocation) {
  this.loadActivos();
  this.getLocation(); // Llamar a la función para obtener la ubicación cuando se carga la página
}

  loadActivos() {
    const storedActivos = localStorage.getItem('activos');
    this.activos = storedActivos ? JSON.parse(storedActivos) : [];
  }

  saveActivos() {
    localStorage.setItem('activos', JSON.stringify(this.activos));
  }

  openAddActivoModal() {
    this.resetCurrentActivo();
    this.isModalOpen = true;
  }

  resetCurrentActivo() {
    this.currentActivo = {
      marca: '',
      modelo: '',
      ubicacion: '', // Aquí se guardará la ubicación como cadena
      codigoBarras: '',
      foto: '',  // Agregar un campo para la foto
    };
    this.editing = false;
  }

  openEditActivoModal(activo: any) {
    this.currentActivo = { ...activo };
    this.isModalOpen = true;
    this.editing = true;
  }

  saveActivo(form: NgForm) {
    if (!form.valid) return;
    if (this.editing) {
      const index = this.activos.findIndex(a => a.codigoBarras === this.currentActivo.codigoBarras);
      if (index !== -1) {
        this.activos[index] = { ...this.currentActivo };
      }
    } else {
      this.activos.push({ ...this.currentActivo });
    }

    this.saveActivos();
    this.closeModal();
  }

  deleteActivo(activo: any) {
    this.activos = this.activos.filter(a => a.codigoBarras !== activo.codigoBarras);
    this.saveActivos();
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetCurrentActivo();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Alternativa: CameraSource.Prompt para elegir entre cámara y galería
      });
      this.currentActivo.foto = image.dataUrl; // Guardar la imagen en currentActivo.foto
    } catch (error) {
      console.error('Error al capturar imagen:', error);
    }
  }

  // Obtener la ubicación del dispositivo y asignarla al activo
  // async getLocation() {
  //   try {
  //     const resp = await this.geolocation.getCurrentPosition();
  //     this.latitude = resp.coords.latitude;
  //     this.longitude = resp.coords.longitude;
  //     this.currentActivo.ubicacion = `Lat: ${this.latitude}, Lon: ${this.longitude}`; // Guardar la ubicación
  //   } catch (error) {
  //     console.error('Error obteniendo la ubicación:', error);
  //   }
  // }
  async getLocation() {
    try {
      const options = {
        enableHighAccuracy: true, // Alta precisión
        timeout: 10000,           // Tiempo máximo en ms para esperar la ubicación
        maximumAge: 0             // No usar ubicaciones en caché
      };
      const resp = await this.geolocation.getCurrentPosition(options);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.center = {
        lat: this.latitude,
        lng: this.longitude
      }; // Actualizar el mapa
      this.currentActivo.ubicacion = `Lat: ${this.latitude}, Lon: ${this.longitude}`;
    } catch (error) {
      console.error('Error obteniendo la ubicación precisa:', error);
    }
  }
  
}
