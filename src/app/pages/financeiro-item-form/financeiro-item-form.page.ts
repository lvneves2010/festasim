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
  carregando = false;

  form: any = {
    categoriaFinanceiraId: null,
    descricao: '',
    valorPrevisto: 0
  };

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService,
    private router: Router
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
          .subscribe({
            next: c => {
              this.categorias = c;
              this.carregando = false;
            },
            error: err => {
              console.error('Erro ao carregar categorias financeiras', err);
              this.carregando = false;
            }
          });
      },
      error: err => {
        console.error('Erro ao carregar evento ativo', err);
        this.carregando = false;
      }
    });
  }

  salvar() {
    if (!this.eventoId || this.carregando) return;

    this.carregando = true;

    const payload = {
      eventoId: this.eventoId,
      categoriaFinanceiraId: Number(this.form.categoriaFinanceiraId),
      descricao: this.form.descricao,
      valorPrevisto: Number(this.form.valorPrevisto),
      valorPago: null
    };

    this.financeiroService.criarItem(payload).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigateByUrl('/financeiro');
      },
      error: err => {
        console.error('Erro ao criar item financeiro', err);
        this.carregando = false;
      }
    });
  }
}
``