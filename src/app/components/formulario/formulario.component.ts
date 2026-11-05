
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Importa a interface que define a estrutura dos apartamentos.
import { Apartamento } from '../../models/apartamento.model';

@Component({
  selector: 'app-formulario',

  // Dependências utilizadas pelo HTML do formulário.
  imports: [],

  // Arquivos responsáveis pela interface e pelos estilos.
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class Formulario {

  // INPUT: RECEBE DADOS DO PAI.
  // O App envia sua lista de apartamentos para o formulário.
  // Exemplo no HTML do pai:
  // <app-formulario [apartamentos]="apartamentos">
  @Input() apartamentos: Apartamento[] = [];


  // OUTPUT: ENVIA EVENTOS PARA O PAI.
  // Declara um evento chamado novaLeitura.
  // EventEmitter permite enviar um objeto por meio do emit().
  @Output() novaLeitura = new EventEmitter<{
    apartamentoId: number;
    tipoMedidor: 'AGUA' | 'GAS';
    leituraAtual: number;
  }>();


  // ==========================================================
  // PROPRIEDADES QUE ARMAZENAM AS ESCOLHAS DO USUÁRIO
  // ==========================================================

  // Guarda o ID do apartamento selecionado.
  // Começa com 0 porque nenhum apartamento foi escolhido.
  apartamentoSelecionadoId: number = 0;

  // Guarda o tipo de medidor selecionado.
  // Inicialmente, o valor será AGUA.
  tipoMedidor: 'AGUA' | 'GAS' = 'AGUA';

  // Guarda a leitura digitada pelo usuário.
  // null significa que o campo ainda está vazio.
  leituraAtual: number | null = null;


  // ==========================================================
  // 1. SELECIONAR O APARTAMENTO
  // ==========================================================

  // Executado pelo evento (change) do select de apartamentos.
  selecionarApartamento(evento: Event): void {

    // Identifica o select HTML que disparou o evento.
    const select = evento.target as HTMLSelectElement;

    // Converte o valor selecionado em número.
    // Guarda o ID na propriedade do formulário.
    this.apartamentoSelecionadoId = Number(select.value);

    // Mostra o ID escolhido no console.
    console.log(
      'Apartamento selecionado',
      this.apartamentoSelecionadoId
    );
  }


  // ==========================================================
  // 2. SELECIONAR O TIPO DE MEDIDOR
  // ==========================================================

  // Executado quando o usuário seleciona água ou gás.
  selecionarTipoMedidor(evento: Event): void {

    // Recupera o elemento select que disparou o evento.
    const select = evento.target as HTMLSelectElement;

    // Atualiza a propriedade tipoMedidor.
    // Os valores esperados são AGUA ou GAS.
    this.tipoMedidor = select.value as 'AGUA' | 'GAS';

    console.log('Tipo selecionado:', this.tipoMedidor);
  }


  // ==========================================================
  // 3. OBTER A LEITURA ANTERIOR
  // ==========================================================

  // Procura o apartamento selecionado e retorna sua leitura
  // anterior de água ou gás.
  // Pode retornar um número ou null.
  obterLeituraAnterior(): number | null {

    // Procura no array recebido por @Input() o apartamento
    // que possui o ID selecionado pelo usuário.
    const apartamento = this.apartamentos.find(
      apartamento => apartamento.id === this.apartamentoSelecionadoId
    );

    // Se o apartamento não foi encontrado,
    // retorna null e encerra o método.
    if (!apartamento) {
      return null;
    }

    // Se o medidor selecionado for AGUA,
    // retorna a leitura anterior de água.
    if (this.tipoMedidor === 'AGUA') {
      return apartamento.leituraAnteriorAgua;
    }

    // Caso contrário, retorna a leitura anterior de gás.
    return apartamento.leituraAnteriorGas;
  }


  // ==========================================================
  // 4. CAPTURAR A LEITURA DIGITADA
  // ==========================================================

  // Executado pelo evento (input) do campo de leitura.
  alterarLeitura(evento: Event): void {

    // Identifica o input HTML que disparou o evento.
    const input = evento.target as HTMLInputElement;

    // Se o campo estiver vazio, guarda null.
    if (input.value === '') {
      this.leituraAtual = null;
      return;
    }

    // Converte o valor digitado em número.
    // Atualiza a propriedade leituraAtual.
    this.leituraAtual = Number(input.value);
  }


  // ==========================================================
  // 5. VALIDAR A LEITURA
  // ==========================================================

  // Retorna true quando a leitura é válida.
  // Retorna false quando existe algum problema.
  leituraValida(): boolean {

    // Reutiliza o método que procura a leitura anterior.
    const leituraAnterior = this.obterLeituraAnterior();

    // Se não houver leitura anterior ou atual,
    // a leitura não poderá ser salva.
    if (leituraAnterior === null || this.leituraAtual === null) {
      return false;
    }

    // Verifica se o valor é um número finito e não negativo.
    if (!Number.isFinite(this.leituraAtual) || this.leituraAtual < 0) {
      return false;
    }

    // Impede salvar uma leitura menor que a anterior.
    if (this.leituraAtual < leituraAnterior) {
      return false;
    }

    // Se passou por todas as verificações, a leitura é válida.
    return true;
  }


  // ==========================================================
  // 6. SALVAR E ENVIAR A LEITURA AO COMPONENTE PAI
  // ==========================================================

  // Executado pelo (click) do botão Salvar leitura.
  salvarLeitura(): void {

    // Antes de enviar, verifica novamente se os dados são válidos.
    // Se forem inválidos, encerra o método.
    if (!this.leituraValida() || this.leituraAtual === null) {
      return;
    }

    // Cria um objeto com as informações escolhidas.
    // Esses dados serão enviados ao componente pai.
    const dadosLeitura = {
      apartamentoId: this.apartamentoSelecionadoId,
      tipoMedidor: this.tipoMedidor,
      leituraAtual: this.leituraAtual
    };

    // Mostra no console os dados preparados.
    console.log('Dados preparados', dadosLeitura);

    // OUTPUT: DISPARA O EVENTO PARA O PAI.
    // Envia o objeto dadosLeitura pelo EventEmitter.
    // O App poderá receber esse objeto usando $event.
    this.novaLeitura.emit(dadosLeitura);
  }
}
