- Create views
CREATE VIEW SIJARTA.promo_full AS
    SELECT
        D.Potongan AS Potongan,
        D.MinTrPemesanan AS MinTrPemesanan,
        P.Kode AS Kode,
        P.TglAkhirBerlaku AS TglAkhirBerlaku
    FROM
        SIJARTA.PROMO P
    NATURAL JOIN
        SIJARTA.DISKON D;

CREATE VIEW SIJARTA.voucher_full AS
    SELECT 
        D.Potongan AS Potongan,
        D.MinTrPemesanan AS MinTrPemesanan,
        V.Kode AS Kode,
        V.JmlHariBerlaku AS JmlHariBerlaku,
        V.KuotaPenggunaan AS KuotaPenggunaan,
        V.Harga AS Harga
    FROM 
        SIJARTA.VOUCHER V
    NATURAL JOIN 
        SIJARTA.DISKON D;

-- Create functions
CREATE OR REPLACE FUNCTION SIJARTA.show_all_voucher()
RETURNS TABLE(
    Potongan DECIMAL(15, 2),
    MinTrPemesanan INT,
    Kode VARCHAR(50),
    JmlHariBerlaku INT,
    KuotaPenggunaan INT,
    Harga DECIMAL(15, 2)
) AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM SIJARTA.voucher_full;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.show_all_promo()
RETURNS TABLE(
    Potongan DECIMAL(15, 2),
    MinTrPemesanan INT,
    Kode VARCHAR(50),
    TglAkhirBerlaku DATE
) AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM SIJARTA.promo_full;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.get_testimoni_by_kategori(idSubKategoriJasa UUID)
RETURNS TABLE (
    nama_pengguna VARCHAR,
    teks_testimoni TEXT,
    tgl_testimoni DATE,
    nama_pekerja VARCHAR,
    rating INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.Nama AS nama_pengguna,  -- Nama pelanggan diambil dari USER
        t.Teks AS teks_testimoni,
        t.Tgl AS tgl_testimoni,
        uw.Nama AS nama_pekerja,  -- Nama pekerja diambil dari USER
        t.Rating AS rating
    FROM 
        SIJARTA.TESTIMONI t
    JOIN 
        SIJARTA.TR_PEMESANAN_JASA pjs ON t.IdTrPemesanan = pjs.Id
    JOIN 
        SIJARTA.USER up ON pjs.IdPelanggan = up.Id  -- Nama pelanggan diambil dari USER
    JOIN 
        SIJARTA.USER uw ON pjs.IdPekerja = uw.Id  -- Nama pekerja diambil dari USER
    WHERE 
        pjs.IdKategoriJasa = idSubKategoriJasa
    ORDER BY 
        t.Tgl DESC;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM SIJARTA.get_testimoni_by_kategori('750e8400-e29b-41d4-a716-446655442000');

CREATE OR REPLACE FUNCTION SIJARTA.show_metode_bayar()
RETURNS TABLE(
    Id UUID,
    Nama VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM SIJARTA.METODE_BAYAR;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.buy_voucher(
    tr_id UUID,
    p_id UUID,
    p_userid UUID,
    p_voucherid VARCHAR,
    metode_id UUID
)
RETURNS void AS $$
DECLARE
    v_jml_hari INT;
    v_tgl_awal DATE := current_date;
    v_tgl_akhir DATE;
    harga DECIMAL(15, 2);
BEGIN
    -- Ambil jumlah hari dari voucher
    SELECT v.jmlhariberlaku, v.harga 
    INTO v_jml_hari, harga
    FROM sijarta.voucher v
    WHERE v.kode = p_voucherid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Voucher dengan kode % tidak ditemukan', p_voucherid;
    END IF;

    -- Hitung tanggal akhir
    v_tgl_akhir := v_tgl_awal + v_jml_hari;

    -- Insert ke TR_PEMBELIAN_VOUCHER
    INSERT INTO SIJARTA.TR_PEMBELIAN_VOUCHER
    VALUES (
        p_id,
        v_tgl_awal,
        v_tgl_akhir,
        0,
        p_userid,
        p_voucherid,
        metode_id
    );

    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (tr_id, p_userId, CURRENT_TIMESTAMP, harga, '950e8400-e29b-41d4-a716-446655444005');

END;
$$ LANGUAGE plpgsql;

