import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import * as QRCode from 'qrcode';

/** QR Code real (lib `qrcode`) que aponta para a página da música. */
@Component({
  selector: 'app-qr-code',
  standalone: false,
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeComponent {
  readonly value = input.required<string>();
  protected readonly copied = signal(false);

  /** Converte a matriz de módulos em um único path SVG (1 unidade por módulo). */
  protected readonly qr = computed(() => {
    const { modules } = QRCode.create(this.value(), { errorCorrectionLevel: 'M' });
    let path = '';
    for (let row = 0; row < modules.size; row++) {
      for (let col = 0; col < modules.size; col++) {
        if (modules.get(row, col)) path += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { size: modules.size, path };
  });

  protected async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* navegador sem permissão para a área de transferência */
    }
  }
}
