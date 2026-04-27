# Todo List

- [x] Fix TypeScript deprecation warnings in tsconfig.json
- [x] Fix memory leaks in home.page.ts by adding OnDestroy and takeUntil
- [x] Fix payload for task status update in cronograma.page.ts (remove eventoId, align with backend expectations)
- [x] Increment version to 1.0.7 in package.json
- [ ] Fix memory leaks in all other pages (convidados, cronograma, financeiro, forms)
- [ ] Create proper TypeScript interfaces for financial data (CategoriaFinanceira, ItemFinanceiro)
- [ ] Add comprehensive error handling across all pages
- [ ] Extract duplicate code (exibirToast, toDateOnly, email generation) to utility services
- [ ] Add form validation to all form pages
- [ ] Improve loading state management