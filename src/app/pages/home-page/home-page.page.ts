import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
declare var navigator: any;
import { Share } from '@capacitor/share';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';

// Definición de interfaces para tipar los parámetros
interface Acceleration {
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit, OnDestroy {
  videos: any[] = [];
  activos: any[] = [];
  isModalOpen = false;
  currentActivo: any = {};
  editing = false;
  capturedImage: string | undefined;
  recordedVideo: string | undefined;

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

  shakeThreshold: number = 15; // Sensibilidad al agitar
  lastX: number = 0;
  lastY: number = 0;
  lastZ: number = 0;

  watchId: any;

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    public sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private mediaCapture: MediaCapture
  ) {
    this.loadActivos();
    this.getLocation();
    this.getVideosFromYouTube('inventario');
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

  ngOnInit() {
    this.startShakeDetection();
  }

  ngOnDestroy() {
    this.stopShakeDetection();
  }

  startShakeDetection() {
    if (navigator.accelerometer) {
      this.watchId = navigator.accelerometer.watchAcceleration(
        (acceleration: Acceleration) => {
          this.detectShake(acceleration);
        },
        (error: any) => {
          console.error('Error al acceder al acelerómetro:', error);
        },
        { frequency: 200 } // Intervalo de detección en milisegundos
      );
    } else {
      console.error('El acelerómetro no está disponible.');
    }
  }

  stopShakeDetection() {
    if (this.watchId) {
      navigator.accelerometer.clearWatch(this.watchId);
    }
  }

  detectShake(acceleration: Acceleration) {
    const deltaX = Math.abs(acceleration.x - this.lastX);
    const deltaY = Math.abs(acceleration.y - this.lastY);
    const deltaZ = Math.abs(acceleration.z - this.lastZ);

    if (
      deltaX > this.shakeThreshold ||
      deltaY > this.shakeThreshold ||
      deltaZ > this.shakeThreshold
    ) {
      this.ngZone.run(() => {
        this.openAddActivoModal(); // Llamar al método para abrir el modal
      });
    }

    this.lastX = acceleration.x;
    this.lastY = acceleration.y;
    this.lastZ = acceleration.z;
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
        source: CameraSource.Camera // Usar siempre la cámara
      });
  
      this.currentActivo.foto = image.dataUrl; 
    } catch (error) {
      console.error('Error al tomar la foto:', error);
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

  getVideosFromYouTube(query: string) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${this.youtubeApiKey}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        console.log('YouTube API Response:', data);
        if (data.items && data.items.length > 0) {
          this.videos = data.items; // Guarda todos los videos en el array
        } else {
          console.error('No se encontraron resultados para la consulta.');
        }
      },
      (error) => {
        console.error('Error al llamar a la API de YouTube:', error);
      }
    );
  }
  
  async recordVideo() {
    const options: CaptureVideoOptions = { limit: 1, duration: 30 }; // Limitar a 1 video de 30 segundos
  
    try {
      const mediaFiles = await this.mediaCapture.captureVideo(options);
  
      if (Array.isArray(mediaFiles)) {
        this.recordedVideo = mediaFiles[0].fullPath; // Ruta completa del video grabado
        console.log('Video grabado:', this.recordedVideo);
      } else {
        console.error('Resultado inesperado:', mediaFiles);
      }
    } catch (error) {
      console.error('Error al grabar video:', error);
    }
  }

  async shareVideo() {
    if (!this.recordedVideo) {
      console.error('No hay video para compartir.');
      return;
    }
  
    try {
      await Share.share({
        title: 'Compartir Video',
        text: 'Mira este video grabado con mi aplicación.',
        url: this.recordedVideo, // Ruta al archivo de video
        dialogTitle: 'Compartir con...',
      });
      console.log('Video compartido con éxito');
    } catch (error) {
      console.error('Error al compartir video:', error);
    }
  }
  
  
}  
