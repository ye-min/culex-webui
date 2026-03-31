import { Component } from '@angular/core';
import { FeedItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css']
})
export class WritingComponent {
  feedItems: FeedItem[];

  constructor(private feedData: FeedDataService) {
    this.feedItems = this.feedData.getItemsByType('writing');
  }

  trackByLink(index: number, item: FeedItem): string {
    return item.link;
  }
}
