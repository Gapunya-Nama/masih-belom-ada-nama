'use client';
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import OrderCard from './components/OrderCard';
import TestimonialModal from './components/TestimonialModal';

// Mock data for demonstration
const orders = [
  {
    id: 1,
    subcategory: "Tukang Ledeng Professional",
    service: "Perbaikan Pipa Bocor",
    price: 150000,
    worker: "Ahmad Sudrajat",
    status: "Menunggu Pembayaran",
    date: "2024-03-20",
    hasTestimonial: false
  },
  {
    id: 2,
    subcategory: "Tukang Ledeng Professional",
    service: "Instalasi Pipa Baru",
    price: 300000,
    worker: "Budi Santoso",
    status: "Pesanan Selesai",
    date: "2024-03-15",
    hasTestimonial: false
  },
  {
    id: 3,
    subcategory: "Tukang Ledeng Professional",
    service: "Perbaikan Pipa Bocor",
    price: 150000,
    worker: "Candra Wijaya",
    status: "Dalam Pengerjaan",
    date: "2024-03-18",
    hasTestimonial: false
  }
];

const subcategories = [
  "Semua",
  "Tukang Ledeng Professional",
  "Tukang Listrik",
  "Tukang Cat"
];

const statuses = [
  "Semua",
  "Menunggu Pembayaran",
  "Mencari Pekerja Terdekat",
  "Dalam Pengerjaan",
  "Pesanan Selesai",
  "Dibatalkan"
];

const OrderView = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelOrder = (orderId: number) => {
    // Handle order cancellation logic here
    console.log('Cancelling order:', orderId);
  };

  const handleCreateTestimonial = (order: any) => {
    setSelectedOrder(order);
    setShowTestimonialModal(true);
  };

  const handleTestimonialSubmit = (testimonialData: any) => {
    console.log('Testimonial submitted:', testimonialData);
    setShowTestimonialModal(false);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSubcategory = selectedSubcategory === "Semua" || order.subcategory === selectedSubcategory;
    const matchesStatus = selectedStatus === "Semua" || order.status === selectedStatus;
    const matchesSearch = order.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) || order.worker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubcategory && matchesStatus && matchesSearch;
  });

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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={() => handleCancelOrder(order.id)}
              onCreateTestimonial={() => handleCreateTestimonial(order)}
            />
          ))}
        </div>
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        onSubmit={handleTestimonialSubmit}
        order={selectedOrder}
      />
    </div>
    </div>
  );
};

export default OrderView;