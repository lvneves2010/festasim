import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConvidadoGet } from '../models/convidado-get.model';

@Injectable({
  providedIn: 'root'
})
export class ConvidadosService {

  private apiUrl = `${environment.apiUrl}/convidados`;

  constructor(private http: HttpClient) {}

  getConvidadosPorEvento(eventoId: number) {
    return this.http.get<ConvidadoGet[]>(`${this.apiUrl}/evento/${eventoId}`);
  }

  criarConvidado(payload: any) {
    return this.http.post(this.apiUrl, payload);
  }

  deletarConvidado(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  atualizarConvidado(id: number, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

}