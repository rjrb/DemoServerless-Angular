import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {EmpleadoResponse} from "../interfaces/empleado-response";
import {EmpleadosService} from "../servicios/empleados.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpleadoRequest} from "../interfaces/empleado-request";
import {Observable} from "rxjs";
import {ConfirmacionModal} from "../confirmacion-modal/confirmacion-modal.component";
import {AlertaModal} from "../alerta-modal/alerta-modal.component";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario-modal.component.html',
  styleUrls: ['./formulario-modal.component.scss']
})
export class FormularioModal implements OnInit {

  @Input() empleado: EmpleadoResponse;
  codigo: string;
  textoGuardar: string;
  formulario: FormGroup;
  procesando = false;

  constructor(
    public formularioModal: NgbActiveModal,
    private modalService: NgbModal,
    private empleadosService: EmpleadosService,
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      campoCedula: ['', Validators.required],
      campoNombre: ['', Validators.required],
      campoEdad: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      campoCiudad: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.procesando = true;

    this.textoGuardar = this.empleado ? "Modificar" : "Adicionar";

    if(this.empleado) {
      this.codigo = this.empleado.codigo;
      this.formulario.patchValue({
        campoCedula: this.empleado.cedula,
        campoNombre: this.empleado.nombre,
        campoEdad: this.empleado.edad,
        campoCiudad: this.empleado.ciudad
      })
    }

    this.procesando = false;
  }

  guardar() {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmacionModal);
    modalRef.componentInstance.accion = this.textoGuardar.toLowerCase();
    modalRef.result.then(result => {

      this.procesando = true;
      let request: EmpleadoRequest = {
        cedula: this.formulario.get("campoCedula").value,
        nombre: this.formulario.get("campoNombre").value,
        edad: this.formulario.get("campoEdad").value,
        ciudad: this.formulario.get("campoCiudad").value,
      };

      let persistencia$: Observable<EmpleadoResponse>;
      if(this.codigo) {
        persistencia$ = this.empleadosService.put(this.codigo, request);
      } else {
        persistencia$ = this.empleadosService.post(request);
      }
      persistencia$.subscribe({
        next: value => {
          console.log(value);
          this.empleado = value;
          this.procesando = false;
          this.formularioModal.close('OK click');
        },
        error: err => {
          console.log("Error registrando el empleado");
          console.log(err);
          this.procesando = false;
          const modalRef: NgbModalRef = this.modalService.open(AlertaModal);
          modalRef.componentInstance.titulo = "Error";
          modalRef.componentInstance.mensaje = `Error persistiendo el empleado: ${err.error.error || 'desconocido'}`;
        }
      });

    });
  }

}
