import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { MarkdownRenderService } from '../../core/services/markdown-render.service';
import { AiChat } from '../../shared/models/feed-item.model';
import { LoadingState } from '../../shared/models/loading-state.model';

@Component({
  selector: 'app-ai-detail',
  templateUrl: './ai-detail.component.html',
  styleUrls: ['./ai-detail.component.css']
})
export class AiDetailComponent implements OnInit {
  state$: Observable<LoadingState<AiChat>>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService,
    private renderService: MarkdownRenderService
  ) {
    this.state$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) return of({ loading: false, data: null });
        return this.feedData.getAiChatById(id).pipe(
          map(chat => ({ loading: false, data: chat })),
          catchError(() => of({ loading: false, data: null }))
        ).pipe(startWith({ loading: true }));
      })
    );
  }

  ngOnInit(): void {}

  renderMessage(content: string): SafeHtml {
    return this.renderService.render(content);
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/ai'], { queryParams: { tags: tag } });
  }
}
