import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LyricVerse, ScoreSheet, Track } from '../models/track.model';
import { toScore, toVerse } from '../mappers/track.mapper';
import { SongDetailRepository } from '../repositories/song-detail.repository';
import { HistoryRepository } from '../repositories/user-library.repository';
import { toTimeString } from '../utils/time';
import { CatalogService, LoadStatus } from './catalog.service';
import { LibraryService } from './library.service';

/**
 * Player: toca o `arquivo_audio` da música quando existe; sem arquivo (ou se ele falhar),
 * usa um relógio simulado de 1s para a interface funcionar. Registra o histórico (historico_musica).
 */
@Injectable({ providedIn: 'root' })
export class PlayerService implements OnDestroy {
  readonly track = signal<Track | null>(null);
  readonly lyrics = signal<LyricVerse[]>([]);
  readonly score = signal<ScoreSheet | null>(null);
  readonly status = signal<LoadStatus>('idle');

  readonly playing = signal(false);
  readonly elapsed = signal(0);
  readonly shuffle = signal(false);
  readonly repeat = signal(false);

  readonly duration = computed(() => this.track()?.durationSeconds ?? 0);
  readonly progress = computed(() => (this.duration() > 0 ? this.elapsed() / this.duration() : 0));
  readonly liked = computed(() => {
    const track = this.track();
    return !!track && this.library.isLiked(track.id);
  });

  /** Índice do trecho da letra em reprodução (-1 antes do primeiro). */
  readonly currentVerse = computed(() => {
    const now = this.elapsed();
    let index = -1;
    this.lyrics().forEach((verse, i) => {
      if (verse.start <= now) index = i;
    });
    return index;
  });

  private audio?: HTMLAudioElement;
  private historyId?: number;
  private ticks = 0;
  private readonly timer = setInterval(() => this.tick(), 1000);

  constructor(
    private readonly catalog: CatalogService,
    private readonly library: LibraryService,
    private readonly details: SongDetailRepository,
    private readonly historyRepo: HistoryRepository,
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.audio?.pause();
  }

  /** Abre uma música (e opcionalmente já toca). Se ela já está aberta, só retoma. */
  async open(songId: number, autoplay = false): Promise<void> {
    if (this.track()?.id === songId && this.status() === 'ready') {
      if (autoplay && !this.playing()) this.play();
      return;
    }
    await this.saveProgress();
    this.teardownAudio();
    this.playing.set(false);
    this.status.set('loading');
    try {
      await Promise.all([this.catalog.load(), this.library.load()]);
      const track = this.catalog.byId(songId);
      if (!track) throw new Error('Música não encontrada');

      const resume = this.library.resumeAt(songId);
      this.historyId = undefined;
      this.track.set(track);
      this.lyrics.set([]);
      this.score.set(null);
      this.elapsed.set(resume < track.durationSeconds - 2 ? resume : 0);
      this.setupAudio(track);
      this.status.set('ready');
      if (autoplay) this.play();

      // letra e partitura não impedem a tela de abrir se falharem
      const [lyrics, scores] = await Promise.all([
        this.details.listLyrics(songId).catch(() => []),
        this.details.listScores(songId).catch(() => []),
      ]);
      if (this.track()?.id === songId) {
        this.lyrics.set(lyrics.map(toVerse).sort((a, b) => a.order - b.order));
        this.score.set(scores[0] ? toScore(scores[0]) : null);
      }
    } catch {
      this.status.set('error');
    }
  }

  /** Abre a música mais recente do histórico (ou a primeira do catálogo). */
  async openDefault(): Promise<void> {
    await Promise.all([this.catalog.load(), this.library.load()]);
    const first = this.library.recentlyPlayed()[0] ?? this.library.mostPlayedAll()[0] ?? this.catalog.tracks()[0];
    if (first) await this.open(first.id);
    else this.status.set('error');
  }

  toggle(): void {
    if (this.playing()) this.pause();
    else this.play();
  }

  play(): void {
    if (!this.track()) return;
    this.playing.set(true);
    this.audio?.play().catch((e: DOMException) => {
      if (e.name === 'NotAllowedError') this.playing.set(false); // navegador exige um clique antes
      else this.audio = undefined; // arquivo inválido: segue com o relógio simulado
    });
    void this.ensureHistory();
  }

  pause(): void {
    this.playing.set(false);
    this.audio?.pause();
    void this.saveProgress();
  }

  seek(seconds: number): void {
    const value = Math.min(Math.max(seconds, 0), this.duration());
    this.elapsed.set(value);
    if (this.audio) this.audio.currentTime = value;
  }

  skip(delta: number): void {
    this.seek(this.elapsed() + delta);
  }

  private setupAudio(track: Track): void {
    if (!track.audioUrl) return;
    const audio = new Audio(track.audioUrl);
    audio.preload = 'metadata';
    audio.addEventListener('timeupdate', () => this.elapsed.set(Math.floor(audio.currentTime)));
    audio.addEventListener('ended', () => this.onEnded());
    audio.addEventListener('error', () => (this.audio = undefined));
    if (this.elapsed() > 0) audio.currentTime = this.elapsed();
    this.audio = audio;
  }

  private teardownAudio(): void {
    this.audio?.pause();
    this.audio = undefined;
  }

  private tick(): void {
    if (!this.playing()) return;
    if (!this.audio) {
      const next = this.elapsed() + 1;
      if (next >= this.duration()) this.onEnded();
      else this.elapsed.set(next);
    }
    if (++this.ticks % 30 === 0) void this.saveProgress(); // a cada 30s
  }

  private onEnded(): void {
    if (this.repeat()) {
      this.seek(0);
      if (this.audio) void this.audio.play();
    } else {
      this.seek(this.duration());
      this.playing.set(false);
      void this.saveProgress();
    }
  }

  /** Cria a linha de histórico na primeira reprodução da música aberta. */
  private async ensureHistory(): Promise<void> {
    const track = this.track();
    if (!track || this.historyId !== undefined) return;
    this.historyId = 0; // evita criar duas linhas se o usuário clicar rápido
    try {
      const row = await this.historyRepo.create(environment.currentUserId, track.id, toTimeString(this.elapsed()));
      this.historyId = row.id_historico;
      this.library.addHistory(row);
    } catch {
      this.historyId = undefined;
    }
  }

  private async saveProgress(): Promise<void> {
    const track = this.track();
    if (!track || !this.historyId) return;
    try {
      await this.historyRepo.updateProgress(this.historyId, environment.currentUserId, track.id, toTimeString(this.elapsed()));
    } catch {
      /* o progresso é secundário: não interrompe a reprodução */
    }
  }
}
