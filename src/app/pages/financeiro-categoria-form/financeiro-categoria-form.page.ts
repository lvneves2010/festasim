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
  carregando = false;

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.carregarEvento();
  }

  carregarEvento() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: e => {
        this.eventoId = e.id;
        this.carregando = false;
      },
      error: err => {
        console.error('Erro ao carregar evento para categoria financeira', err);
        this.carregando = false;
      }
    });
  }

  salvar() {
    if (!this.eventoId || this.carregando) return;

    this.carregando = true;

    this.financeiroService.criarCategoria({
      eventoId: this.eventoId,
      nome: this.nome
    }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigateByUrl('/financeiro');
      },
      error: err => {
        console.error('Erro ao criar categoria financeira', err);
        this.carregando = false;
      }
    });
  }
}
``