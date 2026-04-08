import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FeedDisplayItem } from '../../models/feed-item.model';

@Component({
  selector: 'app-feed-row',
  templateUrl: './feed-row.component.html',
  styleUrls: ['./feed-row.component.css']
})
export class FeedRowComponent {
  @Input() item!: FeedDisplayItem;

  constructor(private sanitizer: DomSanitizer) {}

  getRemainingCount(item: FeedDisplayItem): number {
    const shown = Math.min(item.coverImages?.length ?? 0, 5);
    return (item.photoCount ?? 0) - shown;
  }

  renderMarkdown(content: string | undefined): SafeHtml {
    if (!content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(content) as string);
  }
}
