'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';


interface Props {
  params: { id: string };
  searchParams: { view?: 'worker' | 'user' };
}

export default function SubCategoryPage({ params, searchParams }: Props) {
  const { user } = useAuth();
  const subcategory = subcategories.find((s) => s.id === params.id);
  const isWorkerView = searchParams.view === 'worker';

  if (!subcategory) {
    return <div>Subkategori tidak ditemukan</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (user.role === 'worker') {
    return <SubCategoryWorker subcategory={subcategory} />;
  }
  else if (user.role === 'user') {
    return <SubCategoryUser subcategory={subcategory} />;
  }
  else {
    alert('You need to log in to access this page.');
    return null;
  }
}
