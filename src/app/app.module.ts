import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { CameraComponent } from '../components/home-page/home-page.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx'; // Importar Geolocation
import { GoogleMapsModule } from '@angular/google-maps';
import { HomePagePageModule } from './pages/home-page/home-page.module'; // Import the module
import { HttpClientModule } from '@angular/common/http'; 
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { FirebaseService } from './services/firebase.service';

@NgModule({
  declarations: [AppComponent],
  imports: [ GoogleMapsModule, HttpClientModule,  BrowserModule, IonicStorageModule.forRoot(), IonicModule.forRoot(),
     AppRoutingModule,  HomePagePageModule,
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
     provideAuth(() => getAuth()),
     provideFirestore(() => getFirestore())
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [Geolocation,MediaCapture,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
