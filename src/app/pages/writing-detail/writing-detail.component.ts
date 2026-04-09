import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { MarkdownRenderService } from '../../core/services/markdown-render.service';
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
    private renderService: MarkdownRenderService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('id');
    if (!slug) return;

    this.article$ = this.feedData.getArticleBySlug(slug).pipe(
      map(({ meta, content }) => {
        return {
          meta,
          html: this.renderService.render(content)
        };
      }),
      catchError(() => of(null))
    );
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/writing'], { queryParams: { tags: tag } });
  }
}
