import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventosService } from '../services/eventos.service';
import { ConvidadosService } from '../services/convidados.service';
import { TarefasService } from '../services/tarefas.service';
import { FinanceiroService } from '../services/financeiro.service';

import { EventoGet } from '../models/evento-get.model';
import { ConvidadoGet } from '../models/convidado-get.model';
import { TarefaGet, StatusTarefa } from '../models/tarefa-get.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  appVersion = environment.appVersion;
  evento?: EventoGet;

  convidados: ConvidadoGet[] = [];
  tarefas: TarefaGet[] = [];
  itensFinanceiros: any[] = [];

  carregando = false;

  constructor(
    private eventosService: EventosService,
    private convidadosService: ConvidadosService,
    private tarefasService: TarefasService,
    private financeiroService: FinanceiroService
  ) {}

  ionViewWillEnter() {
    this.carregarDashboard();
  }

  carregarDashboard() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;

        this.convidadosService
          .getConvidadosPorEvento(evento.id)
          .subscribe(c => this.convidados = c);

        this.tarefasService
          .getTarefasPorEvento(evento.id)
          .subscribe(t => this.tarefas = t);

        this.financeiroService
          .getItensPorEvento(evento.id)
          .subscribe(i => {
            this.itensFinanceiros = i;
            this.carregando = false;
          });
      },
      error: err => {
        console.error('Erro ao carregar dashboard', err);
        this.carregando = false;
      }
    });
  }

  // ====== CONVIDADOS ======
  get totalConvidados(): number {
    return this.convidados.length;
  }

  get totalConvidadosComAcompanhantes(): number {
    return this.convidados.reduce(
      (total, convidado) => total + 1 + (convidado.quantidadeAcompanhantes || 0),
      0
    );
  }

  get totalConfirmados(): number {
    return this.convidados.filter(c => c.confirmacaoPresenca === true).length;
  }

  get totalConfirmadosComAcompanhantes(): number {
    return this.convidados
      .filter(c => c.confirmacaoPresenca === true)
      .reduce((total, convidado) => total + 1 + (convidado.quantidadeAcompanhantes || 0), 0);
  }

  // ====== CRONOGRAMA ======
  get tarefasPendentes(): number {
    return this.tarefas.filter(t => t.status !== StatusTarefa.Concluida).length;
  }

  get tarefasConcluidas(): number {
    return this.tarefas.filter(t => t.status === StatusTarefa.Concluida).length;
  }

  // ====== FINANCEIRO ======
  get totalPrevisto(): number {
    return this.itensFinanceiros
      .reduce((total, item) => total + item.valorPrevisto, 0);
  }

  get totalPago(): number {
    return this.itensFinanceiros
      .filter(item => item.valorPago)
      .reduce((total, item) => total + item.valorPago, 0);
  }
}