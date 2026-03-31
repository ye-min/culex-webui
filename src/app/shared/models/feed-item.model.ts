export interface PhotoThumb {
  type: 'wide' | 'sq';
  src?: string;
}

export interface AiLine {
  role: 'q' | 'a';
  text: string;
}

export interface FeedItem {
  date: string;
  type: 'writing' | 'photo' | 'ai';
  title: string;
  link: string;
  excerpt?: string;
  photos?: PhotoThumb[];
  photoCount?: number;
  aiExchange?: AiLine[];
}
