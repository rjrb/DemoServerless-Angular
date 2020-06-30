import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListaEmpleadosComponent} from "./lista-empleados/lista-empleados.component";

const routes: Routes = [
  { path: 'empleados', component: ListaEmpleadosComponent },
  { path: '', redirectTo: '/empleados', pathMatch: 'full' },
  { path: '**', component: ListaEmpleadosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
