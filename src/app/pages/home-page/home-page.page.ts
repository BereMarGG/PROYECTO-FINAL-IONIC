import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


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
  videoId: string = ''; 

  center: google.maps.LatLngLiteral = {
    lat: this.latitude,
    lng: this.longitude,
  };

  zoom = 15;
  googleMapsApiKey = environment.googleMapsApiKey;
  youtubeApiKey = environment.youtubeApiKey; 
  
  constructor(private geolocation: Geolocation, private http: HttpClient, private sanitizer: DomSanitizer) {
    this.loadActivos();
    this.getLocation();
    this.getVideoFromYouTube('tutorial');
  }

  get safeVideoUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.videoId);
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
      ubicacion: '',
      codigoBarras: '',
      foto: '',
    };
    this.editing = false;
  }

  openEditActivoModal(activo: any) {
    this.currentActivo = { ...activo };
    this.isModalOpen = true;
    this.editing = true;
  }

  async saveActivo(form: NgForm) {
    if (!form.valid) return;

    if (this.editing) {
      const index = this.activos.findIndex(a => a.codigoBarras === this.currentActivo.codigoBarras);
      if (index !== -1) {
        this.activos[index] = { ...this.currentActivo };
      }
    } else {
      this.activos.push({ ...this.currentActivo });
      await this.sendLocalNotification(this.currentActivo);
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
        source: CameraSource.Camera,
      });
      this.currentActivo.foto = image.dataUrl;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
    }
  }

  async getLocation() {
    try {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };
      const resp = await this.geolocation.getCurrentPosition(options);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };
      this.currentActivo.ubicacion = `Lat: ${this.latitude}, Lon: ${this.longitude}`;
    } catch (error) {
      console.error('Error obteniendo la ubicación precisa:', error);
    }
  }

  async sendLocalNotification(activo: any) {
    try {
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title: 'Nuevo Activo Registrado',
            body: `Activo ${activo.marca} - ${activo.modelo} ha sido agregado.`,
            schedule: { at: new Date(new Date().getTime() + 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    } catch (error) {
      console.error('Error al enviar notificación local:', error);
    }
  }

  getVideoFromYouTube(query: string) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${this.youtubeApiKey}`;
    this.http.get<any>(url).subscribe((data) => {
      console.log(data);  // Verifica los datos recibidos
      if (data.items && data.items.length > 0) {
        const firstVideo = data.items[0];
        this.videoId = firstVideo.id.videoId;  // Asigna el ID del video
      }
    });
  }
  
}
