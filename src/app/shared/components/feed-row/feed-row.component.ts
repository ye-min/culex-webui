import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FeedDisplayItem } from '../../models/feed-item.model';

@Component({
  selector: 'app-feed-row',
  templateUrl: './feed-row.component.html',
  styleUrls: ['./feed-row.component.css']
})
export class FeedRowComponent implements OnInit, OnDestroy {
  @Input() item!: FeedDisplayItem;
  
  activeTags = new Set<string>();
  private sub?: Subscription;

  constructor(
    private sanitizer: DomSanitizer, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      const tagsParam = params.get('tags') || params.get('tag');
      if (tagsParam) {
        this.activeTags = new Set(tagsParam.split(','));
      } else {
        this.activeTags.clear();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getRemainingCount(item: FeedDisplayItem): number {
    const shown = Math.min(item.coverImages?.length ?? 0, 5);
    return (item.photoCount ?? 0) - shown;
  }

  renderMarkdown(content: string | undefined): SafeHtml {
    if (!content) return '';
    
    // 1. Fix for CJK punctuation + markdown symbols
    let processed = content
      .replace(/([^\x00-\xff])([\*_]{1,2})/g, '$1\u200b$2')
      .replace(/([\*_]{1,2})([^\x00-\xff])/g, '$1\u200b$2');

    // 2. Simple LaTeX support ($...$ and $$...$$)
    const mathBlocks: string[] = [];
    processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
      const idx = mathBlocks.length;
      mathBlocks.push((window as any).katex.renderToString(tex, { displayMode: true, throwOnError: false }));
      return `:::MATH_BLOCK_${idx}:::`;
    });
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, tex) => {
      const idx = mathBlocks.length;
      mathBlocks.push((window as any).katex.renderToString(tex, { displayMode: false, throwOnError: false }));
      return `:::MATH_BLOCK_${idx}:::`;
    });

    // 3. Parse Markdown
    let html = marked.parse(processed) as string;

    // 4. Restore Math
    html = html.replace(/:::MATH_BLOCK_(\d+):::/g, (match, idx) => mathBlocks[parseInt(idx)]);

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  navigateToTag(tag: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const tree = this.router.parseUrl(this.router.url);
    const path = tree.root.children['primary']?.segments.map(s => s.path).join('/') || '';
    const targetPath = this.item.type;
    
    if (path === targetPath) {
      const params = tree.queryParams;
      const tagsParam = params['tags'] || params['tag'];
      let currentSet = new Set<string>(tagsParam ? tagsParam.split(',') : []);
      
      if (currentSet.has(tag)) {
        currentSet.delete(tag);
      } else {
        currentSet.add(tag);
      }
      
      const queryParams: any = { tag: null };
      if (currentSet.size > 0) {
        queryParams['tags'] = Array.from(currentSet).join(',');
      } else {
        queryParams['tags'] = null;
      }
      this.router.navigate([`/${targetPath}`], { queryParams, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate([`/${targetPath}`], { queryParams: { tags: tag } });
    }
  }

  navigateToType(type: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const route = `/${type}`;
    this.router.navigate([route]);
  }
}
