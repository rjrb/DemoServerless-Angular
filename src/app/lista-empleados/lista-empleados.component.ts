import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmpleadosService} from "../servicios/empleados.service";
import {EmpleadoResponse} from "../interfaces/empleado-response";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, first, startWith, switchMap, take} from "rxjs/operators";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormularioModal} from "../formulario-modal/formulario-modal.component";
import {ConfirmacionModal} from "../confirmacion-modal/confirmacion-modal.component";
import {AlertaModal} from "../alerta-modal/alerta-modal.component";
import {HttpErrorResponse} from "@angular/common/http";
import {interval, of, Subscription} from "rxjs";

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.scss']
})
export class ListaEmpleadosComponent implements OnInit, OnDestroy {

  listaEmpleados: EmpleadoResponse[];
  formulario: FormGroup;
  campoBuscar = new FormControl('');
  procesando = false;
  mensajeExito = '';
  mensajeError = '';
  cierreMensajes$: Subscription;

  constructor(
    private empleadosService: EmpleadosService,
    private modalService: NgbModal,
  ) {
    this.formulario = new FormGroup({
      campoBuscar: this.campoBuscar
    })
  }

  ngOnInit(): void {
    this.campoBuscar.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(texto => of(this.buscar(texto)))
    ).subscribe();
  }

  consultar(): void {
    this.cierreMensajes$?.unsubscribe();
    this.mensajeError = this.mensajeExito = '';

    this.procesando = true;
    this.empleadosService.getAll().subscribe({
      next: empleados => {
        console.log(empleados);
        this.listaEmpleados = empleados;
        this.procesando = false;
      },
      error: err => {
        this.listaEmpleados = [];
        this.procesando = false;
        if(err instanceof HttpErrorResponse) {
          let httpError: HttpErrorResponse = err as HttpErrorResponse;
          if(httpError.status == 404) {
            this.mensajeError = 'No hay empleados registrados';
            this.cierreMensajes$ = interval(5000).pipe(take(1)).subscribe(() => this.mensajeError = '');
            return;
          }
        }
        this.mostrarError("Error consultando todos los empleados", err);
      }
    })
  }

  nuevo(): void {
    const modalRef: NgbModalRef = this.modalService.open(FormularioModal, { size: 'lg', centered: true });
    this.persistencia(modalRef);
  }

  editar(empleado: EmpleadoResponse): void {
    const modalRef: NgbModalRef = this.modalService.open(FormularioModal, { size: 'lg', centered: true });
    modalRef.componentInstance.empleado = empleado;
    this.persistencia(modalRef);
  }

  persistencia(modalRef: NgbModalRef): void {
    this.cierreMensajes$?.unsubscribe();
    this.mensajeError = this.mensajeExito = '';

    modalRef.result.then(result => {
      console.log(result);
      this.consultar();
      this.mensajeExito = 'Operación exitosa';
      this.cierreMensajes$ = interval(10000).pipe(first()).subscribe(() => this.mensajeExito = '');
    }, reason => {
        console.log("Descartado", reason);
    });
  }

  buscar(query: string): void {
    this.cierreMensajes$?.unsubscribe();
    this.mensajeError = this.mensajeExito = '';

    if(!query) {
      this.consultar();
      return;
    }

    let filtro = query.split(" ").join("+");

    this.procesando = true;
    this.empleadosService.search(filtro).subscribe({
      next: filtrado => {
        console.log(filtrado);
        this.listaEmpleados = filtrado;
        this.procesando = false;
      },
      error: err => {
        this.listaEmpleados = [];
        this.procesando = false;
        if(err instanceof HttpErrorResponse) {
          let httpError: HttpErrorResponse = err as HttpErrorResponse;
          if(httpError.status == 404) {
            this.mensajeError = `No se hallaron empleados para el filtro '${filtro}'`;
            this.cierreMensajes$ = interval(5000).pipe(first()).subscribe(() => this.mensajeError = '');
            return;
          }
        }
        this.mostrarError("Error buscando empleados", err);
      }
    });
  }

  borrar(codigo: string): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmacionModal);
    modalRef.componentInstance.accion = "eliminar";
    modalRef.result.then(() => {
      this.procesando = true;
      this.empleadosService.delete(codigo).subscribe({
        next: () => {
          console.log(`Registro ${codigo} eliminado con éxito`);
          this.consultar();
          this.procesando = false;
        },
        error: err => {
          this.procesando = false;
          this.mostrarError("Error eliminando el registro", err);
        }
      })
    }, () => {
      console.log("Descartado");
    });
  }

  mostrarError(mensaje: string, err: any): void {
    console.log(mensaje);
    console.log(err);
    const modalRef: NgbModalRef = this.modalService.open(AlertaModal);
    modalRef.componentInstance.titulo = "Error";
    modalRef.componentInstance.mensaje = mensaje;
  }

  ngOnDestroy(): void {
    this.cierreMensajes$?.unsubscribe();
  }

}
