'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SubCategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  const { id } = params;
  const subcategory = subcategories.find((s) => s.id === id);

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
    return <div className="pt-16"><SubCategoryWorker subcategory={subcategory} /></div>;
  } else if (user.role === 'user') {
    return <SubCategoryUser subcategory={subcategory} />;
  }
}