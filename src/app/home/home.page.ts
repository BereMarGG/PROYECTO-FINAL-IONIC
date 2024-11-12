import { Component } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { NavController } from '@ionic/angular';
import { Asset } from '../models/asset.model'; // Importar Asset

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  assets: Asset[] = []; // Declarar el tipo de datos como Asset[]

  constructor(private inventoryService: InventoryService, private navCtrl: NavController) {}

  ionViewWillEnter() {
    this.assets = this.inventoryService.getAssets();
  }

  goToDetails(id: number) {
    this.navCtrl.navigateForward(`/asset-details/${id}`);
  }
}
