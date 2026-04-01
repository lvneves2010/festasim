import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventoGet } from '../models/evento-get.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private readonly apiUrl = `${environment.apiUrl}/eventos`;

  constructor(private http: HttpClient) {}

  getEventoAtivo(): Observable<EventoGet> {
    return this.http.get<EventoGet>(`${this.apiUrl}/ativo`);
  }

  criarEvento(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  atualizarEvento(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
}