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
Com backend: `useMocks: false`, suba a API na porta 3000 (ou ajuste o `target` em `proxy.conf.json`).
O proxy evita o CORS (a API ainda não usa `cors`).
`environment.currentUserId` é o usuário usado em favoritos/histórico enquanto não há login.

## Rotas
/inicio (Início: eventos, artistas, seleção do acervo e museu) · /perfil (Minha Biblioteca) · /tocando e /tocando/:id (player) · /descobrir e /instrumentos (provisórias)

## Arquitetura
- core/models/dto.ts  -> formato exato da API (colunas do banco)
- core/models/track.model.ts -> modelos que a interface usa
- core/api -> ApiClient (Axios), endpoints, erros, mock
- core/mappers -> DTO -> modelo
- core/repositories -> uma chamada HTTP por método
- core/services -> estado (catálogo, biblioteca do usuário, usuário, player)
- shared (vinil e fita) · layout (menu, mini player) · pages/home (Início) · pages/library (Perfil) · pages/now-playing

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
| Nome e função no menu | usuario.nome + perfil_usuario.nome |
| Eventos: destaque e lista (título, descrição, tipo, datas, status) | atividade.titulo, descricao, tipo_atividade, data_inicio, data_fim_prevista/data_fim_real, status |
| Sala do evento ("Em cartaz • Sala 02") | atividade_sala + sala.nome |
| Local fora do museu | atividade.local_externo |
| Botões "Falar com a organização" e "Ligar" | atividade.email_contato, telefone_contato |
| Artistas (círculo, nome, gênero, nº de músicas) | artista.nome_artistico, foto_url via musica_artista; gênero e ranking pelas músicas e por historico_musica |
| Seleção do Acervo | musica (com busca e filtro de formato) |
| Faixa "Visite o museu" (nome, descrição, endereço, contatos) | museu.nome, descricao, endereco, telefone, email |
| Salas e capacidade da faixa "Visite o museu" | sala.nome, capacidade |
| QR Code | link /tocando/:id da própria aplicação |

## Identidade visual
Cores: azul `#0927a9` (poucos destaques) e dourado/bege `#c59a45` + subtons. Fontes: Roboto (texto) e Roboto Condensed (títulos). Tokens em `src/styles.css`.

Cores do vinil/CD/fita não existem no banco: vêm de uma paleta escolhida pelo id da música.

## Rotas da API
Existem: /musicas, /artistas, /musica-artista, /partituras, /letra_trecho, /musicas-favoritas (GET, POST), /historico_musica.
Planejadas (o front já chama; no mock funcionam):
- GET /generos
- GET /atividades (com `salas`: JOIN atividade_sala + sala), GET /museu e GET /salas
- GET /usuarios/:id  e  GET /usuarios/:id/perfis  (sem senha_hash)
- DELETE /musicas-favoritas/:id_usuario/:id_musica
- Filtros ?id_musica= (letra_trecho, partituras, musica-artista) e ?id_usuario= (favoritas, historico)
