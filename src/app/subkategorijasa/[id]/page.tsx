import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';

export function generateStaticParams() {
  return subcategories.map((subcategory) => ({
    id: subcategory.id,
  }));
}

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

  return <SubCategoryWorker subcategory={subcategory} />;
}