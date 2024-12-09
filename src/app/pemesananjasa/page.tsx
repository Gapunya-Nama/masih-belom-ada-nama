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
          body: JSON.stringify({ userId: user?.id, command: 'show' }),
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

// src/app/pemesananjasa/page.tsx

const handleCancelOrder = async (order: PemesananJasa) => {
  // Confirm the action with the user
    const confirmAction = window.confirm(
      "Apakah Anda yakin ingin membatalkan pesanan ini?"
    );
    if (!confirmAction) return;

    try {
      // Set loading state if applicable
      setIsLoading(true);

      const response = await fetch(`/api/statuspesanan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idtr: order.id,
          idstatus:'850e8400-e29b-41d4-a716-446655447007',
          tglwaktu: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membatalkan pesanan.");
      }

      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id ? { ...o, statuspesanan: "Pemesanan Dibatalkan" } : o
        )
      );

      toast({
          title: "Berhasil",
          description: "Pesanan telah dibatalkan.",
          variant: "default",
        });
      } catch (error: any) {
        console.error("Cancel Order Error:", error);
        toast({
          title: "Error",
          description: error.message || "Gagal membatalkan pesanan.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
  };

  const handlePayment = async (order: PemesananJasa) => {
    // Confirm the action with the user
    const confirmAction = window.confirm(
      "Apakah Anda yakin ingin memproses pembayaran ini?"
    );
    if (!confirmAction) return;
    if (user?.balance === undefined) {
      toast({
        title: "Error",
        description: "Saldo pengguna tidak tersedia.",
        variant: "destructive",
      });
      return;
    }
  
    const userBalance = Number(user.balance);
    const orderCost = Number(order.biaya);
    if(userBalance < orderCost){
      toast({
        title: "Error",
        description: `Saldo  tidak mencukupi. Saldo Anda: ${userBalance} Biaya Pesanan: ${orderCost}`,
        variant: "destructive",
      });
      return;
    }
    try {
      // Set loading state if applicable
      setIsLoading(true);
      console.log("order.id", order.id);
      const response = await fetch(`/api/statuspesanan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idtr: order.id,
          idstatus: '850e8400-e29b-41d4-a716-446655447002',
          tglwaktu: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memproses pembayaran.");
      }

      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id ? { ...o, statuspesanan: "Mencari Pekerja Terdekat" } : o
        )
      );

      toast({
        title: "Berhasil",
        description: "Pembayaran telah diproses.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal memproses pembayaran.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                [...filteredOrders]
                  .sort((a, b) => new Date(b.tanggalpemesanan).getTime() - new Date(a.tanggalpemesanan).getTime())
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={() => handleCancelOrder(order)}
                      onPayment={() => handlePayment(order)}
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