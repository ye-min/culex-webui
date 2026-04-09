import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { PhotoAlbum, PhotoItem } from '../../shared/models/feed-item.model';
import type { PhotoGroup } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  album$: Observable<PhotoAlbum | null> = of(null);

  lightboxPhoto: PhotoItem | null = null;
  lightboxIndex: number = 0;
  lightboxTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.album$ = this.feedData.getPhotoAlbumById(id).pipe(
      catchError(() => of(null))
    ) as Observable<PhotoAlbum | null>;
  }

  getTotalPhotos(album: PhotoAlbum): number {
    return album.groups.reduce((sum, g) => sum + g.photos.length, 0);
  }

  getGroupOffset(album: PhotoAlbum, groupIndex: number): number {
    return album.groups.slice(0, groupIndex).reduce((sum, g) => sum + g.photos.length, 0);
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
    if (img.naturalWidth / img.naturalHeight > 2) {
      img.closest('.gallery-item')?.classList.add('wide');
    }
  }

  openLightbox(photo: PhotoItem, index: number, total: number): void {
    this.lightboxPhoto = photo;
    this.lightboxIndex = index;
    this.lightboxTotal = total;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxPhoto = null;
    document.body.style.overflow = '';
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.closeLightbox();
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/photo'], { queryParams: { tags: tag } });
  }
}
