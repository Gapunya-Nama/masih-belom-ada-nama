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
  idKategori: string;
  id: string;
  name: string;
  description: string;
  categoryName: string;
  sessions: ServiceSession[];
  workers: Worker[];
  testimonials: Testimonial[];
}

export const subcategories: SubCategory[] = [
  {
    idKategori: '1',
    id: '1',
    name: 'Pembersihan Rumah',
    description: 'Layanan pembersihan rumah profesional untuk rumah yang bersih dan nyaman',
    categoryName: 'Kebersihan',
    sessions: [
      {
        id: '1',
        name: '2 Jam',
        price: 100000,
        description: 'Pembersihan dasar untuk rumah kecil'
      },
      {
        id: '2',
        name: '4 Jam',
        price: 180000,
        description: 'Pembersihan menyeluruh untuk rumah sedang'
      }
    ],
    workers: [
      {
        id: '1',
        name: 'Budi Santoso',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        rating: 4.8,
        completedJobs: 120
      }
    ],
    testimonials: [
      {
        id: '1',
        userName: 'Ahmad',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        rating: 5,
        comment: 'Pelayanan sangat memuaskan dan profesional',
        date: '2024-02-10'
      }
    ]
  },
  {
    idKategori: '1',
    id: '2',
    name: 'Pembersihan Kebun',
    description: 'Layanan pembersihan rumah profesional untuk rumah yang bersih dan nyaman',
    categoryName: 'Kebersihan',
    sessions: [
      {
        id: '1',
        name: '2 Jam',
        price: 100000,
        description: 'Pembersihan dasar untuk rumah kecil'
      },
      {
        id: '2',
        name: '4 Jam',
        price: 180000,
        description: 'Pembersihan menyeluruh untuk rumah sedang'
      }
    ],
    workers: [
      {
        id: '1',
        name: 'Budi Santoso',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        rating: 4.8,
        completedJobs: 120
      }
    ],
    testimonials: [
      {
        id: '1',
        userName: 'Ahmad',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        rating: 5,
        comment: 'Pelayanan sangat memuaskan dan profesional',
        date: '2024-02-10'
      }
    ]
  },
  {
    idKategori: '1',
    id: '3',
    name: 'Pangkas Rambut',
    description: 'Layanan pembersihan rumah profesional untuk rumah yang bersih dan nyaman',
    categoryName: 'Kebersihan',
    sessions: [
      {
        id: '1',
        name: 'Botak Licin',
        price: 100000,
        description: 'Pembersihan dasar untuk rumah kecil'
      },
      {
        id: '2',
        name: 'Mullet',
        price: 180000,
        description: 'Pembersihan menyeluruh untuk rumah sedang'
      }
    ],
    workers: [
      {
        id: '1',
        name: 'Budi Santoso',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        rating: 4.8,
        completedJobs: 120
      }
    ],
    testimonials: [
      {
        id: '1',
        userName: 'Ahmad',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        rating: 5,
        comment: 'Pelayanan sangat memuaskan dan profesional',
        date: '2024-02-10'
      }
    ]
  }
];