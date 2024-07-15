import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MyCardsComponent } from './components/my-cards/my-cards.component';
import { SimulatorComponent } from './components/simulator/simulator.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'my-cards', component: MyCardsComponent },
  { path: 'simulator', component: SimulatorComponent },
];
