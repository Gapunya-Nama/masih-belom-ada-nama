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
    level VARCHAR,
    bank_name VARCHAR,
    account_number VARCHAR,
    npwp VARCHAR,
    rating FLOAT,
    completed_orders INT,
    photo_url VARCHAR,
    categories TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.Id,
        u.NoHP AS pno,
        CASE
            WHEN p.Id IS NOT NULL THEN 'user'
            WHEN w.Id IS NOT NULL THEN 'worker'
            ELSE 'guest'
        END AS role,
        u.Nama AS name,
        CASE u.JenisKelamin
            WHEN 'M' THEN 'Male'
            WHEN 'F' THEN 'Female'
            ELSE 'Other'
        END AS gender,
        u.TglLahir AS birth_date,
        u.Alamat AS address,
        u.SaldoMyPay AS balance,
        p.Level AS level,
        w.NamaBank AS bank_name,
        w.NomorRekening AS account_number,
        w.NPWP AS npwp,
        w.Rating AS rating,
        w.JmlPsnananSelesai AS completed_orders,
        w.LinkFoto AS photo_url,
        STRING_AGG(kj.NamaKategori, ',') AS categories
    FROM 
        SIJARTA.USER u
        LEFT JOIN SIJARTA.PELANGGAN p ON u.Id = p.Id
        LEFT JOIN SIJARTA.PEKERJA w ON u.Id = w.Id
        LEFT JOIN SIJARTA.PEKERJA_KATEGORI_JASA pkj ON w.Id = pkj.PekerjaId
        LEFT JOIN SIJARTA.KATEGORI_JASA kj ON pkj.KategoriJasaId = kj.Id
    WHERE 
        u.NoHP = p_nohp AND u.Pwd = p_pwd
    GROUP BY 
        u.Id, p.Level, w.NamaBank, w.NomorRekening, w.NPWP, 
        w.Rating, w.JmlPsnananSelesai, w.LinkFoto;
END;
$$ LANGUAGE plpgsql;
