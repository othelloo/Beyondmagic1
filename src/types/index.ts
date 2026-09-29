export interface PhotoItem {
  id: string;
  title: string;
  category: 'production' | 'behind_the_scenes';
  image: string;
  caption: string;
  venueOrContext: string;
  year?: string;
  role?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: 'opera' | 'composition' | 'teaching';
  duration?: string;
  thumbnail?: string;
  description: string;
  tags?: string[];
  featured?: boolean;
  youtubeUrl?: string; // e.g. 'https://www.youtube.com/watch?v=...' or 'https://youtu.be/...'
  youtubeId?: string;  // or just the 11-character video ID
}

export interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  audience: string;
  format: string;
  description: string;
  syllabus: string[];
  takeaways: string[];
}
