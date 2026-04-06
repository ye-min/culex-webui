import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  FeedDisplayItem,
  ArticleIndex,
  PhotoAlbum,
  PhotoGroup,
  AiChatIndex,
  AiChat,
} from '../../shared/models/feed-item.model';

@Injectable({ providedIn: 'root' })
export class FeedDataService {
  constructor(private http: HttpClient) {}

  getArticles(): Observable<ArticleIndex[]> {
    return this.http.get<ArticleIndex[]>('data/articles.json');
  }

  getPhotoAlbums(): Observable<PhotoAlbum[]> {
    return this.http.get<PhotoAlbum[]>('data/photos.json');
  }

  getAiChatList(): Observable<AiChatIndex[]> {
    return this.http.get<AiChatIndex[]>('data/ai-chats.json');
  }

  /** 全部内容合并后按日期倒序，用于首页 feed */
  getAllFeedItems(): Observable<FeedDisplayItem[]> {
    return combineLatest([
      this.getArticles(),
      this.getPhotoAlbums(),
      this.getAiChatList(),
    ]).pipe(
      map(([articles, albums, chats]) => {
        const items: FeedDisplayItem[] = [
          ...articles.map((a) => ({
            date: a.date,
            type: 'writing' as const,
            title: a.title,
            link: `/writing/${this.slugFromFile(a.file)}`,
            excerpt: a.excerpt,
          })),
          ...albums.map((a) => ({
            date: a.date,
            type: 'photo' as const,
            title: a.title,
            link: `/photos/${a.id}`,
            coverImages: Array.isArray(a.cover) ? a.cover : [a.cover],
            photoCount: a.groups.reduce((sum: number, g: PhotoGroup) => sum + g.photos.length, 0),
          })),
          ...chats.map((c) => ({
            date: c.date,
            type: 'ai' as const,
            title: c.title,
            link: `/ai/${c.id}`,
            aiPreview: c.preview,
          })),
        ];
        return items.sort((a, b) => b.date.localeCompare(a.date));
      })
    );
  }

  getWritingFeedItems(): Observable<FeedDisplayItem[]> {
    return this.getArticles().pipe(
      map((articles) =>
        articles.map((a) => ({
          date: a.date,
          type: 'writing' as const,
          title: a.title,
          link: `/writing/${this.slugFromFile(a.file)}`,
          excerpt: a.excerpt,
        }))
      )
    );
  }

  getPhotoFeedItems(): Observable<FeedDisplayItem[]> {
    return this.getPhotoAlbums().pipe(
      map((albums) =>
        albums.map((a) => ({
          date: a.date,
          type: 'photo' as const,
          title: a.title,
          link: `/photos/${a.id}`,
          coverImages: Array.isArray(a.cover) ? a.cover : [a.cover],
            photoCount: a.groups.reduce((sum: number, g: PhotoGroup) => sum + g.photos.length, 0),
        }))
      )
    );
  }

  getAiFeedItems(): Observable<FeedDisplayItem[]> {
    return this.getAiChatList().pipe(
      map((chats) =>
        chats.map((c) => ({
          date: c.date,
          type: 'ai' as const,
          title: c.title,
          link: `/ai/${c.id}`,
          aiPreview: c.preview,
        }))
      )
    );
  }

  /** 根据 slug 加载文章元数据 + Markdown 内容 */
  getArticleBySlug(slug: string): Observable<{ meta: ArticleIndex; content: string }> {
    return this.getArticles().pipe(
      switchMap((articles) => {
        const meta = articles.find((a) => this.slugFromFile(a.file) === slug);
        if (!meta) {
          throw new Error(`Article not found: ${slug}`);
        }
        return this.http
          .get(meta.file, { responseType: 'text' })
          .pipe(map((content) => ({ meta, content })));
      })
    );
  }

  /** 根据 id 加载相册（相册完整数据已在索引中） */
  getPhotoAlbumById(id: string): Observable<PhotoAlbum | undefined> {
    return this.getPhotoAlbums().pipe(
      map((albums) => albums.find((a) => a.id === id))
    );
  }

  /** 读取当天的每日词条，无匹配时取最后一条 */
  getDailyWord(): Observable<string> {
    return this.http.get<{ date: string; word: string }[]>('data/daily-words.json').pipe(
      map(entries => {
        const today = new Date().toISOString().slice(0, 10);
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const past = sorted.filter(e => e.date <= today);
        return past.length > 0
          ? past[past.length - 1].word
          : sorted[sorted.length - 1].word;
      })
    );
  }

  /** 根据 id 加载完整对话内容 */
  getAiChatById(id: string): Observable<AiChat> {
    return this.getAiChatList().pipe(
      switchMap((list) => {
        const entry = list.find((c) => c.id === id);
        if (!entry) {
          throw new Error(`AI chat not found: ${id}`);
        }
        return this.http.get<AiChat>(entry.file);
      })
    );
  }

  private slugFromFile(file: string): string {
    return file.replace('assets/content/articles/', '').replace('.md', '');
  }
}
