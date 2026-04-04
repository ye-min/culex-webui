import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedDataService } from '../../core/services/feed-data.service';
import { FeedItem } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-ai-detail',
  templateUrl: './ai-detail.component.html',
  styleUrls: ['./ai-detail.component.css']
})
export class AiDetailComponent implements OnInit {
  item: FeedItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.item = this.feedService.getItemByLink(`/ai/${id}`);
    }
  }
}
