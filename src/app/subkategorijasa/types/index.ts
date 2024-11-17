export interface ServiceSession {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
}

export interface Testimonial {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  sessions: ServiceSession[];
  workers: Worker[];
  testimonials: Testimonial[];
}