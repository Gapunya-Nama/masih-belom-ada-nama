'use client';
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Pekerja, SesiLayanan, SubCategory } from '@/lib/dataType/interfaces';
import { getSubkategori } from './getSubkategori';


export default function SubCategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  let { name } = params;
  const [subcategory, setSubcategory] = useState<SubCategory>();
  const [pekerja, setPekerja] = useState<Pekerja[] | null>(null);  
  const [sesilayanan, setSesilayanan] = useState<SesiLayanan[] | null>(null);
  const categoryId = subcategory?.idkategori;
  const subcategoryID = subcategory?.id;
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
    const fetchPekerja = async () => {
      try {
        const response = await fetch("/api/pekerja", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: categoryId }),
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pekerja");
        }

        const data: Pekerja[] = await response.json();
        setPekerja(data);
      } catch (error) {
        console.error("Error fetching pekerja:", error);
      }
    };

    fetchPekerja();
  }, [categoryId]);

  useEffect(() => {
    const fetchSesiLayanan = async () => {
      if (!categoryId) return;

      try {
        const response = await fetch("/api/sesilayanan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subkategoriId: subcategoryID }),
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data sesi layanan");
        }

        const data: SesiLayanan[] = await response.json();
        setSesilayanan(data);
      } catch (error) {
        console.error("Error fetching sesi layanan:", error);
      }
    };

    fetchSesiLayanan();
  }, [subcategoryID]);

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
    return <SubCategoryUser subcategory={subcategory} pekerja={pekerja} sesilayanan={sesilayanan} />;
  }
}