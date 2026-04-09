import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { marked } from 'marked';
import { FeedDataService } from '../../core/services/feed-data.service';
import { AiChat } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-ai-detail',
  templateUrl: './ai-detail.component.html',
  styleUrls: ['./ai-detail.component.css']
})
export class AiDetailComponent implements OnInit {
  chat$: Observable<AiChat | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.chat$ = this.feedData.getAiChatById(id).pipe(
      catchError(() => of(null))
    ) as Observable<AiChat | null>;
  }

  renderMessage(content: string): SafeHtml {
    if (!content) return '';
    
    // 1. Fix for CJK punctuation + markdown symbols
    let processed = content
      .replace(/([^\x00-\xff])([\*_]{1,2})/g, '$1\u200b$2')
      .replace(/([\*_]{1,2})([^\x00-\xff])/g, '$1\u200b$2');

    // 2. Simple LaTeX support ($...$ and $$...$$)
    // Note: We do this by temporary placeholders to avoid marked escaping TeX symbols
    const mathBlocks: string[] = [];
    processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
      const idx = mathBlocks.length;
      mathBlocks.push((window as any).katex.renderToString(tex, { displayMode: true, throwOnError: false }));
      return `:::MATH_BLOCK_${idx}:::`;
    });
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, tex) => {
      const idx = mathBlocks.length;
      mathBlocks.push((window as any).katex.renderToString(tex, { displayMode: false, throwOnError: false }));
      return `:::MATH_BLOCK_${idx}:::`;
    });

    // 3. Parse Markdown
    let html = marked.parse(processed) as string;

    // 4. Restore Math
    html = html.replace(/:::MATH_BLOCK_(\d+):::/g, (match, idx) => mathBlocks[parseInt(idx)]);

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/ai'], { queryParams: { tags: tag } });
  }
}
