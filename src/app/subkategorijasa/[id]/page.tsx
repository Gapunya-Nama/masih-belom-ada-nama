'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useRouter } from "next/navigation";


interface Props {
  params: { id: string };
  searchParams: { view?: 'worker' | 'user' };
}

export default function SubCategoryPage({ params, searchParams }: Props) {
  const { user } = useAuth();
  const subcategory = subcategories.find((s) => s.id === params.id);
  const router = useRouter();
  const isWorkerView = searchParams.view === 'worker';

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
  } else {
    toast({
      title: `Error`,
      description: `Anda perlu login untuk mengakses halaman ini.`,
    });
    router.push("/login")
 }
}