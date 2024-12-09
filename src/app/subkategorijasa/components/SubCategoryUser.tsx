import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import Link from 'next/link';
import { MetodeBayar, Pekerja, SesiLayanan, SubCategory } from '@/lib/dataType/interfaces';
import BookingModal from './BookingModal';
import TestimonialCards from '@/app/subkategorijasa/components/TestimonialCards';
import WorkerDetailModal from './WorkerDetailModal';

interface Props {
  subcategory: SubCategory;
  pekerja: Pekerja[] | null;
  sesilayanan: SesiLayanan[] | null;
  metodebayar: MetodeBayar[];
}

export default function SubCategoryUser({ subcategory, pekerja, sesilayanan, metodebayar }: Props) {
  const [selectedSession, setSelectedSession] = useState<SesiLayanan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<Pekerja | null>(null);
  const [isModalWorkerOpen, setIsModalWorkerOpen] = useState<boolean>(false);

  const handleCardClick = (worker: Pekerja) => {
    setSelectedWorker(worker);
    setIsModalWorkerOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalWorkerOpen(false);
    setSelectedWorker(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16"> {/* Added mt-16 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-[#2ECC71] mb-2">{subcategory.nama}</h1>
        <p className="text-gray-600 mb-4">{subcategory.deskripsi}</p>
        <div className="inline-block bg-[#F3F3F3] px-4 py-2 rounded-full">
          <span className="text-gray-700">{subcategory.namakategori}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pekerja Tersedia</h2>
          <div className="space-y-4">
            {Array.isArray(pekerja) && pekerja.length > 0 ? (
              pekerja.map((worker) => (
                <div
                  key={worker.pekerjaid}
                  onClick={() => handleCardClick(worker)}
                  className="cursor-pointer"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-[#F3F3F3] flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{worker.namapekerja}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{worker.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
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
            {Array.isArray(sesilayanan) && sesilayanan.map((session) => (
              <Card key={session.id} className="p-4">
                <div>
                  <h3 className="font-semibold">Sesi Layanan {session.sesi}</h3>
                  <div className="flex justify-between items-center mt-2">
                  <p className="text-[#2ECC71] font-semibold mt-2">
                    Rp {session.harga}
                  </p>
                    <Button
                      onClick={() => {
                        setSelectedSession(session);
                        setIsModalOpen(true);
                      }}
                      className="bg-[#2ECC71] hover:bg-[#27AE60]"
                    >
                      Pesan Jasa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {selectedSession && (
            <BookingModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              sesilayanan={selectedSession}
              metodebayar={metodebayar}
              subcategory={subcategory}
            />
          )}
        </div>
      </div>
    
    {/* <div className="bg-white rounded-lg shadow-lg p-6"> */}
    {/* <h2 className="text-2xl font-semibold mb-4">Testimoni PelangganU</h2> */}
    {/* <div className="grid md:grid-cols-2 gap-4">
          <p>aku sudah bingung</p> */}
          <TestimonialCards subcategoryId={subcategory.id} />
      {/* {subcategory.testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-4">
          <div className="flex items-center space-x-4 mb-2">
            <div className="h-10 w-10 rounded-full bg-[#F3F3F3] flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold">{testimonial.userName}</h3>
              <div className="flex items-center">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600">{testimonial.comment}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(testimonial.date).toLocaleDateString('id-ID')}
          </p>
        </Card>
      ))} */}
    {/* </div> */}
  {/* </div> */}
  {isModalWorkerOpen && selectedWorker && (
        <WorkerDetailModal worker={selectedWorker} onClose={handleCloseModal} />
      )}
  </div>
  );
}