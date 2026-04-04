import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedDisplayItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.css']
})
export class WritingComponent {
  feedItems$: Observable<FeedDisplayItem[]>;

  constructor(private feedData: FeedDataService) {
    this.feedItems$ = this.feedData.getWritingFeedItems();
  }

  trackByLink(_index: number, item: FeedDisplayItem): string {
    return item.link;
  }
}
