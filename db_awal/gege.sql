
-- Untuk login
CREATE OR REPLACE FUNCTION SIJARTA.authenticate_user(
    p_nohp VARCHAR,
    p_pwd VARCHAR
)
RETURNS TABLE (
    id UUID,
    pno VARCHAR,
    role VARCHAR,
    name VARCHAR,
    gender VARCHAR,
    birth_date DATE,
    address VARCHAR,
    balance DECIMAL(15,2),
    level VARCHAR(50),
    nama_bank VARCHAR(100),
    nomor_rekening VARCHAR(50),
    NPWP VARCHAR(20),
    link_foto VARCHAR(255), 
    rating FLOAT, 
    pesanan_selesai INT 
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.Id,
        u.NoHP AS pno,
        COALESCE(
            CASE 
                WHEN p.Id IS NOT NULL THEN 'user'::VARCHAR
                WHEN w.Id IS NOT NULL THEN 'worker'::VARCHAR
            END, 
            'guest'::VARCHAR
        ) AS role,
        u.Nama AS name,
        CASE u.JenisKelamin
            WHEN 'L' THEN 'Laki-Laki'::VARCHAR
            WHEN 'P' THEN 'Perempuan'::VARCHAR
            ELSE 'Other'::VARCHAR
        END AS gender,
        u.TglLahir AS birth_date,
        u.Alamat AS address,
        u.SaldoMyPay AS balance,
        p.Level AS level,
        w.NamaBank AS nama_bank,
        w.NomorRekening AS nomor_rekening,
        w.NPWP AS NPWP,
        w.LinkFoto AS link_foto,
        w.Rating AS rating,
        w.JmlPsnananSelesai AS pesanan_selesai
    FROM 
        SIJARTA.USER u
        LEFT JOIN SIJARTA.PELANGGAN p ON u.Id = p.Id
        LEFT JOIN SIJARTA.PEKERJA w ON u.Id = w.Id
    WHERE 
        u.NoHP = p_nohp AND u.Pwd = p_pwd;
END;
$$ LANGUAGE plpgsql;


-- Untuk register
CREATE OR REPLACE FUNCTION SIJARTA.insert_pekerja(
    p_id UUID,
    p_Nama VARCHAR,
    p_Pwd VARCHAR,
    p_JenisKelamin CHAR(1),
    p_NoHP VARCHAR,
    p_TglLahir DATE,
    p_Alamat VARCHAR,
    p_SaldoMyPay DECIMAL,
    p_NamaBank VARCHAR,
    p_NomorRekening VARCHAR,
    p_NPWP VARCHAR,
    p_LinkFoto VARCHAR,
    p_Rating FLOAT,
    p_JmlPsnananSelesai INT
)
RETURNS VOID AS $$
BEGIN

    INSERT INTO SIJARTA.USER (Id, Nama, JenisKelamin, NoHP, Pwd, TglLahir, Alamat, SaldoMyPay)
    VALUES (p_id, p_Nama, p_JenisKelamin, p_NoHP, p_Pwd, p_TglLahir, p_Alamat, p_SaldoMyPay);


    INSERT INTO SIJARTA.PEKERJA (Id, NamaBank, NomorRekening, NPWP, LinkFoto, Rating, JmlPsnananSelesai)
    VALUES (p_id, p_NamaBank, p_NomorRekening, p_NPWP, p_LinkFoto, p_Rating, p_JmlPsnananSelesai);

EXCEPTION
        WHEN OTHERS THEN

            RAISE EXCEPTION 'Error occurred while inserting pekerja: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.insert_pelanggan(
    p_id UUID,
    p_Nama VARCHAR,
    p_Pwd VARCHAR,
    p_JenisKelamin CHAR(1),
    p_NoHP VARCHAR,
    p_TglLahir DATE,
    p_Alamat VARCHAR,
    p_SaldoMyPay DECIMAL,
    p_Level VARCHAR
)
RETURNS VOID AS $$
BEGIN

    INSERT INTO SIJARTA.USER (Id, Nama, JenisKelamin, NoHP, Pwd, TglLahir, Alamat, SaldoMyPay)
    VALUES (p_id, p_Nama, p_JenisKelamin, p_NoHP, p_Pwd, p_TglLahir, p_Alamat, p_SaldoMyPay);


    INSERT INTO SIJARTA.PELANGGAN (Id, Level)
    VALUES (p_id, p_Level);

EXCEPTION
        WHEN OTHERS THEN

            RAISE EXCEPTION 'Error occurred while inserting pelanggan: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.check_bank_account_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM sijarta.pekerja
        WHERE namabank = NEW.namabank AND nomorrekening = NEW.nomorrekening
    ) THEN
        RAISE EXCEPTION 'Pasangan nama bank dan nomor rekening sudah terdaftar.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_bank_account_trigger
BEFORE INSERT ON sijarta.pekerja
FOR EACH ROW
EXECUTE FUNCTION sijarta.check_bank_account_unique();


-- Untuk update profile

CREATE OR REPLACE FUNCTION SIJARTA.update_pekerja(
    p_id UUID,
    p_Nama VARCHAR,
    p_JenisKelamin CHAR(1),
    p_NoHP VARCHAR,
    p_Pwd VARCHAR,
    p_TglLahir DATE,
    p_Alamat VARCHAR,
    p_SaldoMyPay DECIMAL,
    p_NamaBank VARCHAR,
    p_NomorRekening VARCHAR,
    p_NPWP VARCHAR,
    p_LinkFoto VARCHAR,
    p_Rating FLOAT,
    p_JmlPsnananSelesai INT
)
RETURNS VOID AS $$
BEGIN

    BEGIN

        UPDATE SIJARTA.USER
        SET
            Nama = p_Nama,
            JenisKelamin = p_JenisKelamin,
            NoHP = p_NoHP,
            Pwd = p_Pwd,
            TglLahir = p_TglLahir,
            Alamat = p_Alamat,
            SaldoMyPay = p_SaldoMyPay
        WHERE Id = p_id;


        IF NOT FOUND THEN
            RAISE EXCEPTION 'User with Id % does not exist.', p_id;
        END IF;


        UPDATE SIJARTA.PEKERJA
        SET
            NamaBank = p_NamaBank,
            NomorRekening = p_NomorRekening,
            NPWP = p_NPWP,
            LinkFoto = p_LinkFoto,
            Rating = p_Rating,
            JmlPsnananSelesai = p_JmlPsnananSelesai
        WHERE Id = p_id;


        IF NOT FOUND THEN
            RAISE EXCEPTION 'Pekerja with Id % does not exist.', p_id;
        END IF;

    EXCEPTION
        WHEN OTHERS THEN

            RAISE EXCEPTION 'Error occurred while updating pekerja: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.update_pekerja(
    p_id UUID,
    p_Nama VARCHAR,
    p_JenisKelamin CHAR(1),
    p_NoHP VARCHAR,
    p_TglLahir DATE,
    p_Alamat VARCHAR,
    p_NamaBank VARCHAR,
    p_NomorRekening VARCHAR,
    p_NPWP VARCHAR,
    p_LinkFoto VARCHAR
)
RETURNS VOID AS $$
BEGIN
    -- Update the user details
    UPDATE SIJARTA.USER
    SET
        Nama = p_Nama,
        JenisKelamin = p_JenisKelamin,
        NoHP = p_NoHP,
        TglLahir = p_TglLahir,
        Alamat = p_Alamat
    WHERE Id = p_id;


    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with Id % does not exist.', p_id;
    END IF;

    -- Update the pekerja details
    UPDATE SIJARTA.PEKERJA
    SET
        NamaBank = p_NamaBank,
        NomorRekening = p_NomorRekening,
        NPWP = p_NPWP,
        LinkFoto = p_LinkFoto
    WHERE Id = p_id;


    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pekerja with Id % does not exist.', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error occurred while updating pekerja: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.update_pelanggan(
    p_id UUID,
    p_Nama VARCHAR,
    p_JenisKelamin CHAR(1),
    p_NoHP VARCHAR,
    p_TglLahir DATE,
    p_Alamat VARCHAR
)
RETURNS VOID AS $$
BEGIN

    BEGIN

        UPDATE SIJARTA.USER
        SET
            Nama = p_Nama,
            JenisKelamin = p_JenisKelamin,
            NoHP = p_NoHP,
            TglLahir = p_TglLahir,
            Alamat = p_Alamat
        WHERE Id = p_id;


        IF NOT FOUND THEN
            RAISE EXCEPTION 'User with Id % does not exist.', p_id;
        END IF;

    EXCEPTION
        WHEN OTHERS THEN

            RAISE EXCEPTION 'Error occurred while updating pelanggan: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

