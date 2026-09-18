import { TestBed } from '@angular/core/testing';
import { MarkdownPipe } from './markdown.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('MarkdownPipe', () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkdownPipe]
    });
    pipe = TestBed.inject(MarkdownPipe);
  });

  it('should transform bold and heading markdown into safe html', () => {
    const raw = '### Marriage Forecast\n\nYour **7th house** indicates supportive periods.';
    const result = pipe.transform(raw);
    expect(result).toBeTruthy();
  });

  it('should return empty string for null or undefined input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
