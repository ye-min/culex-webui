import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
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
  article$: Observable<ArticleViewModel | null | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService,
    private renderService: MarkdownRenderService
  ) {
    this.article$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => id ? this.feedData.getArticleBySlug(id).pipe(
        map(({ meta, content }) => ({
          meta,
          html: this.renderService.render(content)
        }))
      ) : of(null)),
      catchError(() => of(null))
    );
  }

  ngOnInit(): void {}

  navigateToTag(tag: string): void {
    this.router.navigate(['/writing'], { queryParams: { tags: tag } });
  }
}
