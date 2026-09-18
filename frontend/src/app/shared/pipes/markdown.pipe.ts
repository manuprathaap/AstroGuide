import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    let html = value
      // Escape basic HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings (### H3, ## H2, # H1)
    html = html.replace(/^### (.*$)/gim, '<h4 class="md-h3">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="md-h2">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="md-h1">$1</h2>');

    // Bold text (**bold** or __bold__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic (*italic* or _italic_)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet lists (- item or * item)
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="md-li">$1</li>');
    html = html.replace(/(<li class="md-li">.*<\/li>)/gms, '<ul class="md-ul">$1</ul>');

    // Numbered lists (1. item)
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="md-oli">$1</li>');

    // Paragraphs (double newlines)
    const paragraphs = html.split(/\n{2,}/);
    html = paragraphs
      .map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<li')) {
          return p;
        }
        return `<p class="md-p">${p.replace(/\n/g, '<br/>')}</p>`;
      })
      .filter(p => p.length > 0)
      .join('\n');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
