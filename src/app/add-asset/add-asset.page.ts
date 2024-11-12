import { Component } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Asset } from '../models/asset.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.page.html',
  styleUrls: ['./add-asset.page.scss'],
})
export class AddAssetPage {
  asset: Asset = {
    id: Date.now(),
    name: '',
    description: '',
    value: 0,
    location: ''
  };

  constructor(private inventoryService: InventoryService, private navCtrl: NavController) { }

  saveAsset() {
    this.inventoryService.saveAsset(this.asset);
    this.navCtrl.navigateBack('/home');  // Redirige a la página de inicio
  }
}
