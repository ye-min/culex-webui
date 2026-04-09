import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { marked } from 'marked';
import { FeedDataService } from '../../core/services/feed-data.service';
import { WritingIndex } from '../../shared/models/feed-item.model';

interface ArticleViewModel {
  meta: WritingIndex;
  html: SafeHtml;
}

@Component({
  selector: 'app-writing-detail',
  templateUrl: './writing-detail.component.html',
  styleUrls: ['./writing-detail.component.css']
})
export class WritingDetailComponent implements OnInit {
  article$: Observable<ArticleViewModel | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('id');
    if (!slug) return;

    this.article$ = this.feedData.getArticleBySlug(slug).pipe(
      map(({ meta, content }) => {
        // 1. Fix for CJK punctuation + markdown symbols:
        let processed = content
          .replace(/([^\x00-\xff])([\*_]{1,2})/g, '$1\u200b$2')
          .replace(/([\*_]{1,2})([^\x00-\xff])/g, '$1\u200b$2');
          
        // 2. Simple LaTeX support ($...$ and $$...$$)
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
        let html = (marked.parse(processed) as string)
          .replace(/<table>/g, '<div class="table-scroll"><table>')
          .replace(/<\/table>/g, '</table></div>');

        // 4. Restore Math
        html = html.replace(/:::MATH_BLOCK_(\d+):::/g, (match, idx) => mathBlocks[parseInt(idx)]);

        return {
          meta,
          html: this.sanitizer.bypassSecurityTrustHtml(html)
        };
      }),
      catchError(() => of(null))
    );
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/writing'], { queryParams: { tags: tag } });
  }
}
