import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TablaFieldComponent } from './tabla-field/tabla-field.component';
import { WorkersComponent } from './workers/workers.component';

const routes: Routes = [
  //{ path: 'formularioEspecialista', component: TablaFieldComponent },
  { path: 'formularioAsignacion', component: TablaFieldComponent },
  { path: '', component: WorkersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
