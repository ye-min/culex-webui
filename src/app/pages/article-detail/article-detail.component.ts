import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedDataService } from '../../core/services/feed-data.service';
import { FeedItem } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  item: FeedItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.item = this.feedService.getItemByLink(`/writing/${id}`);
    }
  }
}
