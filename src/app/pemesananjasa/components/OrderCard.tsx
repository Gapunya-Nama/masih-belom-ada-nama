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
  onPayment: () => void;
  onCreateTestimonial: () => void;
}

const OrderCard = ({ order, onCancel, onPayment, onCreateTestimonial }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Menunggu Pembayaran':
          return 'text-orange-600 bg-orange-50'; // Orange indicates attention needed
        case 'Mencari Pekerja Terdekat':
          return 'text-blue-600 bg-blue-50'; // Blue represents searching/trust
        case 'Pekerja Ditemukan':
          return 'text-teal-600 bg-teal-50'; // Teal signifies success in finding a worker
        case 'Pekerja Menuju ke Lokasi':
          return 'text-indigo-600 bg-indigo-50'; // Indigo for progress/movement
        case 'Pekerjaan Selesai':
          return 'text-green-600 bg-green-50'; // Green for completion/success
        case 'Pemesanan Dibatalkan':
          return 'text-red-600 bg-red-50'; // Red for cancellation/error
        default:
          return 'text-gray-600 bg-gray-50'; // Gray for undefined statuses
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
        {order.statuspesanan === 'Menunggu Pembayaran' && (
          <button
            onClick={onPayment}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Bayar Sekarang
          </button>
        )}
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