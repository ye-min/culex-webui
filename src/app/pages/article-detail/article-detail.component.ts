import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { marked } from 'marked';
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
        html: this.sanitizer.bypassSecurityTrustHtml(marked.parse(content) as string)
      })),
      catchError(() => of(null))
    );
  }
}
