/** 统一的 feed 列表显示项（由各类型索引派生） */
export interface FeedDisplayItem {
  date: string;
  type: 'writing' | 'photo' | 'ai';
  title: string;
  link: string;
  excerpt?: string;                      // 文章简介（HTML）
  tags?: string[];                       // 文章标签
  coverImages?: string[];                // 照片封面组（方图）
  photoCount?: number;                   // 相册总张数
  aiPreview?: { q: string; a: string };  // AI 对话预览
}

/** data/writing.json 中每条记录的结构 */
export interface WritingIndex {
  date: string;
  title: string;
  excerpt?: string;
  tags?: string[];  // e.g. ["AI", "编程"]
  file: string; // e.g. "assets/content/articles/my-article.md"
}

/** data/photo.json 中相册内的单张照片 */
export interface PhotoItem {
  file: string;
  caption: string;
}

/** data/photo.json 中相册内的照片分组 */
export interface PhotoGroup {
  type: 'column' | 'row';  // column: 两列流布局，row: 单列全宽
  photos: PhotoItem[];
}

/** data/photo.json 中每条相册记录的结构 */
export interface PhotoAlbum {
  id: string;
  title: string;
  date: string;
  tags?: string[];
  cover: string | string[]; // 单张封面或多张封面
  groups: PhotoGroup[];
}

/** data/ai-chats.json 中每条记录的结构 */
export interface AiChatIndex {
  id: string;
  title: string;
  date: string;
  tags?: string[];
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
  tags?: string[];
  messages: ChatMessage[];
}
