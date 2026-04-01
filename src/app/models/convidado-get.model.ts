export interface ConvidadoGet {
  id: number;
  nome: string;
  email: string;
  confirmacaoPresenca: boolean | null;
  quantidadeAcompanhantes: number;
  observacoes?: string;
  dataCriacao: string;
}
``