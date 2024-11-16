const ModalPesanan = ({ onClose }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      alert('Pesanan berhasil dibuat!');
      onClose();
    };
  
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#2ECC71' }}>Form Pemesanan Jasa</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Tanggal Pemesanan:</label>
              <input type="date" required style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Diskon:</label>
              <input type="text" placeholder="Masukkan kode diskon" style={{ width: '100%', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Total Pembayaran:</label>
              <input type="number" readOnly value="0" style={{ width: '100%', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Metode Bayar:</label>
              <select style={{ width: '100%', padding: '5px' }}>
                <option value="transfer">Transfer Bank</option>
                <option value="gopay">Gopay</option>
                <option value="ovo">OVO</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2ECC71',
                color: 'white',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Konfirmasi Pesanan
            </button>
          </form>
          <button
            onClick={onClose}
            style={{
              marginTop: '10px',
              backgroundColor: '#F3F3F3',
              color: 'black',
              padding: '10px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Batal
          </button>
        </div>
      </div>
    );
  };
  
  export default ModalPesanan;