import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { CameraComponent } from '../components/home-page/home-page.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx'; // Importar Geolocation

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicStorageModule.forRoot(), IonicModule.forRoot(), AppRoutingModule],
  providers: [Geolocation,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
