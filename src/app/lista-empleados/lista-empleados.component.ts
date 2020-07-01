import {Component, OnInit} from '@angular/core';
import {EmpleadosService} from "../servicios/empleados.service";
import {EmpleadoResponse} from "../interfaces/empleado-response";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map, startWith} from "rxjs/operators";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormularioModal} from "../formulario-modal/formulario-modal.component";
import {ConfirmacionModal} from "../confirmacion-modal/confirmacion-modal.component";
import {AlertaModal} from "../alerta-modal/alerta-modal.component";
import {interval} from "rxjs";

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.scss']
})
export class ListaEmpleadosComponent implements OnInit {

  listaEmpleados: EmpleadoResponse[];
  formulario: FormGroup;
  campoBuscar = new FormControl('');
  procesando = false;
  mensajeExito = '';

  constructor(
    private empleadosService: EmpleadosService,
    private modalService: NgbModal,
  ) {
    this.formulario = new FormGroup({
      campoBuscar: this.campoBuscar
    })
  }

  ngOnInit(): void {
    this.consultar();

    this.campoBuscar.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      map(texto => this.buscar(texto))
    ).subscribe();
  }

  consultar(): void {
    this.procesando = true;
    this.empleadosService.getAll().subscribe({
      next: empleados => {
        console.log(empleados);
        this.listaEmpleados = empleados;
        this.procesando = false;
      },
      error: err => {
        this.listaEmpleados = [];
        console.log("Error consultando todos los empleados");
        console.log(err);
        this.procesando = false;
        const modalRef: NgbModalRef = this.modalService.open(AlertaModal);
        modalRef.componentInstance.titulo = "Error";
        modalRef.componentInstance.mensaje = "Error consultando todos los empleados";
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
    modalRef.result.then(result => {
      console.log(result);
      this.consultar();
      this.mensajeExito = 'Operación exitosa';
      interval(10000).subscribe(() => this.mensajeExito = '');
    }, reason => {
        console.log("Descartado", reason);
    });
  }

  buscar(query: string): void {
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
        console.log("Error buscando empleados");
        console.log(err);
        this.procesando = false;
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
          console.log("Error eliminando el registro");
          console.log(err);
          this.procesando = false;
        }
      })
    }, () => {
      console.log("Descartado");
    });
  }

}
