'use client';
import { subcategories } from '../data/subcategories';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SubCategory } from '@/lib/dataType/interfaces';


export const getSubkategori = async (
  name: string
): Promise<SubCategory> => {
  try {

    const response = await fetch("/api/subcategorijasa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid credentials');
    }


    const subkategori = await response.json();

    console.log("Ini adalah respons server untuk subkategori: ", subkategori);

    return subkategori;


  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};




export default function SubCategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  const { name } = params;
  const [subcategory, setSubcategory] = useState<SubCategory>();
  // const subcategory = subcategories.find((s) => s.id === id);

  useEffect(() => {
    const fetchSubcategory = async () => {
      const fetchedsubcategory = await getSubkategori(name as string);
      setSubcategory(fetchedsubcategory);
    };

    fetchSubcategory();
  });

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