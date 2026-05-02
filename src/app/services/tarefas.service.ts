import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { db } from '../firebase';
import { TarefaGet, StatusTarefa } from '../models/tarefa-get.model';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  private tarefasCollection(eventoId: string) {
    return collection(db, 'eventos', eventoId, 'tarefas');
  }

  getTarefasPorEvento(eventoId: string): Observable<TarefaGet[]> {
    return from(getDocs(this.tarefasCollection(eventoId))).pipe(
      map(snapshot =>
        snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            descricao: data['descricao'],
            dataLimite: data['dataLimite']
              ? data['dataLimite'].toDate().toISOString()
              : '',
            status: data['status'] as StatusTarefa
          } as TarefaGet;
        })
      )
    );
  }

  criarTarefa(eventoId: string, payload: Partial<TarefaGet>) {
    const docPayload = {
      descricao: payload.descricao,
      dataLimite: payload.dataLimite
        ? Timestamp.fromDate(new Date(payload.dataLimite))
        : null,
      status: StatusTarefa.Pendente,
      criadoEm: Timestamp.now()
    };

    return from(addDoc(this.tarefasCollection(eventoId), docPayload)).pipe(
      map(() => void 0)
    );
  }

  atualizarTarefa(eventoId: string, tarefaId: string, payload: Partial<TarefaGet>) {
    const ref = doc(db, 'eventos', eventoId, 'tarefas', tarefaId);

    const docPayload = {
      descricao: payload.descricao,
      dataLimite: payload.dataLimite
        ? Timestamp.fromDate(new Date(payload.dataLimite))
        : null,
      status: payload.status
    };

    return from(updateDoc(ref, docPayload)).pipe(map(() => void 0));
  }

  deletarTarefa(eventoId: string, tarefaId: string) {
    const ref = doc(db, 'eventos', eventoId, 'tarefas', tarefaId);
    return from(deleteDoc(ref)).pipe(map(() => void 0));
  }
}