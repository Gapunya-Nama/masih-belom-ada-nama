'use client';

import { useEffect, useState, useRef } from "react";
import SubCategoryUser from '../components/SubCategoryUser';
import SubCategoryWorker from '../components/SubCategoryWorker';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/hooks/use-toast';
import { useParams } from 'next/navigation';
import { Pekerja, SesiLayanan, SubCategory, MetodeBayar } from '@/lib/dataType/interfaces';
import { getSubkategori } from './getSubkategori';

export default function SubCategoryPage() {
  const { user } = useAuth();
  const params = useParams();
  let { name } = params;
  const [subcategory, setSubcategory] = useState<SubCategory>();
  const [pekerja, setPekerja] = useState<Pekerja[] | null>(null);  
  const [sesilayanan, setSesilayanan] = useState<SesiLayanan[] | null>(null);
  const [metodePembayaran, setMetodePembayaran] = useState<MetodeBayar[]>([]);
  const [loadingMetode, setLoadingMetode] = useState<boolean>(false);
  const [errorMetode, setErrorMetode] = useState<string | null>(null);
  const categoryId = subcategory?.idkategori;
  const subcategoryID = subcategory?.id;

  // Ref untuk mencegah panggilan ganda di React.StrictMode
  const isFetchedPekerja = useRef(false);

  if (typeof name !== "string") {
    return <div>Subkategori tidak valid</div>;
  }

  const decodedName = decodeURIComponent(name);
  console.log("ini url", decodedName);

  // Fetch Subcategory
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const fetchedsubcategory = await getSubkategori(decodedName as string);
        setSubcategory(fetchedsubcategory);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };
    fetchSubcategory();
  }, [decodedName]);

  // Fetch Pekerja
  useEffect(() => {
    if (!categoryId || isFetchedPekerja.current) {
      return; // Hentikan jika categoryId tidak ada atau sudah dipanggil
    }

    const fetchPekerja = async () => {
      try {
        console.log("Fetching pekerja for categoryId:", categoryId);
        const response = await fetch("/api/pekerja", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: categoryId, command: 'show' }),
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pekerja");
        }

        const data: Pekerja[] = await response.json();
        setPekerja(data);
      } catch (error) {
        console.error("Error fetching pekerja:", error);
      } finally {
        isFetchedPekerja.current = true; // Tandai sudah dipanggil
      }
    };

    fetchPekerja();
  }, [categoryId]);

  // Fetch Sesi Layanan
  useEffect(() => {
    if (!subcategoryID) return;

    const fetchSesiLayanan = async () => {
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

  // Validasi User Role
  useEffect(() => {
    if (user != null && user.role !== 'worker' && user.role !== 'user') {
      toast({
        title: `Error`,
        description: `Role pengguna tidak dikenali.`,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchMetodePembayaran = async () => {
      try {
        const response = await fetch("/api/metodebayar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengambil data metode pembayaran");
        }

        const data: MetodeBayar[] = await response.json();
        setMetodePembayaran(data);
      } catch (error: any) {
        console.error("Error fetching metode pembayaran:", error);
        setErrorMetode(error.message || "Gagal mengambil data metode pembayaran");
      } finally {
        setLoadingMetode(false);
      }
    };

    fetchMetodePembayaran();
  }, []);


  // Kondisi Render
  if (!subcategory) {
    return <div>Subkategori tidak ditemukan</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (user.role === 'worker') {
    return <SubCategoryWorker subcategory={subcategory} pekerja={pekerja} sesilayanan={sesilayanan}  />;
  } else if (user.role === 'user') {
    return <SubCategoryUser subcategory={subcategory} pekerja={pekerja} sesilayanan={sesilayanan} metodebayar={metodePembayaran} />;
  }

  return <div>Role pengguna tidak dikenali</div>;
}