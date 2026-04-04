import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedDataService } from '../../core/services/feed-data.service';
import { FeedItem } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  item: FeedItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.item = this.feedService.getItemByLink(`/photos/${id}`);
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  onImageError(event: any, altText: string) {
    event.target.style.display = 'none';
    event.target.parentElement.classList.add('broken-img');
    event.target.parentElement.innerHTML = '<span class="alt-text">' + altText + '</span>';
  }
}
