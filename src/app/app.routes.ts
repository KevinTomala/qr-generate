import { Routes } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
export const routes: Routes = [
     // Redirige la ruta raíz a 'features'
  { path: '', redirectTo: '/features', pathMatch: 'full' },
  { path: 'features', component: FeaturesComponent }


];
