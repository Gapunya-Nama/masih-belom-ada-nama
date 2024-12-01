
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
    balance DECIMAL(15,2)
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
            WHEN 'M' THEN 'Male'::VARCHAR
            WHEN 'F' THEN 'Female'::VARCHAR
            ELSE 'Other'::VARCHAR
        END AS gender,
        u.TglLahir AS birth_date,
        u.Alamat AS address,
        u.SaldoMyPay AS balance
    FROM 
        SIJARTA.USER u
        LEFT JOIN SIJARTA.PELANGGAN p ON u.Id = p.Id
        LEFT JOIN SIJARTA.PEKERJA w ON u.Id = w.Id
    WHERE 
        u.NoHP = p_nohp AND u.Pwd = p_pwd;
END;
$$ LANGUAGE plpgsql;


-- Untuk register
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
