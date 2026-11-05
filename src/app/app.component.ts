
import { Component } from '@angular/core';

// Interface que define a estrutura dos apartamentos.
import { Apartamento } from './models/apartamento.model';

// Importa os componentes filhos que serão usados no HTML do pai.
import { Formulario } from './components/formulario/formulario.component';
import { Lista } from './components/lista/lista.component';

@Component({
  selector: 'app-root',

  // Permite utilizar <app-formulario> e <app-lista> no HTML.
  imports: [Formulario, Lista],

  // Define o HTML e o CSS deste componente.
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {

  // Título que será exibido no HTML usando {{ titulo }}.
  titulo = 'Sistema de Medição de Água e Gás';

  apartamentos: Apartamento[] = [
    {
      id: 1,
      numero: '101',
      leituraAnteriorAgua: 120,
      leituraAnteriorGas: 80
    },
    {
      id: 2,
      numero: '102',
      leituraAnteriorAgua: 200,
      leituraAnteriorGas: 110
    },
    {
      id: 3,
      numero: '103',
      leituraAnteriorAgua: 150,
      leituraAnteriorGas: 90
    }
  ];

  // Guarda o resultado do último consumo calculado.
  // Começa com null porque ainda não existe nenhuma leitura salva.
  // Esse resultado será enviado ao componente Lista por @Input().
  resultadoConsumo: {
    apartamento: string;
    tipoMedidor: 'AGUA' | 'GAS';
    leituraAnterior: number;
    leituraAtual: number;
    consumo: number;
    valorTotal: number;
  } | null = null;


  // MÉTODO PRINCIPAL DO COMPONENTE PAI.
  // É executado quando o formulário emite o evento novaLeitura.
  // O parâmetro "dados" recebe o objeto enviado pelo @Output().
  receberLeitura(dados: {
    apartamentoId: number;
    tipoMedidor: 'AGUA' | 'GAS';
    leituraAtual: number;
  }): void {

    // Confirma no console os dados recebidos do formulário.
    console.log('O componente pai recebeu:', dados);

    // Procura no array o apartamento com o ID recebido.
    // find() retorna o primeiro apartamento correspondente.
    const apartamento = this.apartamentos.find(
      apto => apto.id === dados.apartamentoId
    );

    // Se o apartamento não existir, encerra o método.
    if (!apartamento) {
      console.log('Apartamento não encontrado');
      return;
    }

    // Verifica qual medidor foi selecionado.
    // Se for AGUA, pega a leitura anterior de água.
    // Caso contrário, pega a leitura anterior de gás.
    const leituraAnterior = dados.tipoMedidor === 'AGUA'
      ? apartamento.leituraAnteriorAgua
      : apartamento.leituraAnteriorGas;

    // Impede cálculos com números inválidos.
    // Também rejeita leituras menores que a anterior.
    if (!Number.isFinite(dados.leituraAtual) ||
        dados.leituraAtual < leituraAnterior) {
      console.log('Leitura inválida');
      return;
    }

    
    const consumo = dados.leituraAtual - leituraAnterior;    
    const tarifa = 7.50;  
    const valorTotal = consumo * tarifa;

    // Atualiza o estado do componente pai com o resultado.
    // O Angular poderá enviar esse novo objeto ao componente Lista.
    this.resultadoConsumo = {
      apartamento: apartamento.numero,
      tipoMedidor: dados.tipoMedidor,
      leituraAnterior: leituraAnterior,
      leituraAtual: dados.leituraAtual,
      consumo: consumo,
      valorTotal: valorTotal
    };

    // Exibe o resultado completo para conferência.
    console.log('Resultado calculado pelo pai:', this.resultadoConsumo);
  }
}
