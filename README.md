# Memorial Som & Alma — Angular (NgModule, CSS puro, Axios)

Biblioteca (Início) + Tocando unificados. Testado com Angular 19 (funciona do 17.2 em diante).

## Como rodar
1. `ng new museu --standalone=false --style=css --routing=false --ssr=false`
2. `npm i axios qrcode` e `npm i -D @types/qrcode`
3. Apague `src/app/app.*` gerados e copie `src/` e `proxy.conf.json` desta pasta por cima.
4. Em `angular.json`: `build > options > "allowedCommonJsDependencies": ["qrcode"]`
   e `serve > options > "proxyConfig": "proxy.conf.json"`.
5. `ng serve`

Sem backend: `src/environments/environment.ts` já vem com `useMocks: true` (o Axios responde com dados no
formato das tabelas, em `core/api/mock`).
Com backend: copie `.env.example` para `.env` e configure `BACKEND_URL`, `API_BASE_URL` e `USE_MOCKS=false`.
As variáveis são carregadas em tempo de build/servidor: ao executar `npm start`, `npm run build` ou `npm test`,
o arquivo `src/environments/environment.generated.ts` e o `proxy.conf.json` são gerados a partir do `.env`.
Depois de alterar o `.env`, reinicie o servidor ou execute o build novamente.
Com o mock, entre com **arthur@museu.example** (ou CPF **529.982.247-25**) e a senha **museu123**; o cadastro
também funciona (guarda só em memória: some ao recarregar).

## Rotas
/inicio (Início: eventos, artistas, seleção do acervo e museu) · /artista/:id (tela do artista, aberta ao clicar em um artista no Início) · /login e /cadastro (mesma casca) · /perfil (Minha Biblioteca, só logado) · /tocando e /tocando/:id (player) · /descobrir (coleções e busca do acervo) · /descobrir/resultados (provisória: recebe os critérios pela URL) · /instrumentos (listagem do acervo)

## Arquitetura
- core/models/dto.ts  -> formato exato da API (colunas do banco)
- core/models/track.model.ts -> modelos que a interface usa
- core/api -> ApiClient (Axios), endpoints, erros, mock
- core/mappers -> DTO -> modelo
- core/repositories -> uma chamada HTTP por método
- core/services -> estado (catálogo, biblioteca do usuário, usuário, player)
- shared (vinil e fita, filtros) · layout (menu, mini player) · pages/home (Início) · pages/artist (Artista) · pages/instruments (Instrumentos) · pages/explore (Descobrir) · pages/library (Perfil) · pages/now-playing

## De onde vem cada informação da tela
| Na tela | Tabela.coluna |
|---|---|
| Título | musica.titulo |
| Vinil (<= 1979), K7 (1980–1989) ou CD (>= 1990) | musica.ano_gravacao (sem ano = vinil) |
| Duração, barra de progresso | musica.duracao |
| Gênero (selo, eyebrow, badges) | genero_musical.nome via musica.id_genero |
| Artistas ao lado do título | artista.nome_artistico via musica_artista (2 primeiros) |
| Participações (nome + papel) | artista.nome_artistico / foto_url + musica_artista.tipo_participacao |
| Compositor (rodapé da letra) | artistas com tipo_participacao contendo "Compositor" |
| Código ISRC | musica.isrc |
| Formato do áudio (cabeçalho) | extensão de musica.arquivo_audio |
| Áudio tocando | musica.arquivo_audio (sem arquivo: relógio simulado) |
| Letra sincronizada | letra_trecho.texto, tempo_inicio, ordem |
| Partitura (título, origem, estado, autor, ano, arquivo) | partitura + item_acervo |
| Curtidas / coração | musica_favorita |
| Mais ouvidas, Ouvidas recentemente, retomar de onde parou | historico_musica (contagem, data_reproducao, progresso) |
| Disco de ouro (vinil/CD dourado, K7 dourada e selo) | as 5 músicas mais reproduzidas em historico_musica |
| Descobrir: coleções por década ("Anos 80 — N gravações") | contagem de musica por ano_gravacao (década) |
| Descobrir: coleções por instrumento ("Cordas — N instrumentos") | contagem de instrumento.tipo_instrumento |
| Descobrir: Acervo físico (vinis, fitas K7, CDs) | contagem de musica por formato (regra do ano) |
| Descobrir: Acervo físico (partituras, instrumentos, artistas) | contagem de partitura, instrumento e artista |
| Descobrir: "Linhas do tempo & décadas" | décadas das músicas (musica.ano_gravacao) e quantas gravações cada uma tem |
| Descobrir: busca (música, artista, ISRC, gênero, instrumento) | texto enviado à tela de resultados (veja abaixo) |
| Nome e função no menu | usuario.nome + perfil_usuario.nome (só logado; visitante vê "Visitante" e o botão Entrar) |
| Login: e-mail ou CPF + senha | usuario.email / usuario.cpf + senha (conferida como `senha_hash` no backend) |
| Cadastro: nome, CPF, e-mail, telefone, senha | usuario.nome, cpf, email, telefone, senha_hash; perfil padrão em usuario_perfil |
| Números do painel de login (músicas, artistas, salas) | contagem de musica, artista e sala |
| Início: "Ouvidas recentemente" (só logado) | historico_musica do usuário (id do JWT) |
| Eventos: destaque e lista (título, descrição, tipo, datas, status) | atividade.titulo, descricao, tipo_atividade, data_inicio, data_fim_prevista/data_fim_real, status |
| Sala do evento ("Em cartaz • Sala 02") | atividade_sala + sala.nome |
| Local fora do museu | atividade.local_externo |
| Botões "Falar com a organização" e "Ligar" | atividade.email_contato, telefone_contato |
| Artistas (círculo, nome, gênero, nº de músicas) | artista.nome_artistico, foto_url via musica_artista; gênero e ranking pelas músicas e por historico_musica |
| Seleção do Acervo | musica (com busca e filtro de formato) |
| Faixa "Visite o museu" (nome, descrição, endereço, contatos) | museu.nome, descricao, endereco, telefone, email |
| Salas e capacidade da faixa "Visite o museu" | sala.nome, capacidade |
| Artista: nome, nome completo, foto, biografia | artista.nome_artistico, nome_completo, foto_url, biografia |
| Artista: "1947 — 2020 • 72 anos" | artista.data_nascimento, data_falecimento (idade calculada) |
| Artista: registro `#ART-042` | artista.id_artista |
| Artista: gêneros (chips) | genero_musical.nome das músicas do artista |
| Artista: obras e nº por formato (vinis, K7, CDs) | musica via musica_artista; formato pelo ano_gravacao |
| Artista: Eventos & Memória (data, título, descrição, tipo, "há N anos") | atividade ligada às obras: atividade_item -> item_acervo -> partitura -> musica -> musica_artista |
| QR Code | link /tocando/:id da própria aplicação |

## Identidade visual
Cores: azul `#0927a9` (poucos destaques) e dourado/bege `#c59a45` + subtons. Fontes: Roboto (texto) e Roboto Condensed (títulos). Tokens em `src/styles.css`.

Cores do vinil/CD/fita não existem no banco: vêm de uma paleta escolhida pelo id da música.

## Autenticação (JWT)
- `POST /api/auth/login` com `{ login, senha }` (`login` = e-mail ou CPF só com dígitos) -> `200 { token }`; senha ou usuário errados -> `401 { erro }`.
- `POST /api/auth/register` com `{ nome, cpf, email, senha, telefone? }` (`cpf` só com dígitos) -> `201 { token }` (já entra logado);
  `409 { erro }` para e-mail/CPF repetido; `400 { erro, detalhes: [{ campo, mensagem }] }` para dados inválidos (cada `campo` aparece no formulário).
- O token precisa ter `sub` = `usuario.id_usuario` e `exp`. O front só decodifica (quem confere a assinatura é a API) e manda `Authorization: Bearer <token>` em toda requisição.
- "Manter conectado" guarda o token no `localStorage`; sem isso, no `sessionStorage`. Token vencido ou resposta 401 derrubam a sessão.
- Visitante: vê o site, mas não vê "Ouvidas recentemente", não grava histórico, e **favoritar** ou abrir **/perfil** leva ao login (que depois volta para onde estava).

## Descobrir -> resultados (tela futura)
Clicar numa coleção, num cartão do acervo físico, numa década ou pesquisar (Enter / "Localizar") abre
`/descobrir/resultados` com os critérios nos parâmetros da URL (hoje é a tela provisória "em construção"):

| Parâmetro | Valores | Exemplo |
|---|---|---|
| `q` | texto digitado | `?q=piano` |
| `tipo` | `musicas`, `artistas`, `instrumentos`, `partituras` | `?tipo=instrumentos` |
| `decada` | primeiro ano da década | `?decada=1970` |
| `formato` | `vinil`, `k7`, `cd` | `?tipo=musicas&formato=k7` |
| `instrumento` | `instrumento.tipo_instrumento` | `?tipo=instrumentos&instrumento=Cordas` |

`core/models/explore-query.model.ts` tem `toQueryParams()` (quem manda) e `fromQueryParams()` (a tela de resultados lê com ela).

## Rotas da API
Existem: /musicas, /artistas, /musica-artista, /partituras, /letra_trecho, /musicas-favoritas (GET, POST), /historico_musica.
Planejadas (o front já chama; no mock funcionam):
- GET /generos
- GET /instrumentos (JOIN instrumento + item_acervo, com `midias`)
- GET /atividades (com `salas`: JOIN atividade_sala + sala), GET /museu e GET /salas
- GET /artistas/:id/atividades (JOIN atividade_item -> partitura -> musica_artista). Já existe: GET /artistas/:id
- POST /auth/login e POST /auth/register (veja a seção Autenticação)
- GET /usuarios/:id  e  GET /usuarios/:id/perfis  (sem senha_hash)
- DELETE /musicas-favoritas/:id_usuario/:id_musica
- Filtros ?id_musica= (letra_trecho, partituras, musica-artista) e ?id_usuario= (favoritas, historico)
