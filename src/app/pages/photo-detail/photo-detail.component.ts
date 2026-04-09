import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { FeedDataService } from '../../core/services/feed-data.service';
import { PhotoAlbum, PhotoItem } from '../../shared/models/feed-item.model';
import type { PhotoGroup } from '../../shared/models/feed-item.model';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  album$: Observable<PhotoAlbum | null | undefined>;

  lightboxPhoto: PhotoItem | null = null;
  lightboxIndex: number = 0;
  lightboxTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private feedData: FeedDataService
  ) {
    this.album$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => id ? this.feedData.getPhotoAlbumById(id) : of(null)),
      catchError(() => of(null))
    );
  }

  ngOnInit(): void {}

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
