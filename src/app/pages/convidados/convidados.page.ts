import { Component } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { ConvidadosService } from '../../services/convidados.service';
import { EventosService } from '../../services/eventos.service';
import { ConvidadoGet } from '../../models/convidado-get.model';
import { EventoGet } from '../../models/evento-get.model';

@Component({
  selector: 'app-convidados',
  templateUrl: './convidados.page.html',
  styleUrls: ['./convidados.page.scss'],
  standalone: false
})
export class ConvidadosPage {

  convidados: ConvidadoGet[] = [];
  evento?: EventoGet;
  carregando = false;

  constructor(
    private convidadosService: ConvidadosService,
    private eventosService: EventosService
  ) {}

  ionViewWillEnter() {
    this.carregarConvidados();
  }

  carregarConvidados() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;

        this.convidadosService.getConvidadosPorEvento(evento.id).subscribe({
          next: convidados => {
            this.convidados = convidados;
            this.carregando = false;
          },
          error: err => {
            console.error('Erro ao carregar convidados', err);
            this.carregando = false;
          }
        });
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  deletar(id: number) {
    this.convidadosService.deletarConvidado(id).subscribe({
      next: () => {
        this.convidados = this.convidados.filter(c => c.id !== id);
      }
    });
  }

  textoConfirmacao(valor: boolean | null): string {
    if (valor === true) return 'Confirmado';
    if (valor === false) return 'Não vai';
    return 'Pendente';
  }

  statusColor(convidado: ConvidadoGet): string {
    if (convidado.confirmacaoPresenca === true) return 'success';
    if (convidado.confirmacaoPresenca === false) return 'danger';
    return 'medium';
  }

  abrirSelectorStatus(select: IonSelect) {
    select.open();
  }

  alterarConfirmacao(convidado: ConvidadoGet) {
    this.convidadosService.atualizarConvidado(convidado.id, {
      nome: convidado.nome,
      email: convidado.email,
      confirmacaoPresenca: convidado.confirmacaoPresenca,
      quantidadeAcompanhantes: convidado.quantidadeAcompanhantes,
      observacoes: convidado.observacoes
    }).subscribe({
      error: err =>
        console.error('Erro ao atualizar confirmação de presença', err)
    });
  }
}
