import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-alerta-modal',
  templateUrl: './alerta-modal.component.html',
  styleUrls: ['./alerta-modal.component.scss']
})
export class AlertaModal implements OnInit {

  @Input() titulo: string;
  @Input() mensaje: string;
  movil: boolean;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.movil = window.innerWidth <= 768;
  }

}
