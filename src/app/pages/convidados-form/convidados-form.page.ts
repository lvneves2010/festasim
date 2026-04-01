import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { ConvidadosService } from '../../services/convidados.service';
import { EventoGet } from '../../models/evento-get.model';

@Component({
  selector: 'app-convidados-form',
  templateUrl: './convidados-form.page.html',
  styleUrls: ['./convidados-form.page.scss'],
  standalone: false
})
export class ConvidadosFormPage {

  evento?: EventoGet;
  carregando = false;

  form = {
    nome: '',
    email: '',
    quantidadeAcompanhantes: 0,
    observacoes: ''
  };

  constructor(
    private eventosService: EventosService,
    private convidadosService: ConvidadosService,
    private router: Router
  ) {
    this.carregarEvento();
  }

  carregarEvento() {
    this.eventosService.getEventoAtivo().subscribe({
      next: evento => this.evento = evento,
      error: () => this.router.navigateByUrl('/evento')
    });
  }

  salvar() {
    if (!this.evento) return;

    this.carregando = true;

    const payload = {
      eventoId: this.evento.id,
      nome: this.form.nome,
      email: this.form.email,
      quantidadeAcompanhantes: this.form.quantidadeAcompanhantes,
      observacoes: this.form.observacoes
    };

    this.convidadosService.criarConvidado(payload).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigateByUrl('/convidados');
      },
      error: err => {
        console.error(err);
        this.carregando = false;
      }
    });
  }
}