import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategoriasPorEvento(eventoId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/categorias-financeiras/evento/${eventoId}`
    );
  }

  criarCategoria(payload: any) {
    return this.http.post(`${this.baseUrl}/categorias-financeiras`, payload);
  }

  getItensPorEvento(eventoId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/itens-financeiros/evento/${eventoId}`
    );
  }

  criarItem(payload: any) {
    return this.http.post(`${this.baseUrl}/itens-financeiros`, payload);
  }

  deletarItem(id: number) {
    return this.http.delete(`${this.baseUrl}/itens-financeiros/${id}`);
  }

  atualizarItem(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/itens-financeiros/${id}`, payload);
  }
}