'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { use } from 'react';
import { useEffect } from 'react';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: 'worker' | 'user' }>;
}

export default function SubCategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  const { user } = useAuth();
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);
  const subcategory = subcategories.find((s) => s.id === params.id);
  const isWorkerView = searchParams.view === 'worker';

  useEffect(() => {
    if (user != null && user.role != 'worker' && user.role != 'user') {
      toast({
        title: `Error`,
        description: `Anda perlu login untuk mengakses halaman ini.`,
      });
    }
  }, [user]);

  if (!subcategory) {
    return <div>Subkategori tidak ditemukan</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (user.role === 'worker') {
    return <SubCategoryWorker subcategory={subcategory} />;
  } else if (user.role === 'user') {
    return <SubCategoryUser subcategory={subcategory} />;
  }
}