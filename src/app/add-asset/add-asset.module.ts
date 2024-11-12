import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAssetPageRoutingModule } from './add-asset-routing.module';

import { AddAssetPage } from './add-asset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAssetPageRoutingModule
  ],
  declarations: [AddAssetPage]
})
export class AddAssetPageModule {}
