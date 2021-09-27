import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidComponent } from './pages/covid/covid.component';
import { HomeComponent } from './pages/home/home.component';
import { VaccineComponent } from './pages/vaccine/vaccine.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'country:/covid', component: CovidComponent},
  {path: 'country:/vaccine', component: VaccineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
