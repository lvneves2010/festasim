export enum StatusTarefa {
  Pendente = 0,
  EmAndamento = 1,
  Concluida = 2
}

export interface TarefaGet {
  id: number;
  descricao: string;
  dataLimite: string;
  status: StatusTarefa;
}