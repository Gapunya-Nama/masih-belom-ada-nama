CREATE OR REPLACE FUNCTION SIJARTA.show_pekerja(
    _kategori_id UUID
) RETURNS TABLE (
    PekerjaId UUID,
    NamaPekerja VARCHAR(100),
    LinkFoto VARCHAR(255),
    Rating FLOAT,
    CompletedJobs BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.Id AS PekerjaId,
        u.Nama AS NamaPekerja,
        p.LinkFoto AS LinkFoto,
        p.Rating AS Rating,
        COUNT(tpj.Id) AS CompletedJobs
    FROM
        SIJARTA.KATEGORI_JASA kj
    LEFT JOIN SIJARTA.SUBKATEGORI_JASA skj ON kj.id = skj.KategoriJasaId
    LEFT JOIN SIJARTA.PEKERJA_KATEGORI_JASA pkj ON kj.id = pkj.KategoriJasaId
    LEFT JOIN SIJARTA.PEKERJA p ON pkj.PekerjaId = p.Id
    LEFT JOIN SIJARTA.USER u ON p.Id = u.Id
    LEFT JOIN SIJARTA.TR_PEMESANAN_JASA tpj ON p.Id = tpj.IdPekerja
    WHERE
        kj.Id = _kategori_id
    GROUP BY
        p.Id, u.Nama, p.LinkFoto, p.Rating;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.add_pekerja_kategori_jasa(
    _pekerja_id UUID,
    _kategori_jasa_id UUID
) RETURNS VOID AS $$
BEGIN
    INSERT INTO SIJARTA.PEKERJA_KATEGORI_JASA (PekerjaId, KategoriJasaId)
    VALUES (_pekerja_id, _kategori_jasa_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.show_testimoni(
    _kategori_id UUID
) RETURNS TABLE (
    IdTrPemesanan UUID,
    Tgl DATE,
    Teks TEXT,
    Rating INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.IdTrPemesanan,
        t.Tgl,
        t.Teks,
        t.Rating
    FROM
        SIJARTA.TESTIMONI t
    INNER JOIN
        SIJARTA.TR_PEMESANAN_JASA p ON t.IdTrPemesanan = p.Id
    WHERE
        p.KategoriId = _kategori_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.show_subkategori(
    namaParam VARCHAR(100)
) RETURNS TABLE (
    id UUID,
    nama VARCHAR(100),
    deskripsi TEXT,
    idKategori UUID,
    namaKategori VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        skj.Id AS id,
        skj.NamaSubkategori AS nama,
        skj.Deskripsi AS deskripsi,
        kj.Id AS idKategori,
        kj.NamaKategori AS namaKategori
    FROM
        SIJARTA.SUBKATEGORI_JASA AS skj
    JOIN SIJARTA.KATEGORI_JASA AS kj ON kj.Id = skj.KategoriJasaId
    WHERE
        skj.Id::VARCHAR(100) = namaParam;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.CheckMypaySaldo()
RETURNS TRIGGER
AS $$
DECLARE 
    saldo DECIMAL(15,2);
BEGIN
    SELECT SaldoMyPay INTO saldo
    FROM SIJARTA.USER
    WHERE Id = NEW.IdPelanggan;

    IF saldo < NEW.TotalBiaya THEN
        RAISE EXCEPTION 'Saldo mypay pelanggan tidak cukup.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.show_metode_bayar()
RETURNS TABLE (ListMetode VARCHAR(100)) AS $$
BEGIN
    RETURN QUERY
    SELECT Nama
    FROM SIJARTA.METODE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.get_kategori_jasa()
RETURNS TABLE (
    id UUID, 
    namakategori VARCHAR,
    namasubkategori VARCHAR[],
    idsubkategori UUID[],
    idpekerja UUID[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kj.Id AS id,
        kj.NamaKategori AS namaKategori,
        array_agg(skj.NamaSubkategori) AS namasubkategori,
        array_agg(skj.id) AS idsubkategori,
        array_agg(p.Id) AS idpekerja
    FROM 
        SIJARTA.KATEGORI_JASA kj
    LEFT JOIN SIJARTA.SUBKATEGORI_JASA skj ON kj.id = skj.KategoriJasaId
    LEFT JOIN SIJARTA.PEKERJA_KATEGORI_JASA pkj ON kj.id = pkj.KategoriJasaId
    LEFT JOIN SIJARTA.PEKERJA p ON pkj.PekerjaId = p.Id
    GROUP BY 
        kj.Id, kj.NamaKategori;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.get_sesilayanan(
    subkategori_id UUID
) RETURNS TABLE (
    id TEXT,
    Sesi INT,
    Harga DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CONCAT(ss.SubkategoriId::TEXT, '-', ss.sesi::TEXT) AS id,
        ss.sesi AS Sesi,
        ss.harga AS Harga
    FROM
        SIJARTA.SESI_LAYANAN ss
    WHERE
        ss.SubkategoriId = subkategori_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.add_pekerja_kategori_jasa(
    _pekerja_id UUID,
    _kategori_jasa_id UUID
) RETURNS VOID AS $$
BEGIN
    INSERT INTO SIJARTA.PEKERJA_KATEGORI_JASA (PekerjaId, KategoriJasaId)
    VALUES (_pekerja_id, _kategori_jasa_id)
    ON CONFLICT (PekerjaId, KategoriJasaId) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.get_metode_bayar()
RETURNS TABLE (
    idmetode UUID,
    namametode VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mb.Id,
        mb.Nama
    FROM
        SIJARTA.METODE_BAYAR mb;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.get_pemesanan_jasa(
    _id_USER UUID
)
RETURNS TABLE (
    id UUID, 
    namakategori VARCHAR,
    namasubkategori VARCHAR,
    idkategori UUID,
    idsubkategori UUID,
    namapekerja VARCHAR,
    idpekerja UUID,
    tanggalpemesanan DATE,
    biaya DECIMAL(15,2),
    sesi INT,
    statuspesanan VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pj.Id,
        kj.NamaKategori,
        sj.NamaSubkategori,
        kj.Id AS idkategori,
        sj.Id AS idsubkategori,
        u.Nama AS namapekerja,
        p.Id AS idpekerja,
        pj.TglPemesanan,
        pj.TotalBiaya,
        pj.Sesi,
        sp.Status AS statuspesanan
    FROM
        SIJARTA.TR_PEMESANAN_JASA pj
    INNER JOIN SIJARTA.SESI_LAYANAN sl ON pj.IdKategoriJasa = sl.SubkategoriId AND pj.Sesi = sl.Sesi
    INNER JOIN SIJARTA.SUBKATEGORI_JASA sj ON sl.SubkategoriId = sj.Id
    INNER JOIN SIJARTA.KATEGORI_JASA kj ON sj.KategoriJasaId = kj.Id
    LEFT JOIN SIJARTA.PEKERJA p ON pj.IdPekerja = p.Id
    LEFT JOIN SIJARTA.USER u ON p.Id = u.Id
    LEFT JOIN (
        SELECT
            tps.IdTrPemesanan,
            sp.Status,
            ROW_NUMBER() OVER (PARTITION BY tps.IdTrPemesanan ORDER BY tps.TglWaktu DESC) AS rn
        FROM
            SIJARTA.TR_PEMESANAN_STATUS tps
        JOIN
            SIJARTA.STATUS_PESANAN sp ON tps.IdStatus = sp.Id
    ) sp ON sp.IdTrPemesanan = pj.Id AND sp.rn = 1
    WHERE
        pj.IdPelanggan = _id_USER;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.update_status_pesanan(
    _id_tr_pemesanan UUID,
    _id_status UUID,
    _tgl_waktu TIMESTAMP
) RETURNS VOID AS $$
BEGIN
    INSERT INTO SIJARTA.TR_PEMESANAN_STATUS (IdTrPemesanan, IdStatus, TglWaktu)
    VALUES (_id_tr_pemesanan, _id_status, _tgl_waktu);
END;
$$ LANGUAGE plpgsql;

DELETE FROM SIJARTA.PEKERJA_KATEGORI_JASA
WHERE PekerjaId = '550e8400-e29b-41d4-a716-446655440007'
  AND KategoriJasaId IN (
    '650e8400-e29b-41d4-a716-446655441002',
    '650e8400-e29b-41d4-a716-446655441004',
    '650e8400-e29b-41d4-a716-446655441000'
  );