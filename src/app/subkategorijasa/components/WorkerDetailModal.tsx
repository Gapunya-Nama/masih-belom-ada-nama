// src/components/WorkerDetailModal.tsx

import React from 'react';
import { Pekerja } from '@/lib/dataType/interfaces';
import { Star, X } from 'lucide-react';

interface WorkerDetailModalProps {
  worker: Pekerja;
  onClose: () => void;
}

const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ worker, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Worker Details */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-[#F3F3F3] flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-500">
              {worker.namapekerja.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{worker.namapekerja}</h2>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-gray-700">{worker.rating}</span>
          </div>
          {/* Tambahkan detail lainnya sesuai kebutuhan */}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailModal;