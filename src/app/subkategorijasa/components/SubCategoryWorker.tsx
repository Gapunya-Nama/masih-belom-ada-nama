// src/components/SubCategoryWorker.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Star } from "lucide-react";
import { Pekerja, SubCategory, SesiLayanan } from "@/lib/dataType/interfaces";
import { useAuth } from "@/context/auth-context";

interface Props {
  subcategory: SubCategory;
  pekerja: Pekerja[] | null;
  sesilayanan: SesiLayanan[] | null;
}

export default function SubCategoryWorker({ subcategory, pekerja, sesilayanan }: Props) {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);

  // Tentukan apakah pengguna sudah tergabung sebagai pekerja
  const isUserJoined = pekerja?.some(worker => worker.pekerjaid === user?.id);

  const handleJoin = async () => {
    // Implementasi logika bergabung sebagai pekerja
    // Setelah berhasil, setIsJoined(true);
  };

  // Jika data 'pekerja' masih null, tampilkan loader atau kosong
  if (pekerja === null) {
    return <div>Loading pekerja...</div>; // Atau spinner loader
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#2ECC71] mb-2">{subcategory.nama}</h1>
            <p className="text-gray-600 mb-4">{subcategory.deskripsi}</p>
            <div className="inline-block bg-[#F3F3F3] px-4 py-2 rounded-full">
              <span className="text-gray-700">{subcategory.namakategori}</span>
            </div>
          </div>
          {/* Kondisikan render tombol hanya jika pengguna belum tergabung */}
          {!isUserJoined && (
            <Button
              onClick={handleJoin}
              className="bg-[#2ECC71] hover:bg-[#27AE60]"
            >
              Bergabung Sebagai Pekerja
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pekerja Tergabung</h2>
          <div className="space-y-4">
            {pekerja.length > 0 ? (
              pekerja.map((worker) => (
                <Link href={`/profile/${worker.pekerjaid}`} key={worker.pekerjaid}>
                  <Card
                    className={`p-4 hover:shadow-md transition-shadow cursor-pointer mb-4 ${
                      user?.id === worker.pekerjaid ? 'bg-yellow-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-[#F3F3F3] flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{worker.namapekerja}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm">{worker.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({worker.completedjobs} pekerjaan selesai)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Tidak ada pekerja untuk kategori ini
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Sesi Layanan Tersedia</h2>
          <div className="space-y-4">
            {sesilayanan && sesilayanan.map((session) => (
              <Card key={session.id} className="p-4">
                <div>
                  <h3 className="font-semibold">Sesi Layanan {session.sesi}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[#2ECC71] font-semibold mt-2">
                      Rp {session.harga}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Testimoni Pelanggan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Testimoni Pelanggan dapat diaktifkan kembali jika diperlukan */}
        </div>
      </div>
    </div>
  );
}