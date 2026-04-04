import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedDisplayItem } from '../../shared/models/feed-item.model';
import { FeedDataService } from '../../core/services/feed-data.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  feedItems$: Observable<FeedDisplayItem[]>;

  constructor(private feedData: FeedDataService) {
    this.feedItems$ = this.feedData.getPhotoFeedItems();
  }

  trackByLink(_index: number, item: FeedDisplayItem): string {
    return item.link;
  }
}
