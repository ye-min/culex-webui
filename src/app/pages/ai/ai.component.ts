import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedDisplayItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent {
  feedItems$: Observable<FeedDisplayItem[]>;

  constructor(private feedData: FeedDataService) {
    this.feedItems$ = this.feedData.getAiFeedItems();
  }

  trackByLink(_index: number, item: FeedDisplayItem): string {
    return item.link;
  }
}
