import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';

/**
 * Cabeçalho das telas no mobile: marca do museu e atalho do usuário (perfil, ou "Entrar" para visitante),
 * com um espaço (ng-content) para a busca. No desktop some, porque o menu assume.
 */
@Component({
  selector: 'app-mobile-head',
  standalone: false,
  templateUrl: './mobile-head.component.html',
  styleUrl: './mobile-head.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileHeadComponent {
  protected readonly auth = inject(AuthService);
  private readonly user = inject(UserService);

  protected readonly initials = computed(() =>
    this.user.name().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
  );
}
