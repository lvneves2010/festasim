import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    private router: Router,
    private toastController: ToastController
  ) {}

  private async exibirToast(mensagem: string, cor: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2200,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }

  private gerarEmailFallback(nome: string): string {
    const base = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/(^\.|\.$)/g, '') || 'convidado';

    return `${base}.${Date.now()}@festasim.app`;
  }

  ionViewWillEnter() {
    this.carregarEvento();
  }

  carregarEvento() {
    this.carregando = true;
    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.router.navigateByUrl('/evento');
      }
    });
  }

  salvar() {
    if (!this.evento || this.carregando) return;

    this.carregando = true;

    const nome = this.form.nome.trim();
    const email = this.form.email.trim();

    const payload = {
      eventoId: this.evento.id,
      nome,
      email: email || this.gerarEmailFallback(nome),
      confirmacaoPresenca: null,
      quantidadeAcompanhantes: Number(this.form.quantidadeAcompanhantes) || 0,
      observacoes: this.form.observacoes.trim() || ''
    };

    this.convidadosService.criarConvidado(payload).subscribe({
      next: async () => {
        this.carregando = false;
        await this.exibirToast('Convidado salvo com sucesso.', 'success');
        this.router.navigateByUrl('/convidados');
      },
      error: async err => {
        console.error(err);
        this.carregando = false;
        await this.exibirToast('Nao foi possivel salvar o convidado.', 'danger');
      }
    });
  }
}