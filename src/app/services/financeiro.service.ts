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
import { FinanceiroCategoria } from '../models/financeiro-categoria.model';
import { FinanceiroItem } from '../models/financeiro-item.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private categorias(eventoId: string) {
    return collection(db, 'eventos', eventoId, 'categoriasFinanceiras');
  }

  private itens(eventoId: string) {
    return collection(db, 'eventos', eventoId, 'itensFinanceiros');
  }

  // ===== CATEGORIAS =====

  getCategoriasPorEvento(eventoId: string): Observable<FinanceiroCategoria[]> {
    return from(getDocs(this.categorias(eventoId))).pipe(
      map(snapshot =>
        snapshot.docs.map(d => ({
          id: d.id,
          nome: d.data()['nome']
        }))
      )
    );
  }

  criarCategoria(eventoId: string, nome: string) {
    return from(
      addDoc(this.categorias(eventoId), {
        nome,
        criadoEm: Timestamp.now()
      })
    ).pipe(map(() => void 0));
  }

  // ===== ITENS =====

  getItensPorEvento(eventoId: string): Observable<FinanceiroItem[]> {
    return from(getDocs(this.itens(eventoId))).pipe(
      map(snapshot =>
        snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            categoriaId: data['categoriaId'],
            descricao: data['descricao'],
            valorPrevisto: data['valorPrevisto'],
            valorPago: data['valorPago'] ?? null
          } as FinanceiroItem;
        })
      )
    );
  }

  criarItem(eventoId: string, payload: Partial<FinanceiroItem>) {
    return from(
      addDoc(this.itens(eventoId), {
        categoriaId: payload.categoriaId,
        descricao: payload.descricao,
        valorPrevisto: payload.valorPrevisto,
        valorPago: null,
        criadoEm: Timestamp.now()
      })
    ).pipe(map(() => void 0));
  }

  atualizarItem(eventoId: string, itemId: string, payload: Partial<FinanceiroItem>) {
    const ref = doc(db, 'eventos', eventoId, 'itensFinanceiros', itemId);

    return from(
      updateDoc(ref, {
        descricao: payload.descricao,
        valorPrevisto: payload.valorPrevisto,
        valorPago: payload.valorPago ?? null,
        categoriaId: payload.categoriaId
      })
    ).pipe(map(() => void 0));
  }

  deletarItem(eventoId: string, itemId: string) {
    const ref = doc(db, 'eventos', eventoId, 'itensFinanceiros', itemId);
    return from(deleteDoc(ref)).pipe(map(() => void 0));
  }
}