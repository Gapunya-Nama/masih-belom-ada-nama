CREATE OR REPLACE FUNCTION SIJARTA.check_and_deduct_saldo_mypay()
RETURNS TRIGGER AS $$
DECLARE
    metode_nama VARCHAR(100);
    voucher_harga DECIMAL(15, 2);
    saldo_pelanggan DECIMAL(15, 2);
BEGIN
    -- Mendapatkan nama metode bayar
    SELECT Nama INTO metode_nama
    FROM SIJARTA.METODE_BAYAR
    WHERE Id = NEW.IdMetodeBayar;

    -- Cek apakah metode bayar adalah 'MyPay'
    IF metode_nama = 'MyPay' THEN
        -- Mendapatkan harga voucher
        SELECT Harga INTO voucher_harga
        FROM SIJARTA.VOUCHER
        WHERE Kode = NEW.IdVoucher;

        -- Mendapatkan saldo MyPay pelanggan
        SELECT SaldoMyPay INTO saldo_pelanggan
        FROM SIJARTA.USER
        WHERE Id = NEW.IdPelanggan;

        -- Cek apakah saldo mencukupi
        IF saldo_pelanggan >= voucher_harga THEN
            -- Mengurangi saldo MyPay pelanggan
            UPDATE SIJARTA.USER
            SET SaldoMyPay = SaldoMyPay - voucher_harga
            WHERE Id = NEW.IdPelanggan;
        ELSE
            -- Jika saldo tidak mencukupi, batalkan proses insert dan lempar exception
            RAISE EXCEPTION 'Saldo MyPay tidak mencukupi untuk membeli voucher ini.';
        END IF;
    END IF;

    -- Lanjutkan proses insert
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_and_deduct_saldo_mypay
BEFORE INSERT ON SIJARTA.TR_PEMBELIAN_VOUCHER
FOR EACH ROW
EXECUTE FUNCTION SIJARTA.check_and_deduct_saldo_mypay();

-- contoh gagal
INSERT INTO SIJARTA.USER VALUES ('550e8400-e29b-41d4-a716-446655440010', 'Cahya Bagus', 'L', '082241213111', 'aileenjh', '2005-06-01', 'Jl. Bogay No. 69, Bogor', 1.00);
INSERT INTO SIJARTA.TR_PEMBELIAN_VOUCHER VALUES ('950e8400-e29b-41d4-a716-446655445020', '2024-04-01', '2024-05-01', 0, '550e8400-e29b-41d4-a716-446655440010', 'DISKON202410', '550e8400-e29b-41d4-a716-446655441000');