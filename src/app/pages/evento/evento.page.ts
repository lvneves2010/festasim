import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventosService } from '../../services/eventos.service';
import { EventoGet } from '../../models/evento-get.model';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
  standalone: false
})
export class EventoPage implements OnInit {

  evento?: EventoGet;
  carregando = false;

  form = {
    nome: '',
    dataEvento: '',
    local: '',
    observacoes: ''
  };

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarEvento();
  }

  ionViewWillEnter() {
    this.carregarEvento();
  }

  private toDateOnly(value: string): string {
    if (!value) {
      return '';
    }

    return value.includes('T') ? value.split('T')[0] : value.substring(0, 10);
  }

  carregarEvento() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;
        this.form.nome = evento.nome;
        this.form.dataEvento = this.toDateOnly(evento.dataEvento);
        this.form.local = evento.local || '';
        this.form.observacoes = evento.observacoes || '';
        this.carregando = false;
      },
      error: () => {
        // Nenhum evento ativo → modo cadastro
        this.carregando = false;
      }
    });
  }

  salvar() {
    this.carregando = true;

    const payload = {
      nome: this.form.nome,
      dataEvento: this.toDateOnly(this.form.dataEvento),
      local: this.form.local,
      observacoes: this.form.observacoes,
      ativo: true
    };

    let requisicao$: Observable<any>;

    if (this.evento) {
      requisicao$ = this.eventosService.atualizarEvento(this.evento.id, payload);
    } else {
      requisicao$ = this.eventosService.criarEvento(payload);
    }

    requisicao$.subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigateByUrl('/');
      },
      error: err => {
        console.error('Erro ao salvar evento', err);
        this.carregando = false;
      }
    });
  }
}