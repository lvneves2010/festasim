import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { db } from '../firebase';
import { EventoGet } from '../models/evento-get.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private eventosCollection = collection(db, 'eventos');

  /**
   * Retorna o primeiro evento encontrado (equivalente ao "evento ativo")
   */
  getEventoAtivo(): Observable<EventoGet | null> {
    return from(getDocs(this.eventosCollection)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
          id: doc.id,
          nome: data['nome'],
          dataEvento: data['dataEvento']
            ? data['dataEvento'].toDate().toISOString()
            : undefined,
          local: data['local'],
          observacoes: data['observacoes']
        } as EventoGet;
      })
    );
  }

  /**
   * Cria um novo evento
   */
  criarEvento(payload: Partial<EventoGet>): Observable<void> {
    const docPayload = {
      nome: payload.nome,
      dataEvento: payload.dataEvento
        ? Timestamp.fromDate(new Date(payload.dataEvento))
        : null,
      local: payload.local || null,
      observacoes: payload.observacoes || null,
      criadoEm: Timestamp.now()
    };

    return from(addDoc(this.eventosCollection, docPayload)).pipe(
      map(() => void 0)
    );
  }

  
  atualizarEvento(id: string, payload: Partial<EventoGet>) {
    const ref = doc(db, 'eventos', id);

    const docPayload = {
      nome: payload.nome,
      dataEvento: payload.dataEvento
        ? Timestamp.fromDate(new Date(payload.dataEvento))
        : null,
      local: payload.local || null,
      observacoes: payload.observacoes || null
    };

    return from(updateDoc(ref, docPayload)).pipe(
      map(() => void 0)
    );
  }

}

