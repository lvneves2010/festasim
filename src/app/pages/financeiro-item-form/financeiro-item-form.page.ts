import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-financeiro-item-form',
  templateUrl: './financeiro-item-form.page.html',
  styleUrls: ['./financeiro-item-form.page.scss'],
  standalone: false
})
export class FinanceiroItemFormPage {

  eventoId?: number;
  categorias: any[] = [];

  form: any = {
    categoriaFinanceiraId: null,
    descricao: '',
    valorPrevisto: 0
  };

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService,
    private router: Router
  ) {
    this.eventosService.getEventoAtivo().subscribe(evento => {
      this.eventoId = evento.id;

      this.financeiroService
        .getCategoriasPorEvento(evento.id)
        .subscribe(c => this.categorias = c);
    });
  }

  salvar() {
    if (!this.eventoId) return;

    this.financeiroService.criarItem({
      eventoId: this.eventoId,
      ...this.form
    }).subscribe(() => {
      this.router.navigateByUrl('/financeiro');
    });
  }
}
``