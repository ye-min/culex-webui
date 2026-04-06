/** 统一的 feed 列表显示项（由各类型索引派生） */
export interface FeedDisplayItem {
  date: string;
  type: 'writing' | 'photo' | 'ai';
  title: string;
  link: string;
  excerpt?: string;                      // 文章简介（HTML）
  coverImages?: string[];                // 照片封面组（方图）
  photoCount?: number;                   // 相册总张数
  aiPreview?: { q: string; a: string };  // AI 对话预览
}

/** data/articles.json 中每条记录的结构 */
export interface ArticleIndex {
  date: string;
  title: string;
  excerpt?: string;
  file: string; // e.g. "assets/content/articles/my-article.md"
}

/** data/photos.json 中相册内的单张照片 */
export interface PhotoItem {
  file: string;
  caption: string;
}

/** data/photos.json 中相册内的照片分组 */
export interface PhotoGroup {
  type: 'column' | 'row';  // column: 两列流布局，row: 单列全宽
  photos: PhotoItem[];
}

/** data/photos.json 中每条相册记录的结构 */
export interface PhotoAlbum {
  id: string;
  title: string;
  date: string;
  cover: string | string[]; // 单张封面或多张封面
  groups: PhotoGroup[];
}

/** data/ai-chats.json 中每条记录的结构 */
export interface AiChatIndex {
  id: string;
  title: string;
  date: string;
  preview?: { q: string; a: string };
  file: string; // e.g. "assets/content/ai-chats/chat-001.json"
}

/** assets/content/ai-chats/<id>.json 中的单条消息 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** assets/content/ai-chats/<id>.json 的完整结构 */
export interface AiChat {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}
