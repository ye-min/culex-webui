import { Component, Input } from '@angular/core';
import { FeedDisplayItem } from '../../models/feed-item.model';

@Component({
  selector: 'app-feed-row',
  templateUrl: './feed-row.component.html',
  styleUrls: ['./feed-row.component.css']
})
export class FeedRowComponent {
  @Input() item!: FeedDisplayItem;

  getRemainingCount(item: FeedDisplayItem): number {
    const shown = Math.min(item.coverImages?.length ?? 0, 5);
    return (item.photoCount ?? 0) - shown;
  }
}
