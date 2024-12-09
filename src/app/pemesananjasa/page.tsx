// src/app/pemesananjasa/page.tsx

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import OrderCard from './components/OrderCard';
import TestimonialModal from './components/TestimonialModal';
import { Pekerja, PemesananJasa } from '@/lib/dataType/interfaces';
import { toast } from '@/components/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

// Filter Options
const subcategories = [
  "Semua",
  "Tukang Ledeng Professional",
  "Tukang Listrik",
  "Tukang Cat"
];

const statuses = [
  "Semua",
  "Menunggu Pembayaran",
  "Pembayaran Diterima",
  "Mencari Pekerja Terdekat",
  "Pekerja Ditemukan",
  "Dalam Proses Pekerjaan",
  "Pekerjaan Selesai",
  "Pemesanan Dibatalkan"
];
const OrderView = () => {
  const [orders, setOrders] = useState<PemesananJasa[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PemesananJasa[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PemesananJasa | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchedPekerja = useRef<boolean>(false);
  const { user } = useAuth();


  // Fetch Data Pemesanan Jasa dari API menggunakan fetch
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/pemesananjasa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user?.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data pesanan');
        }

        const data: PemesananJasa[] = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Gagal mengambil data pesanan");
        toast({
          title: 'Error',
          description: err.message || "Gagal mengambil data pesanan",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter Orders Berdasarkan Subkategori, Status, dan Search Query
  useEffect(() => {
    let tempOrders = [...orders];

    if (selectedSubcategory !== "Semua") {
      tempOrders = tempOrders.filter(order => order.namakategori === selectedSubcategory);
    }

    if (selectedStatus !== "Semua") {
      tempOrders = tempOrders.filter(order => order.statuspesanan === selectedStatus);
    }

    if (searchQuery.trim() !== "") {
      tempOrders = tempOrders.filter(order =>
        order.namakategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.namapekerja.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.namasubkategori.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(tempOrders);
  }, [selectedSubcategory, selectedStatus, searchQuery, orders]);

  const handleCancelOrder = (orderId: string) => {
    // Implementasikan logika pembatalan pemesanan di sini
    console.log('Membatalkan pesanan:', orderId);
    // Contoh: Mengirimkan request ke API untuk membatalkan pemesanan
  };

  const handleCreateTestimonial = (order: PemesananJasa) => {
    setSelectedOrder(order);
    setShowTestimonialModal(true);
  };

  const handleTestimonialSubmit = (testimonialData: any) => {
    console.log('Testimonial dikirim:', testimonialData);
    // Implementasikan logika pengiriman testimonial ke backend
    setShowTestimonialModal(false);
  };

  // Contoh fetch pekerja yang sesuai dengan pola Anda
  const [pekerja, setPekerja] = useState<Pekerja[]>([]);
  const [categoryId, setCategoryId] = useState<string>(''); // Tambahkan state untuk categoryId jika diperlukan

  useEffect(() => {
    const fetchPekerja = async () => {
      if (!categoryId) return; // Pastikan categoryId tersedia

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
      } catch (error: any) {
        console.error("Error fetching pekerja:", error);
        toast({
          title: 'Error',
          description: error.message || "Gagal mengambil data pekerja",
        });
      } finally {
        isFetchedPekerja.current = true; // Tandai sudah dipanggil
      }
    };

    fetchPekerja();
  }, [categoryId]);

  return (
    <div className="pt-16">
      <div className="min-h-screen bg-[#F3F3F3] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Daftar Pesanan Jasa</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subcategory Filter */}
              <div className="relative">
                <select
                  aria-label='subcategory'
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-[#2ECC71] focus:outline-none focus:ring-1 focus:ring-[#2ECC71]"
                >
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  aria-label='status'
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-[#2ECC71] focus:outline-none focus:ring-1 focus:ring-[#2ECC71]"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-[#2ECC71] focus:outline-none focus:ring-1 focus:ring-[#2ECC71]"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Loading and Error States */}
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={() => handleCancelOrder(order.id)}
                  onCreateTestimonial={() => handleCreateTestimonial(order)}
                />
              ))
            ) : (
              <p>Tidak ada pesanan yang ditemukan.</p>
            )}
          </div>
        </div>

        {/* Testimonial Modal */}
        {selectedOrder && (
          <TestimonialModal
            isOpen={showTestimonialModal}
            onClose={() => setShowTestimonialModal(false)}
            onSubmit={handleTestimonialSubmit}
            order={selectedOrder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderView;