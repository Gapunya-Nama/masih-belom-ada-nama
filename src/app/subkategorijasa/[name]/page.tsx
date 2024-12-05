'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SubCategory } from '@/lib/dataType/interfaces';
import { getSubkategori } from './getSubkategori';


export default function SubCategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  let { name } = params;
  const [subcategory, setSubcategory] = useState<SubCategory>();
  // const subcategory = subcategories.find((s) => s.id === id);
  if (typeof name !== "string") {
    return <div>Subkategori tidak valid</div>;
  }

  const decodedName = decodeURIComponent(name);
  console.log("ini url", decodedName);

  useEffect(() => {
    const fetchSubcategory = async () => {
      const fetchedsubcategory = await getSubkategori(decodedName as string);
      setSubcategory(fetchedsubcategory);
    };
    fetchSubcategory();
  }, []);  

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