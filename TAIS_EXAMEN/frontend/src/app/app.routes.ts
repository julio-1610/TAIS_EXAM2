import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductViewComponent } from './components/product-view/product-view.component';

export const APP_ROUTES: Routes = [
  { path: 'product-view', component: ProductViewComponent },
  { path: 'product-list', component: ProductListComponent }, // Ruta para ver la lista de productos
  { path: '', redirectTo: '/product-list', pathMatch: 'full' }, // Ruta por defecto (opcional)
  { path: '**', redirectTo: '/product-list' }, // Ruta de fallback (opcional)
];
