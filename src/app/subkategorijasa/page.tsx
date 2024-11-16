'use client';
import { useState } from 'react';
import ModalPesanan from './components/ModalPesanJasa';

const SubkategoriPage = () => {
  // Data statis (simulasi)
  const subkategori = {
    nama: 'Cleaning Service',
    deskripsi: 'Layanan kebersihan rumah',
    kategori: { nama: 'Home Cleaning' },
  };

  const pekerjaList = [
    { id: 1, nama: 'John Doe' },
    { id: 2, nama: 'Jane Smith' },
  ];

  const testimoni = [
    { nama: 'Ali', pesan: 'Pelayanan sangat baik dan memuaskan!' },
    { nama: 'Budi', pesan: 'Pekerja ramah dan profesional.' },
  ];

  const sesiList = [
    { id: 1, nama: 'Deep Cleaning', harga: 150000 },
    { id: 2, nama: 'Regular Cleaning', harga: 100000 },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);

  const handlePesanJasa = () => {
    setShowModal(true);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#F3F3F3', minHeight: '100vh' }}>
      <h1 style={{ color: '#2ECC71' }}>{subkategori.nama}</h1>
      <p>{subkategori.deskripsi}</p>
      <h3>Kategori: {subkategori.kategori.nama}</h3>

      {/* Testimoni */}
      <h4>Testimoni</h4>
      {testimoni.length > 0 ? (
        testimoni.map((t, index) => (
          <div key={index}>
            <p>
              "{t.pesan}" - <b>{t.nama}</b>
            </p>
          </div>
        ))
      ) : (
        <p>Belum ada testimoni.</p>
      )}

      {/* Daftar Pekerja */}
      <h4>Daftar Pekerja</h4>
      {pekerjaList.length > 0 ? (
        pekerjaList.map((pekerja) => (
          <div key={pekerja.id} style={{ marginBottom: '10px' }}>
            <p>{pekerja.nama}</p>
            <button
              style={{
                backgroundColor: '#2ECC71',
                color: 'white',
                padding: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => alert(`Redirect ke profil pekerja ${pekerja.nama}`)}
            >
              Lihat Profil
            </button>
          </div>
        ))
      ) : (
        <p>Belum ada pekerja untuk subkategori ini.</p>
      )}

      {/* Daftar Sesi Layanan */}
      <h4>Daftar Sesi Layanan</h4>
      {sesiList.length > 0 ? (
        sesiList.map((sesi) => (
          <div key={sesi.id} style={{ marginBottom: '10px' }}>
            <p>
              {sesi.nama} - Rp {sesi.harga.toLocaleString()}
            </p>
            <button
              style={{
                backgroundColor: '#2ECC71',
                color: 'white',
                padding: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={handlePesanJasa}
            >
              Pesan Jasa
            </button>
          </div>
        ))
      ) : (
        <p>Belum ada sesi layanan untuk subkategori ini.</p>
      )}

      {/* Modal */}
      {showModal && <ModalPesanan onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SubkategoriPage;
