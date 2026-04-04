import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { ArticleIndex } from '../../shared/models/feed-item.model';

interface ArticleViewModel {
  meta: ArticleIndex;
  html: SafeHtml;
}

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article$: Observable<ArticleViewModel | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private feedData: FeedDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('id');
    if (!slug) return;

    this.article$ = this.feedData.getArticleBySlug(slug).pipe(
      map(({ meta, content }) => ({
        meta,
        html: this.sanitizer.bypassSecurityTrustHtml(this.markdownToHtml(content))
      })),
      catchError(() => of(null))
    );
  }

  private markdownToHtml(md: string): string {
    return md
      .split(/\n{2,}/)
      .map((block) => {
        const b = block.trim();
        if (!b) return '';
        if (b.startsWith('## ')) return `<h2>${b.slice(3)}</h2>`;
        if (b.startsWith('# '))  return `<h1>${b.slice(2)}</h1>`;
        if (b.startsWith('> '))  return `<blockquote>${b.slice(2)}</blockquote>`;
        if (b.startsWith('```')) return `<pre><code>${b.replace(/```\w*\n?/, '').replace(/```$/, '')}</code></pre>`;
        // inline: **bold**, *italic*
        const inline = b
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>');
        return `<p>${inline}</p>`;
      })
      .join('\n');
  }
}
