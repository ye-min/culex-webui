import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { PhotoAlbum } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  album$: Observable<PhotoAlbum | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private feedData: FeedDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.album$ = this.feedData.getPhotoAlbumById(id).pipe(
      catchError(() => of(null))
    ) as Observable<PhotoAlbum | null>;
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }
}
