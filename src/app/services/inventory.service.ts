import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor() { }

  // Obtener todos los activos del inventario
  getAssets(): any[] {
    const assets = localStorage.getItem('assets');
    return assets ? JSON.parse(assets) : [];
  }

  // Guardar un nuevo activo en el inventario
  saveAsset(asset: any): void {
    const assets = this.getAssets();
    assets.push(asset);
    localStorage.setItem('assets', JSON.stringify(assets));
  }

  // Obtener un activo específico por ID
  getAssetById(id: number): any {
    const assets = this.getAssets();
    return assets.find(asset => asset.id === id);
  }

  // Actualizar un activo
  updateAsset(updatedAsset: any): void {
    const assets = this.getAssets();
    const assetIndex = assets.findIndex(asset => asset.id === updatedAsset.id);
    if (assetIndex !== -1) {
      assets[assetIndex] = updatedAsset;
      localStorage.setItem('assets', JSON.stringify(assets));
    }
  }

  // Eliminar un activo
  deleteAsset(id: number): void {
    const assets = this.getAssets();
    const filteredAssets = assets.filter(asset => asset.id !== id);
    localStorage.setItem('assets', JSON.stringify(filteredAssets));
  }
}
