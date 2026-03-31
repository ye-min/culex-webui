import { Component } from '@angular/core';
import { FeedItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  feedItems: FeedItem[];

  constructor(private feedData: FeedDataService) {
    this.feedItems = this.feedData.getAllItems();
  }

  trackByLink(index: number, item: FeedItem): string {
    return item.link;
  }
}
