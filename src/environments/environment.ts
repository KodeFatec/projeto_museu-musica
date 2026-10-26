export const environment = {
  /** Base da API. Em dev, o proxy (proxy.conf.json) encaminha /api para o Express (porta 3000). */
  apiBaseUrl: '/api',
  /** true = usa os dados de exemplo (core/api/mock) no lugar do backend. Troque para false para usar a API. */
  useMocks: false,
  /** Enquanto não há login: usuário usado em favoritos e histórico (usuario.id_usuario). */
  currentUserId: 1,
};
