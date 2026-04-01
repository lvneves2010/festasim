import { Component } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { EventosService } from '../../services/eventos.service';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
  standalone: false
})
export class FinanceiroPage {

  eventoId?: number;
  categorias: any[] = [];
  itens: any[] = [];
  carregando = false;

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService
  ) {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.eventoId = evento.id;

        this.financeiroService
          .getCategoriasPorEvento(evento.id)
          .subscribe(categorias => this.categorias = categorias);

        this.financeiroService
          .getItensPorEvento(evento.id)
          .subscribe(itens => {
            this.itens = itens;
            this.carregando = false;
          });
      },
      error: () => this.carregando = false
    });
  }

  deletarItem(id: number) {
    this.financeiroService.deletarItem(id).subscribe(() => {
      this.itens = this.itens.filter(i => i.id !== id);
    });
  }

  statusColor(item: any): string {
    return item.valorPago ? 'success' : 'medium';
  }

  
  statusTexto(item: any): string {
    return item.valorPago ? 'Pago' : 'Pendente';
  }

  
  abrirSelectorStatus(select: IonSelect) {
    select.open();
  }

  
  alterarStatus(item: any) {
    const payload = {
      eventoId: this.eventoId,
      categoriaFinanceiraId: item.categoriaFinanceiraId,
      descricao: item.descricao,
      valorPrevisto: item.valorPrevisto,
      valorPago: item.valorPago
    };

    this.financeiroService.atualizarItem(item.id, payload).subscribe({
      error: err =>
        console.error('Erro ao atualizar status financeiro', err)
    });
  }

}