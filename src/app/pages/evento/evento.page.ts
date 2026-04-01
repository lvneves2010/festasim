import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  carregarEvento() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;
        this.form.nome = evento.nome;
        this.form.dataEvento = evento.dataEvento.substring(0, 10);
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
      dataEvento: this.form.dataEvento,
      local: this.form.local,
      observacoes: this.form.observacoes,
      ativo: true
    };

    if (this.evento) {
      this.eventosService.atualizarEvento(this.evento.id, payload)
        .subscribe(() => this.router.navigateByUrl('/'));
    } else {
      this.eventosService.criarEvento(payload)
        .subscribe(() => this.router.navigateByUrl('/'));
    }
  }
}