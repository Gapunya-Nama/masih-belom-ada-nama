
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
    WITH 
    LatestStatus AS (
        SELECT 
            t.IdTrPemesanan,
            t.IdStatus
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
    ),
    WorkerSubkategori AS (
        SELECT 
            sj.Id AS SubkategoriId
        FROM 
            SIJARTA.PEKERJA_KATEGORI_JASA pkj
        INNER JOIN 
            SIJARTA.SUBKATEGORI_JASA sj 
            ON pkj.KategoriJasaId = sj.KategoriJasaId
        WHERE 
            pkj.PekerjaId = pekerja_id
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
    INNER JOIN 
        WorkerSubkategori ws
        ON pj.IdKategoriJasa = ws.SubkategoriId
    LIMIT limit_val OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the procedure in the SIJARTA schema
CREATE OR REPLACE PROCEDURE SIJARTA.kerjakan_pesanan(
    order_id UUID,
    pekerja_id UUID
) AS $$
BEGIN
    -- Check if the order exists
    IF NOT EXISTS (
        SELECT 1 
        FROM SIJARTA.TR_PEMESANAN_JASA 
        WHERE Id = order_id
    ) THEN
        RAISE EXCEPTION 'Order with Id % does not exist.', order_id;
    END IF;

    -- (Optional) Check if the pekerja is authorized to handle the job's subkategori_jasa
    IF NOT EXISTS (
        SELECT 1
        FROM SIJARTA.TR_PEMESANAN_JASA pj
        INNER JOIN SIJARTA.SUBKATEGORI_JASA sj ON pj.IdKategoriJasa = sj.Id
        INNER JOIN SIJARTA.PEKERJA_KATEGORI_JASA pkj ON sj.KategoriJasaId = pkj.KategoriJasaId
        WHERE pj.Id = order_id
          AND pkj.PekerjaId = pekerja_id
    ) THEN
        RAISE EXCEPTION 'Pekerja with Id % is not authorized to handle the subkategori_jasa for Order Id %.', pekerja_id, order_id;
    END IF;

    -- Check if the status 'Kerjakan Pesanan' has already been applied
    IF EXISTS (
        SELECT 1 
        FROM SIJARTA.TR_PEMESANAN_STATUS 
        WHERE IdTrPemesanan = order_id 
          AND IdStatus > '850e8400-e29b-41d4-a716-446655447002'
    ) THEN
        RAISE NOTICE 'Status "Kerjakan Pesanan" has already been applied to Order Id %.', order_id;
        -- Exit the procedure without making any changes
        RETURN;
    END IF;

    -- Insert the new status entry
    INSERT INTO SIJARTA.TR_PEMESANAN_STATUS (IdTrPemesanan, IdStatus, TglWaktu)
    VALUES (order_id, '850e8400-e29b-41d4-a716-446655447003', NOW());

    -- Update the TR_PEMESANAN_JASA record with current timestamp and pekerja_id
    UPDATE SIJARTA.TR_PEMESANAN_JASA
    SET 
        TglPekerjaan = NOW(),
        WaktuPekerjaan = NOW(),
        IdPekerja = pekerja_id
    WHERE Id = order_id;

    -- (Optional) Insert a log entry for auditing purposes
    -- INSERT INTO SIJARTA.LOG_KERJAKAN_PESANAN (OrderId, PekerjaId, Timestamp, Status)
    -- VALUES (order_id, pekerja_id, NOW(), 'Kerjakan Pesanan Applied');

    -- Raise a success notice
    RAISE NOTICE 'Status "Kerjakan Pesanan" successfully applied to Order Id % and job details updated.', order_id;

END;
$$ LANGUAGE plpgsql;


-- Create or replace the function in the SIJARTA schema
CREATE OR REPLACE FUNCTION SIJARTA.get_taken_jobs( 
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
    NamaSubkategori VARCHAR(100),
    IdStatus UUID,
    Status VARCHAR(50),
    IdNextStatus UUID,
    NextStatus VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    WITH LatestStatus AS (
        SELECT 
            t.IdTrPemesanan,
            t.IdStatus
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
            t.IdStatus > '850e8400-e29b-41d4-a716-446655447002' 
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
        sj.NamaSubkategori,
        ls.IdStatus,
        sp.Status,
        sp_next.Id AS IdNextStatus,
        sp_next.Status AS NextStatus
    FROM 
        LatestStatus ls
    INNER JOIN 
        SIJARTA.TR_PEMESANAN_JASA pj 
        ON pj.Id = ls.IdTrPemesanan
    INNER JOIN 
        SIJARTA.SUBKATEGORI_JASA sj 
        ON pj.IdKategoriJasa = sj.Id
    INNER JOIN 
        SIJARTA.KATEGORI_JASA kj 
        ON sj.KategoriJasaId = kj.Id
    INNER JOIN 
        SIJARTA.USER u
        ON pj.IdPelanggan = u.Id
    LEFT JOIN 
        SIJARTA.STATUS_PESANAN sp 
        ON ls.IdStatus = sp.Id
    LEFT JOIN 
        SIJARTA.STATUS_PESANAN sp_next
        ON sp_next.Id = (
            SELECT sp_inner.Id 
            FROM SIJARTA.STATUS_PESANAN sp_inner
            WHERE sp_inner.Id > ls.IdStatus
            ORDER BY sp_inner.Id ASC
            LIMIT 1
        )
    WHERE 
        pj.IdPekerja = pekerja_id
    LIMIT limit_val OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;


-- Create or replace the function to update job status and return updated job data
CREATE OR REPLACE FUNCTION SIJARTA.update_status_pesanan(
    order_id UUID,
    nextStatus_id UUID
) 
RETURNS TABLE (
    Id UUID,
    IdStatus UUID,
    Status VARCHAR(50),
    IdNextStatus UUID,
    NextStatus VARCHAR(50)
) AS $$
BEGIN
    -- Check if the order exists
    IF NOT EXISTS (
        SELECT 1 
        FROM SIJARTA.TR_PEMESANAN_JASA 
        WHERE Id = order_id
    ) THEN
        RAISE EXCEPTION 'Order with Id % does not exist.', order_id;
    END IF;

    -- Check if the status has already been applied to the order
    IF EXISTS (
        SELECT 1 
        FROM SIJARTA.TR_PEMESANAN_STATUS 
        WHERE IdTrPemesanan = order_id 
          AND IdStatus = nextStatus_id
    ) THEN
        RAISE NOTICE 'Status "%" has already been applied to Order Id %.', nextStatus_id, order_id;
        -- Exit the function without returning any rows
        RETURN;
    END IF;

    -- Insert the new status
    INSERT INTO SIJARTA.TR_PEMESANAN_STATUS (IdTrPemesanan, IdStatus, TglWaktu)
    VALUES (order_id, nextStatus_id, NOW());

    -- Return the updated job data
    RETURN QUERY
        SELECT 
            pj.Id,
            ls.IdStatus,
            sp.Status,
            sp_next.Id AS IdNextStatus,
            sp_next.Status AS NextStatus
        FROM 
            SIJARTA.TR_PEMESANAN_JASA pj
        INNER JOIN 
            SIJARTA.TR_PEMESANAN_STATUS ls 
            ON pj.Id = ls.IdTrPemesanan
        INNER JOIN 
            SIJARTA.SUBKATEGORI_JASA sj 
            ON pj.IdKategoriJasa = sj.Id
        INNER JOIN 
            SIJARTA.KATEGORI_JASA kj 
            ON sj.KategoriJasaId = kj.Id
        INNER JOIN 
            SIJARTA.USER u
            ON pj.IdPelanggan = u.Id
        LEFT JOIN 
            SIJARTA.STATUS_PESANAN sp 
            ON ls.IdStatus = sp.Id
        LEFT JOIN 
            SIJARTA.STATUS_PESANAN sp_next
            ON sp_next.Id = (
                SELECT sp_inner.Id 
                FROM SIJARTA.STATUS_PESANAN sp_inner
                WHERE sp_inner.Id > ls.IdStatus
                ORDER BY sp_inner.Id ASC
                LIMIT 1
            )
        WHERE 
            pj.Id = order_id
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;