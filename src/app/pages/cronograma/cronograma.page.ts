import { Component } from '@angular/core';
import { AlertController, IonSelect, ToastController } from '@ionic/angular';
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
    private tarefasService: TarefasService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  private async exibirToast(mensagem: string, cor: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }

  private toDateOnly(value: string): string {
    return value.includes('T') ? value.split('T')[0] : value.substring(0, 10);
  }

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
      next: async () => {
        this.tarefas = this.tarefas.filter(t => t.id !== id);
        await this.exibirToast('Tarefa removida.', 'success');
      },
      error: async err => {
        console.error('Erro ao deletar tarefa', err);
        await this.exibirToast('Erro ao remover tarefa.', 'danger');
      }
    });
  }

  alterarStatus(tarefa: TarefaGet) {
    this.tarefasService.atualizarTarefa(tarefa.id, {
      descricao: tarefa.descricao,
      dataLimite: this.toDateOnly(tarefa.dataLimite),
      status: tarefa.status
    }).subscribe({
      next: async () => {
        await this.exibirToast('Status atualizado.', 'success');
      },
      error: async err => {
        console.error('Erro ao atualizar status da tarefa', err);
        await this.exibirToast('Erro ao atualizar status.', 'danger');
      }
    });
  }

  async editarTarefa(tarefa: TarefaGet) {
    const alert = await this.alertController.create({
      header: 'Editar tarefa',
      inputs: [
        {
          name: 'descricao',
          type: 'text',
          value: tarefa.descricao,
          placeholder: 'Descricao'
        },
        {
          name: 'dataLimite',
          type: 'date',
          value: this.toDateOnly(tarefa.dataLimite)
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: data => {
            const descricao = (data.descricao || '').trim();
            const dataLimite = this.toDateOnly(data.dataLimite || '');

            if (!descricao || !dataLimite) {
              this.exibirToast('Descricao e data limite sao obrigatorias.', 'danger');
              return false;
            }

            tarefa.descricao = descricao;
            tarefa.dataLimite = dataLimite;

            this.tarefasService.atualizarTarefa(tarefa.id, {
              descricao,
              dataLimite,
              status: tarefa.status
            }).subscribe({
              next: async () => {
                await this.exibirToast('Tarefa editada com sucesso.', 'success');
              },
              error: async err => {
                console.error('Erro ao editar tarefa', err);
                await this.exibirToast('Erro ao editar tarefa.', 'danger');
              }
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
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