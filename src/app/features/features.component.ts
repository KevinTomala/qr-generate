import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  currentYear = new Date().getFullYear();
url = '';
  title = '';
  size = 256;
  private _dataUrl = signal<string | null>(null);

  dataUrl = computed(() => this._dataUrl());

  private isValidUrl(u: string) {
    try { new URL(u); return true; } catch { return false; }
  }

  async generate() {
    const clean = this.url.trim();
    if (!this.isValidUrl(clean)) {
      alert('Ingresa un enlace válido de Google Drive.');
      return;
    }
    try {
      // Genera un DataURL PNG del QR
      const data = await QRCode.toDataURL(clean, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: this.size
      });
      this._dataUrl.set(data);
    } catch (e) {
      console.error(e);
      alert('No se pudo generar el QR.');
    }
  }

  clear() {
    this.url = '';
    this.title = '';
    this._dataUrl.set(null);
  }

  downloadPng() {
    const d = this._dataUrl();
    if (!d) return;
    const a = document.createElement('a');
    const name = (this.title || 'qr-drive').replace(/\s+/g, '_');
    a.href = d;
    a.download = `${name}.png`;
    a.click();
  }

  print() {
    const d = this._dataUrl();
    if (!d) return;
    const w = window.open('', '_blank');
    const titleHtml = this.title
      ? `<div style="font:600 16px Inter, Arial; margin-top:8px; text-align:center;">${this.title}</div>`
      : '';
    w!.document.write(`
      <!DOCTYPE html><html><head><title>Imprimir QR</title></head>
      <body style="display:grid;place-items:center;margin:40px;">
        <div style="display:grid;justify-items:center;">
          <img src="${d}" alt="QR" style="width:70mm;height:70mm;"/>
          ${titleHtml}
        </div>
        <script>window.onload = () => setTimeout(() => window.print(), 200);<\/script>
      </body></html>
    `);
    w!.document.close();
  }
}

