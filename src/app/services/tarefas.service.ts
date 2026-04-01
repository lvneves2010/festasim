import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TarefaGet } from '../models/tarefa-get.model';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

    private readonly apiUrl = `${environment.apiUrl}/tarefas`;

    constructor(private http: HttpClient) {}

    getTarefasPorEvento(eventoId: number): Observable<TarefaGet[]> {
        return this.http.get<TarefaGet[]>(`${this.apiUrl}/evento/${eventoId}`);
    }
 
  
    criarTarefa(payload: any) {
        return this.http.post(`${environment.apiUrl}/tarefas`, payload);
    }

    deletarTarefa(id: number) {
       return this.http.delete(`${environment.apiUrl}/tarefas/${id}`);
    }

    atualizarTarefa(id: number, payload: any) {
        return this.http.put(`${environment.apiUrl}/tarefas/${id}`, payload);
    }

}