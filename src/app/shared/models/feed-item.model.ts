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
  
  // existing preview fields
  excerpt?: string;
  photos?: PhotoThumb[];
  photoCount?: number;
  aiExchange?: AiLine[];

  // detailed view fields
  content?: string; // HTML/Markdown string for writing
  fullPhotos?: { src: string, alt: string, gridClass?: string }[]; // array of full res photos
  fullExchange?: { role: string, text: string }[]; // Full chat transcript
}
