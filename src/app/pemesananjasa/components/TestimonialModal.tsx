'use client';
import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  order: any;
}

const TestimonialModal = ({ isOpen, onClose, onSubmit, order }: TestimonialModalProps) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      orderId: order.id,
      rating,
      text,
      workerName: order.worker
    });
    setText('');
    setRating(5);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Buat Testimoni</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimoni
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2ECC71] focus:ring focus:ring-[#2ECC71] focus:ring-opacity-50"
                rows={4}
                placeholder="Bagikan pengalaman Anda..."
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-[#2ECC71] text-white py-2 px-4 rounded-lg hover:bg-[#27AE60] transition-colors"
            >
              Kirim Testimoni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;