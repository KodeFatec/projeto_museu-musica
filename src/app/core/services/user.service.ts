import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { toUserProfile } from '../mappers/track.mapper';
import { UserProfile } from '../models/track.model';
import { UsersRepository } from '../repositories/users.repository';

/** Usuário atual (nome e função mostrados no menu). Sem login ainda: usa environment.currentUserId. */
@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile = signal<UserProfile | null>(null);
  readonly name = computed(() => this.profile()?.name ?? 'Visitante');
  readonly role = computed(() => this.profile()?.role ?? 'Visitante');
  private loading?: Promise<void>;

  constructor(private readonly repository: UsersRepository) {}

  load(): Promise<void> {
    return (this.loading ??= this.fetch());
  }

  private async fetch(): Promise<void> {
    try {
      const id = environment.currentUserId;
      const [user, roles] = await Promise.all([this.repository.getById(id), this.repository.listProfiles(id)]);
      this.profile.set(toUserProfile(user, roles));
    } catch {
      // rota ainda não existe no backend: o menu cai no "Visitante"
      this.profile.set(null);
    }
  }
}
