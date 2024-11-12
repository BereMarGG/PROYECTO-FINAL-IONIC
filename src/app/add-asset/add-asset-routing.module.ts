import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAssetPage } from './add-asset.page';

const routes: Routes = [
  {
    path: '',
    component: AddAssetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAssetPageRoutingModule {}
