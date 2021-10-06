import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidTabPanelComponent } from './components/covid-map/covid-tab-panel.component';
import { CovidTabViewComponent } from './pages/covid/covid-tab-view.component';
import { HomeComponent } from './pages/home/home.component';
import { VaccineComponent } from './pages/vaccine/vaccine.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: ':country/covid', component: CovidTabViewComponent, children: [
    {path: '', component: CovidTabPanelComponent},
    {path: 'tabular', component: CovidTabPanelComponent}
  ]},
  {path: ':country/vaccine', component: VaccineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
