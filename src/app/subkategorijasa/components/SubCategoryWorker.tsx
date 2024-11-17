"use client";

import { SubCategory } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  subcategory: SubCategory;
}

export default function SubCategoryWorker({ subcategory }: Props) {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#2ECC71] mb-2">{subcategory.name}</h1>
            <p className="text-gray-600 mb-4">{subcategory.description}</p>
            <div className="inline-block bg-[#F3F3F3] px-4 py-2 rounded-full">
              <span className="text-gray-700">{subcategory.categoryName}</span>
            </div>
          </div>
          {!isJoined && (
            <Button
              onClick={() => setIsJoined(true)}
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
            {subcategory.workers.map((worker) => (
              <Link href={`/worker/${worker.id}`} key={worker.id}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-[#F3F3F3] flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{worker.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">{worker.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({worker.completedJobs} pekerjaan selesai)
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Sesi Layanan Tersedia</h2>
          <div className="space-y-4">
            {subcategory.sessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div>
                  <h3 className="font-semibold">{session.name}</h3>
                  <p className="text-sm text-gray-600">{session.description}</p>
                  <p className="text-[#2ECC71] font-semibold mt-2">
                    Rp {session.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Testimoni Pelanggan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {subcategory.testimonials.map((testimonial) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}