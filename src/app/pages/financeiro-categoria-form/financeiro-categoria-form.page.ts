import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-financeiro-categoria-form',
  templateUrl: './financeiro-categoria-form.page.html',
  styleUrls: ['./financeiro-categoria-form.page.scss'],
  standalone: false
})
export class FinanceiroCategoriaFormPage {

  nome = '';
  eventoId?: number;

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService,
    private router: Router
  ) {
    this.eventosService.getEventoAtivo()
      .subscribe(e => this.eventoId = e.id);
  }

  salvar() {
    if (!this.eventoId) return;

    this.financeiroService.criarCategoria({
      eventoId: this.eventoId,
      nome: this.nome
    }).subscribe(() => {
      this.router.navigateByUrl('/financeiro');
    });
  }
}
``