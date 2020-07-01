import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmacion-modal',
  templateUrl: './confirmacion-modal.component.html',
  styleUrls: ['./confirmacion-modal.component.scss']
})
export class ConfirmacionModal implements OnInit {

  @Input() accion: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
