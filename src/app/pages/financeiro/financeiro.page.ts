import { Component } from '@angular/core';
import { AlertController, IonSelect, ToastController } from '@ionic/angular';
import { EventosService } from '../../services/eventos.service';
import { FinanceiroService } from '../../services/financeiro.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
  standalone: false
})
export class FinanceiroPage {

  eventoId?: number;
  categorias: any[] = [];
  itens: any[] = [];
  carregando = false;

  constructor(
    private eventosService: EventosService,
    private financeiroService: FinanceiroService,
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
          .subscribe(categorias => this.categorias = categorias);

        this.financeiroService
          .getItensPorEvento(evento.id)
          .subscribe(itens => {
            this.itens = itens;
            this.carregando = false;
          });
      },
      error: () => this.carregando = false
    });
  }

  deletarItem(id: number) {
    this.financeiroService.deletarItem(id).subscribe(async () => {
      this.itens = this.itens.filter(i => i.id !== id);
      await this.exibirToast('Despesa removida.', 'success');
    });
  }

  statusColor(item: any): string {
    return item.valorPago ? 'success' : 'medium';
  }

  
  statusTexto(item: any): string {
    return item.valorPago ? 'Pago' : 'Pendente';
  }

  
  abrirSelectorStatus(select: IonSelect) {
    select.open();
  }

  
  alterarStatus(item: any) {
    const payload = {
      eventoId: this.eventoId,
      categoriaFinanceiraId: item.categoriaFinanceiraId,
      descricao: item.descricao,
      valorPrevisto: item.valorPrevisto,
      valorPago: item.valorPago
    };

    this.financeiroService.atualizarItem(item.id, payload).subscribe({
      next: async () => {
        await this.exibirToast('Despesa atualizada.', 'success');
      },
      error: err =>
        console.error('Erro ao atualizar status financeiro', err)
    });
  }

  async editarItem(item: any) {
    const alert = await this.alertController.create({
      header: 'Editar despesa',
      inputs: [
        {
          name: 'descricao',
          type: 'text',
          value: item.descricao,
          placeholder: 'Descricao'
        },
        {
          name: 'valorPrevisto',
          type: 'number',
          value: String(item.valorPrevisto || 0),
          placeholder: 'Valor previsto'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Proximo',
          handler: data => {
            const descricao = (data.descricao || '').trim();
            const valorPrevisto = Number(data.valorPrevisto) || 0;
            if (!descricao || valorPrevisto <= 0) {
              this.exibirToast('Descricao e valor previsto sao obrigatorios.', 'danger');
              return false;
            }

            item.descricao = descricao;
            item.valorPrevisto = valorPrevisto;
            this.editarCategoria(item);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async editarCategoria(item: any) {
    if (!this.categorias.length) {
      await this.exibirToast('Nenhuma categoria disponivel.', 'danger');
      return;
    }

    const inputs = this.categorias.map(categoria => ({
      type: 'radio' as const,
      label: categoria.nome,
      value: categoria.id,
      checked: categoria.id === item.categoriaFinanceiraId
    }));

    const alert = await this.alertController.create({
      header: 'Selecionar categoria',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: categoriaFinanceiraId => {
            item.categoriaFinanceiraId = Number(categoriaFinanceiraId);
            const categoriaSelecionada = this.categorias.find(c => c.id === item.categoriaFinanceiraId);
            if (categoriaSelecionada) {
              item.categoria = categoriaSelecionada.nome;
            }

            const payload = {
              eventoId: this.eventoId,
              categoriaFinanceiraId: item.categoriaFinanceiraId,
              descricao: item.descricao,
              valorPrevisto: Number(item.valorPrevisto) || 0,
              valorPago: item.valorPago
            };

            this.financeiroService.atualizarItem(item.id, payload).subscribe({
              next: async () => {
                await this.exibirToast('Despesa editada com sucesso.', 'success');
              },
              error: async err => {
                console.error('Erro ao editar despesa', err);
                await this.exibirToast('Erro ao editar despesa.', 'danger');
              }
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

}