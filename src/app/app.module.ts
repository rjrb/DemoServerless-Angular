import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ListaEmpleadosComponent} from './lista-empleados/lista-empleados.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {faEdit, faTrashAlt, faUserFriends, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import { FormularioModal } from './formulario-modal/formulario-modal.component';
import { AlertaModal } from './alerta-modal/alerta-modal.component';
import { ConfirmacionModal } from './confirmacion-modal/confirmacion-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaEmpleadosComponent,
    FormularioModal,
    AlertaModal,
    ConfirmacionModal
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(
      faUserFriends,
      faUserPlus,
      faEdit,
      faTrashAlt,
    );
  }
}
