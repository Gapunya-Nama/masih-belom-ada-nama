import { subcategories } from '@/app/subkategorijasa/data/subcategories';
import { SubCategory } from '@/app/subkategorijasa/types/index';

// Define the Service type
interface Service {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

export const services: Service[] = [
  {
    id: 1,
    name: 'Kategori Jasa 1',
    subcategories: subcategories.filter(sub => sub.idKategori === '1'),
  },
  {
    id: 2,
    name: 'Kategori Jasa 2',
    subcategories: subcategories.filter(sub => sub.idKategori === '2'),
  },
  {
    id: 3,
    name: 'Kategori Jasa 3',
    subcategories: subcategories.filter(sub => sub.idKategori === '3'),
  },
];