// home-page.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePagePageRoutingModule } from './home-page-routing.module';
import { HomePagePage } from './home-page.page';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePagePageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [HomePagePage], // Asegúrate de que está correctamente declarado aquí
})
export class HomePagePageModule {}
