-- CREATE OR REPLACE FUNCTION SIJARTA.check_and_deduct_saldo_mypay()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     metode_nama VARCHAR(100);
--     voucher_harga DECIMAL(15, 2);
--     saldo_pelanggan DECIMAL(15, 2);
-- BEGIN
--     -- Mendapatkan nama metode bayar
--     SELECT Nama INTO metode_nama
--     FROM SIJARTA.METODE_BAYAR
--     WHERE Id = NEW.IdMetodeBayar;

--     -- Cek apakah metode bayar adalah 'MyPay'
--     IF metode_nama = 'MyPay' THEN
--         -- Mendapatkan harga voucher
--         SELECT Harga INTO voucher_harga
--         FROM SIJARTA.VOUCHER
--         WHERE Kode = NEW.IdVoucher;

--         -- Mendapatkan saldo MyPay pelanggan
--         SELECT SaldoMyPay INTO saldo_pelanggan
--         FROM SIJARTA.USER
--         WHERE Id = NEW.IdPelanggan;

--         -- Cek apakah saldo mencukupi
--         IF saldo_pelanggan >= voucher_harga THEN
--             -- Mengurangi saldo MyPay pelanggan
--             UPDATE SIJARTA.USER
--             SET SaldoMyPay = SaldoMyPay - voucher_harga
--             WHERE Id = NEW.IdPelanggan;
--         ELSE
--             -- Jika saldo tidak mencukupi, batalkan proses insert dan lempar exception
--             RAISE EXCEPTION 'Saldo MyPay tidak mencukupi untuk membeli voucher ini.';
--         END IF;
--     END IF;

--     -- Lanjutkan proses insert
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_check_and_deduct_saldo_mypay
-- BEFORE INSERT ON SIJARTA.TR_PEMBELIAN_VOUCHER
-- FOR EACH ROW
-- EXECUTE FUNCTION SIJARTA.check_and_deduct_saldo_mypay();

-- Create views
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

CREATE OR REPLACE FUNCTION cek_saldo_sebelum_beli() 
RETURNS TRIGGER AS $$
DECLARE
  user_saldo NUMERIC(15,2);
  voucher_harga NUMERIC(15,2);
BEGIN
  -- Ambil saldo user
  SELECT saldo INTO user_saldo FROM users WHERE userid = NEW.userid;
  IF user_saldo IS NULL THEN
    RAISE EXCEPTION 'User tidak ditemukan';
  END IF;

  -- Ambil harga voucher
  SELECT harga INTO voucher_harga FROM voucher WHERE voucherid = NEW.voucherid;
  IF voucher_harga IS NULL THEN
    RAISE EXCEPTION 'Voucher tidak ditemukan';
  END IF;

  -- Cek apakah saldo cukup
  IF (user_saldo - voucher_harga) < 0 THEN
    RAISE EXCEPTION 'Saldo tidak cukup untuk membeli voucher ini';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cek_saldo_sebelum_insert
BEFORE INSERT ON SIJARTA.TR_PEMBELIAN_VOUCHER
FOR EACH ROW
EXECUTE FUNCTION cek_saldo_sebelum_beli();

CREATE OR REPLACE FUNCTION buy_voucher(
    p_id UUID, p_userid UUID, 
    p_voucherid VARCHAR, metode_id UUID)
RETURNS VOID AS $$
DECLARE
  v_harga NUMERIC(15,2);
  JmlHari INT;
BEGIN
  -- Mulai proses dalam satu transaksi
  -- (Secara default fungsi PL/pgSQL dijalankan dalam konteks transaksi yang dapat di-commit atau rollback)
  -- 1. Coba masukkan transaksi voucher
  SELECT JmlHariBerlaku INTO JmlHari FROM SIJARTA.VOUCHER V WHERE V.Kode = p_voucherid;
  INSERT INTO SIJARTA.TR_PEMBELIAN_VOUCHER
  VALUES (
    p_id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + JmlHari,
    0,
    p_userid,
    p_voucherid,
    metode_id
  );
  -- Jika sampai di sini tidak error, berarti saldo cukup (trigger lolos).

  -- 2. Ambil harga voucher untuk pengurangan saldo
  SELECT harga INTO v_harga FROM voucher WHERE voucherid = p_voucherid;
  IF v_harga IS NULL THEN
    RAISE EXCEPTION 'Voucher dengan id % tidak ditemukan', p_voucherid;
  END IF;

  -- 3. Update saldo user
  UPDATE users
  SET saldo = saldo - v_harga
  WHERE userid = p_userid;

  -- Jika user tidak ditemukan saat update, maka 0 row yang ter-update. 
  -- Kita bisa cek ini jika perlu:
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User dengan id % tidak ditemukan saat pengurangan saldo', p_userid;
  END IF;

  -- Semua selesai, perubahan akan otomatis commit jika tidak ada error.
END;
$$ LANGUAGE plpgsql;
