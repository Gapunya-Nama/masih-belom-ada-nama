'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
<<<<<<< HEAD
import { use } from 'react';
import { useEffect } from 'react';
=======
import { useRouter } from "next/navigation";

>>>>>>> 6e8b4a12f77fe4b5e7e1f9908a5dc04dfec5e4f8

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: 'worker' | 'user' }>;
}

export default function SubCategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  const { user } = useAuth();
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);
  const subcategory = subcategories.find((s) => s.id === params.id);
  const router = useRouter();
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
    return <div className="pt-16"><SubCategoryWorker subcategory={subcategory} /></div>;
  } else if (user.role === 'user') {
<<<<<<< HEAD
    return <SubCategoryUser subcategory={subcategory} />;
  }
=======
    return <div className="pt-16"><SubCategoryUser subcategory={subcategory} /></div>;
  } else {
    toast({
      title: `Error`,
      description: `Anda perlu login untuk mengakses halaman ini.`,
    });
    router.push("/login")
 }
>>>>>>> 6e8b4a12f77fe4b5e7e1f9908a5dc04dfec5e4f8
}