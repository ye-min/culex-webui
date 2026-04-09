import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { MarkdownRenderService } from '../../core/services/markdown-render.service';
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
    private renderService: MarkdownRenderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.chat$ = this.feedData.getAiChatById(id).pipe(
      catchError(() => of(null))
    ) as Observable<AiChat | null>;
  }

  renderMessage(content: string): SafeHtml {
    return this.renderService.render(content);
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/ai'], { queryParams: { tags: tag } });
  }
}
