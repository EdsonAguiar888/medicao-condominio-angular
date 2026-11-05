import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista',
  imports: [],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css',
})
export class Lista {



 @Input() resultado: {
    apartamento: string;
    tipoMedidor: 'AGUA' | 'GAS';
    leituraAnterior: number;
    leituraAtual: number;
    consumo: number;
    valorTotal: number;
  } | null = null;












}
