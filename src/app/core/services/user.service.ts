import { computed, effect, Injectable, signal, untracked } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { toUserProfile } from '../mappers/track.mapper';
import { PerfilUsuarioDto, UsuarioDto } from '../models/dto';
import { UserProfile } from '../models/track.model';
import { UsersRepository } from '../repositories/users.repository';

/** Usuário logado (nome e função mostrados no menu). Sem login, é "Visitante". */
@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile = signal<UserProfile | null>(null);
  readonly name = computed(() => this.profile()?.name ?? 'Visitante');
  readonly role = computed(() => this.profile()?.role ?? 'Visitante');

  constructor(
    private readonly repository: UsersRepository,
    private readonly auth: AuthService,
  ) {
    // carrega o perfil quando o usuário entra e limpa quando sai
    effect(() => {
      const id = this.auth.userId();
      untracked(() => {
        this.profile.set(null);
        if (id !== null) void this.fetch(id);
      });
    });
  }

  private async fetch(id: string | number): Promise<void> {
    try {
      let user: UsuarioDto;
      try {
        user = await this.repository.getMe();
      } catch {
        user = await this.repository.getById(id);
      }

      let roles: PerfilUsuarioDto[] = [];
      try {
        roles = await this.repository.listProfiles(id);
      } catch {
        roles = [{ id_perfil: 1, nome: 'Usuário' }];
      }

      if (String(this.auth.userId()) === String(id)) {
        this.profile.set(toUserProfile(user, roles));
      }
    } catch (err) {
      this.profile.set(null);
    }
  }
}
