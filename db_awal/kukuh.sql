
CREATE OR REPLACE FUNCTION SIJARTA.get_myPay_transac_history(
    User_Id UUID
)
RETURNS TABLE (
    id UUID , 
    userId UUID, 
    date TIMESTAMP, 
    amount DECIMAL(15, 2), 
    categoryId UUID,
    namaKategori VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.Id AS id,
        mp.UserId AS userId,
        mp.Tgl AS TIMESTAMP,
        mp.Nominal AS amount,
        mp.Kategoriid AS categoryId,
        ktm.Nama AS namaKategori
    FROM 
        SIJARTA.TR_MYPAY mp
        LEFT JOIN SIJARTA.KATEGORI_TR_MYPAY AS ktm ON mp.Kategoriid = ktm.id
    WHERE 
        mp.UserId = User_Id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE SIJARTA.top_up_myPay(
    p_id UUID,
    p_userId UUID,
    p_nominal DECIMAL(15, 2)
) AS $$
BEGIN
    -- Insert a new transaction with the provided UUID
    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (p_id, p_userId, CURRENT_TIMESTAMP, p_nominal, '950e8400-e29b-41d4-a716-446655444000'); -- 'Top-up' category ID

    -- Update the user's SaldoMyPay
    UPDATE SIJARTA.USER
    SET SaldoMyPay = SaldoMyPay + p_nominal
    WHERE Id = p_userId;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE SIJARTA.service_payment(
    p_id UUID,
    p_userId UUID,
    p_nominal DECIMAL(15, 2)
) AS $$
BEGIN
    -- Ensure balance does not go negative
    IF ((SELECT SaldoMyPay FROM SIJARTA.USER WHERE Id = p_userId) - p_nominal) < 0 THEN
        RAISE EXCEPTION 'Insufficient balance for payment.';
    END IF;

    -- Insert a new transaction for the payment
    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (p_id, p_userId, CURRENT_TIMESTAMP, -p_nominal, '950e8400-e29b-41d4-a716-446655444001'); -- 'Service Payment' category ID

    -- Update the user's SaldoMyPay
    UPDATE SIJARTA.USER
    SET SaldoMyPay = SaldoMyPay - p_nominal
    WHERE Id = p_userId;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE SIJARTA.withdrawal(
    p_id UUID,
    p_userId UUID,
    p_nominal DECIMAL(15, 2)
) AS $$
BEGIN
    -- Ensure balance does not go negative
    IF ((SELECT SaldoMyPay FROM SIJARTA.USER WHERE Id = p_userId) - p_nominal) < 0 THEN
        RAISE EXCEPTION 'Insufficient balance for withdrawal.';
    END IF;

    -- Insert a new transaction for the payment
    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (p_id, p_userId, CURRENT_TIMESTAMP, -p_nominal, '950e8400-e29b-41d4-a716-446655444004'); -- 'Withdrawal' category ID

    -- Update the user's SaldoMyPay
    UPDATE SIJARTA.USER
    SET SaldoMyPay = SaldoMyPay - p_nominal
    WHERE Id = p_userId;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE SIJARTA.transfer_myPay(
    p_id UUID,
    t_id UUID,
    p_userId UUID,
    t_PhoneNumber VARCHAR(20),
    p_nominal DECIMAL(15, 2)
) AS $$

DECLARE
    t_userId UUID; -- To hold the ID of the target user
BEGIN
    BEGIN
        -- Fetch target user's ID based on phone number
        SELECT Id INTO t_userId
        FROM SIJARTA.USER
        WHERE nohp = t_PhoneNumber;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Target user not found with the given phone number.';
        END IF;

        -- Ensure the sender has sufficient balance
        IF ((SELECT SaldoMyPay FROM SIJARTA.USER WHERE Id = p_userId) - p_nominal) < 0 THEN
            RAISE EXCEPTION 'Insufficient balance for the transfer.';
        END IF;

        -- Deduct the amount from the sender's balance
        UPDATE SIJARTA.USER
        SET SaldoMyPay = SaldoMyPay - p_nominal
        WHERE Id = p_userId;

        -- Add the amount to the target user's balance
        UPDATE SIJARTA.USER
        SET SaldoMyPay = SaldoMyPay + p_nominal
        WHERE Id = t_userId;

        -- Insert a transaction record for the sender (Transfer Out)
        INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
        VALUES (p_id, p_userId, CURRENT_TIMESTAMP, -p_nominal, '950e8400-e29b-41d4-a716-446655444002'); -- 'Transfer' category ID

        -- Insert a transaction record for the receiver (Transfer In)
        INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
        VALUES (t_id, t_userId, CURRENT_TIMESTAMP, p_nominal, '950e8400-e29b-41d4-a716-446655444002'); -- 'Transfer' category ID

    EXCEPTION WHEN others THEN
        -- Rollback the transaction on error
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

---- SERVICE

-- Create or replace the function in the SIJARTA schema
CREATE OR REPLACE FUNCTION SIJARTA.get_available_jobs(
    pekerja_id UUID,
    limit_val INT DEFAULT 10,
    offset_val INT DEFAULT 0
)
RETURNS TABLE (
    Id UUID,
    TglPemesanan DATE,
    TglPekerjaan DATE,
    WaktuPekerjaan TIMESTAMP,
    TotalBiaya DECIMAL(15, 2),
    IdPelanggan UUID,
    NamaPelanggan VARCHAR(255),
    IdKategoriJasa UUID,
    Sesi INT,
    KategoriId UUID,
    NamaKategori VARCHAR(100),
    SubkategoriId UUID,
    NamaSubkategori VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    WITH LatestStatus AS (
        SELECT 
            t.IdTrPemesanan
        FROM 
            SIJARTA.TR_PEMESANAN_STATUS t
        INNER JOIN (
            SELECT 
                IdTrPemesanan, 
                MAX(TglWaktu) AS MaxTglWaktu
            FROM 
                SIJARTA.TR_PEMESANAN_STATUS
            GROUP BY 
                IdTrPemesanan
        ) m 
            ON t.IdTrPemesanan = m.IdTrPemesanan
            AND t.TglWaktu = m.MaxTglWaktu
        WHERE 
            t.IdStatus = '850e8400-e29b-41d4-a716-446655447002'
    )
    SELECT 
        pj.Id,
        pj.TglPemesanan,
        pj.TglPekerjaan,
        pj.WaktuPekerjaan,
        pj.TotalBiaya,
        pj.IdPelanggan,
        u.Nama AS NamaPelanggan,
        pj.IdKategoriJasa,
        pj.Sesi,
        kj.Id AS KategoriId,
        kj.NamaKategori,
        sj.Id AS SubkategoriId,
        sj.NamaSubkategori
    FROM 
        LatestStatus latest
    INNER JOIN 
        SIJARTA.TR_PEMESANAN_JASA pj 
        ON pj.Id = latest.IdTrPemesanan
    INNER JOIN 
        SIJARTA.SUBKATEGORI_JASA sj 
        ON pj.IdKategoriJasa = sj.Id
    INNER JOIN 
        SIJARTA.KATEGORI_JASA kj 
        ON sj.KategoriJasaId = kj.Id
    INNER JOIN 
        SIJARTA.USER u
        ON pj.IdPelanggan = u.Id
    WHERE 
        pj.IdPekerja = pekerja_id
    LIMIT limit_val OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;
