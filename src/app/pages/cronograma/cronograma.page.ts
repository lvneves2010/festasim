import { Component } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { EventosService } from '../../services/eventos.service';
import { TarefasService } from '../../services/tarefas.service';
import { EventoGet } from '../../models/evento-get.model';
import { TarefaGet, StatusTarefa } from '../../models/tarefa-get.model';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.page.html',
  styleUrls: ['./cronograma.page.scss'],
  standalone: false,
})
export class CronogramaPage {

  evento?: EventoGet;
  tarefas: TarefaGet[] = [];
  carregando = false;
  hoje = new Date();

  constructor(
    private eventosService: EventosService,
    private tarefasService: TarefasService
  ) {}

  ionViewWillEnter() {
    this.carregarCronograma();
  }

  carregarCronograma() {
    this.carregando = true;

    this.eventosService.getEventoAtivo().subscribe({
      next: evento => {
        this.evento = evento;

        this.tarefasService
          .getTarefasPorEvento(evento.id)
          .subscribe({
            next: tarefas => {
              this.tarefas = tarefas;
              this.carregando = false;
            },
            error: err => {
              console.error('Erro ao carregar tarefas', err);
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

  isAtrasada(tarefa: TarefaGet): boolean {
    if (tarefa.status === StatusTarefa.Concluida) {
      return false;
    }

    return new Date(tarefa.dataLimite) < this.hoje;
  }

  getStatusTexto(status: StatusTarefa): string {
    switch (status) {
      case StatusTarefa.Pendente:
        return 'Pendente';
      case StatusTarefa.EmAndamento:
        return 'Em andamento';
      case StatusTarefa.Concluida:
        return 'Concluída';
      default:
        return '';
    }
  }

  deletar(id: number) {
    this.tarefasService.deletarTarefa(id).subscribe({
      next: () => {
        this.tarefas = this.tarefas.filter(t => t.id !== id);
      },
      error: err => console.error('Erro ao deletar tarefa', err)
    });
  }

  alterarStatus(tarefa: TarefaGet) {
    this.tarefasService.atualizarTarefa(tarefa.id, {
      descricao: tarefa.descricao,
      dataLimite: tarefa.dataLimite,
      status: tarefa.status
    }).subscribe({
      error: err => console.error('Erro ao atualizar status da tarefa', err)
    });
  }

  statusColor(tarefa: TarefaGet): string {
    if (tarefa.status === StatusTarefa.Concluida) return 'success';
    if (tarefa.status === StatusTarefa.EmAndamento) return 'warning';
    if (this.isAtrasada(tarefa)) return 'danger';
    return 'medium'; // pendente
  }

  abrirSelectorStatus(select: IonSelect) {
    select.open();
  }

}