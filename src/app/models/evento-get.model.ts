export interface EventoGet {
  id: number;
  nome: string;
  dataEvento: string;
  local?: string;
  observacoes?: string;
  ativo: boolean;
}