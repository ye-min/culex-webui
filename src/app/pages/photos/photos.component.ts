import { Component } from '@angular/core';
import { FeedItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  feedItems: FeedItem[];

  constructor(private feedData: FeedDataService) {
    this.feedItems = this.feedData.getItemsByType('photo');
  }

  trackByLink(index: number, item: FeedItem): string {
    return item.link;
  }
}
