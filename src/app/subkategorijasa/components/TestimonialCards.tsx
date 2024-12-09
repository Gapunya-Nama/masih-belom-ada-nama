/* eslint-disable react/jsx-key */
// components/TestimonialCards.tsx

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { Testimonial } from '@/lib/dataType/interfaces';

// Fungsi untuk mengambil testimoni berdasarkan subcategoryId (idkategori)
const fetchTestimonialsByCategoryId = async (idkategori: string): Promise<Testimonial[]> => {
  try {
    const response = await fetch('/api/testimonial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idkategori }), // Mengirimkan idkategori ke server
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch testimonials');
    }

    const testimonials = await response.json();

    if (Array.isArray(testimonials)) {
      return testimonials;
    } else {
      console.error('Unexpected response format:', testimonials);
      return [];
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

interface Props {
  subcategoryId: string; // idkategori untuk mengambil data testimoni
}

const TestimonialCards: React.FC<Props> = ({ subcategoryId }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTestimonialsByCategoryId(subcategoryId);
        setTestimonials(data);
      } catch (err: any) {
        setError('Failed to fetch testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Testimoni Pelanggan</h2>
      {testimonials.length === 0 ? (
        <p className="text-gray-500">Belum ada testimoni.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <Card className="p-4" key={testimonial.id}>
              <div className="flex items-center space-x-4 mb-2">
                <div className="h-10 w-10 rounded-full bg-[#F3F3F3] flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.nama_pengguna}</h3>
                  <div className="flex items-center">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.teks_testimoni}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(testimonial.tgl_testimoni).toLocaleDateString('id-ID')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialCards;
