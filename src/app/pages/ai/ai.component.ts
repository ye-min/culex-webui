import { Component } from '@angular/core';
import { FeedItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent {
  feedItems: FeedItem[];

  constructor(private feedData: FeedDataService) {
    this.feedItems = this.feedData.getItemsByType('ai');
  }

  trackByLink(index: number, item: FeedItem): string {
    return item.link;
  }
}
