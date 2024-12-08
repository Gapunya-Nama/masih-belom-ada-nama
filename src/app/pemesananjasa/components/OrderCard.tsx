import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

interface OrderCardProps {
  order: {
    id: string;
    namasubkategori: string;
    sesi: number;
    biaya: number;
    namapekerja: string;
    statuspesanan: string;
    tanggalpemesanan: string;
  };
  onCancel: () => void;
  onCreateTestimonial: () => void;
}

const OrderCard = ({ order, onCancel, onCreateTestimonial }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'text-yellow-600 bg-yellow-50';
      case 'Mencari Pekerja Terdekat':
        return 'text-blue-600 bg-blue-50';
      case 'Pekerja Ditemukan':
        return 'text-purple-600 bg-purple-50';
      case 'Pekerja Menuju ke Lokasi':
        return 'text-indigo-600 bg-indigo-50';
      case 'Pesanan Selesai':
        return 'text-green-600 bg-green-50';
      case 'Dibatalkan':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const showCancelButton = ['Menunggu Pembayaran', 'Mencari Pekerja Terdekat'].includes(order.statuspesanan);
  // const showTestimonialButton = order.statuspesanan === 'Pesanan Selesai' && !order.hasTestimonial;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{order.namasubkategori}</h3>
          <p className="text-gray-600">Sesi layanan: {order.sesi}</p>
        </div>
        <div className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(order.statuspesanan)}`}>
          {order.statuspesanan}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-5 h-5 mr-2" />
          <span>Rp {order.biaya.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{new Date(order.tanggalpemesanan).toLocaleDateString('id-ID')}</span>
        </div>
        <div className="text-gray-600">
          Pekerja: {order.namapekerja}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {showCancelButton && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            Batalkan
          </button>
        )}
        {/* {showTestimonialButton && (
          <button
            onClick={onCreateTestimonial}
            className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
          >
            Buat Testimoni
          </button>
        )} */}
      </div>
    </div>
  );
};

export default OrderCard;