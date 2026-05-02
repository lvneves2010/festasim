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
import { ConvidadoGet } from '../models/convidado-get.model';

@Injectable({
  providedIn: 'root'
})
export class ConvidadosService {

  private convidadosCollection(eventoId: string) {
    return collection(db, 'eventos', eventoId, 'convidados');
  }

  getConvidadosPorEvento(eventoId: string): Observable<ConvidadoGet[]> {
    return from(getDocs(this.convidadosCollection(eventoId))).pipe(
      map(snapshot =>
        snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            nome: data['nome'],
            email: data['email'],
            confirmacaoPresenca: data['confirmacaoPresenca'] ?? null,
            quantidadeAcompanhantes: data['quantidadeAcompanhantes'] ?? 0,
            observacoes: data['observacoes']
          } as ConvidadoGet;
        })
      )
    );
  }

  criarConvidado(eventoId: string, payload: Partial<ConvidadoGet>): Observable<void> {
    const docPayload = {
      nome: payload.nome,
      email: payload.email || null,
      confirmacaoPresenca: payload.confirmacaoPresenca ?? null,
      quantidadeAcompanhantes: payload.quantidadeAcompanhantes || 0,
      observacoes: payload.observacoes || null,
      criadoEm: Timestamp.now()
    };

    return from(addDoc(this.convidadosCollection(eventoId), docPayload)).pipe(
      map(() => void 0)
    );
  }

  atualizarConvidado(eventoId: string, convidadoId: string, payload: Partial<ConvidadoGet>) {
    const ref = doc(db, 'eventos', eventoId, 'convidados', convidadoId);

    const docPayload = {
      nome: payload.nome,
      email: payload.email || null,
      confirmacaoPresenca: payload.confirmacaoPresenca ?? null,
      quantidadeAcompanhantes: payload.quantidadeAcompanhantes || 0,
      observacoes: payload.observacoes || null
    };

    return from(updateDoc(ref, docPayload)).pipe(
      map(() => void 0)
    );
  }

  deletarConvidado(eventoId: string, convidadoId: string) {
    const ref = doc(db, 'eventos', eventoId, 'convidados', convidadoId);
    return from(deleteDoc(ref)).pipe(map(() => void 0));
  }
}