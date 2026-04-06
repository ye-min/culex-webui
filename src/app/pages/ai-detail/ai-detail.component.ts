import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(content) as string);
  }
}
