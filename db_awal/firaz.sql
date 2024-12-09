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
    id UUID,
    nama VARCHAR
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
    _id_pelanggan UUID
)
RETURNS TABLE (
    id UUID,
    namakategori VARCHAR,
    namasubkategori VARCHAR,
    idkategori UUID,
    idsubkategori UUID,
    namapekerja VARCHAR,
    idpekerja UUID,
    tanggalpemesanan TIMESTAMP,
    biaya DECIMAL(15,2),
    sesi INT,
    statuspesanan VARCHAR,
    namametodebayar VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH LatestStatus AS (
        SELECT
            tsp.IdTrPemesanan,
            tsp.IdStatus,
            sp.Status AS statuspesanan,
            ROW_NUMBER() OVER (
                PARTITION BY tsp.IdTrPemesanan
                ORDER BY tsp.TglWaktu DESC
            ) AS rn
        FROM
            SIJARTA.TR_PEMESANAN_STATUS tsp
        JOIN
            SIJARTA.STATUS_PESANAN sp ON tsp.IdStatus = sp.Id
    )
    SELECT
        tpj.Id AS id,
        kj.NamaKategori AS namakategori,
        skj.NamaSubkategori AS namasubkategori,
        kj.Id AS idkategori,
        skj.Id AS idsubkategori,
        u.Nama AS namapekerja,
        p.Id AS idpekerja,
        tpj.TglPemesanan AS tanggalpemesanan,
        tpj.TotalBiaya AS biaya,
        tpj.Sesi AS sesi,
        ls.statuspesanan,
        mb.Nama AS namametodebayar
    FROM
        SIJARTA.TR_PEMESANAN_JASA tpj
    JOIN
        SIJARTA.PEKERJA p ON tpj.IdPekerja = p.Id
    JOIN
        SIJARTA.USER u ON p.Id = u.Id
    JOIN
        SIJARTA.SESI_LAYANAN sl ON tpj.IdKategoriJasa = sl.SubkategoriId AND tpj.Sesi = sl.Sesi
    JOIN
        SIJARTA.SUBKATEGORI_JASA skj ON sl.SubkategoriId = skj.Id
    JOIN
        SIJARTA.KATEGORI_JASA kj ON skj.KategoriJasaId = kj.Id
    JOIN
        LatestStatus ls ON tpj.Id = ls.IdTrPemesanan AND ls.rn = 1
    JOIN
        SIJARTA.METODE_BAYAR mb ON tpj.IdMetodeBayar = mb.Id
    WHERE
        tpj.IdPelanggan = _id_pelanggan
    ORDER BY
        tpj.TglPemesanan DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION SIJARTA.insert_pemesanan_jasa(
    _tgl_pemesanan TIMESTAMP,
    _tgl_pekerjaan TIMESTAMP,
    _waktu_pekerjaan TIMESTAMP,
    _total_biaya DECIMAL(15,2),
    _id_pelanggan UUID,
    _id_pekerja UUID,
    _id_kategori_jasa UUID,
    _sesi INT,
    _id UUID,
    _id_metode_bayar UUID,
    _id_diskon VARCHAR(50)
) RETURNS TABLE (
    id UUID,
    namakategori VARCHAR,
    namasubkategori VARCHAR,
    idkategori UUID,
    idsubkategori UUID,
    namapekerja VARCHAR,
    idpekerja UUID,
    tanggalpemesanan VARCHAR,
    biaya DECIMAL(15,2),
    sesi INT,
    statuspesanan VARCHAR
) AS $$
BEGIN
    -- Menyisipkan data ke tabel TR_PEMESANAN_JASA
    INSERT INTO SIJARTA.TR_PEMESANAN_JASA (
        Id,
        TglPemesanan,
        TglPekerjaan,
        WaktuPekerjaan,
        TotalBiaya,
        IdPelanggan,
        IdPekerja,
        IdKategoriJasa,
        Sesi,
        IdDiskon,
        IdMetodeBayar
    ) VALUES (
        _id,
        _tgl_pemesanan,
        _tgl_pekerjaan,
        _waktu_pekerjaan,
        _total_biaya,
        _id_pelanggan,
        _id_pekerja,
        _id_kategori_jasa,
        _sesi,
        _id_diskon,
        _id_metode_bayar
    );

    -- Menyisipkan status awal ke tabel TR_PEMESANAN_STATUS
    INSERT INTO SIJARTA.TR_PEMESANAN_STATUS (
        IdTrPemesanan,
        IdStatus,
        TglWaktu
    ) VALUES (
        _id,
        (SELECT spn.Id FROM SIJARTA.STATUS_PESANAN spn WHERE Status = 'Menunggu Pembayaran' LIMIT 1),
        NOW()
    );

    -- Mengembalikan semua field sesuai dengan interface PemesananJasa
    RETURN QUERY
    SELECT
        pj.Id,
        kj.NamaKategori,
        sj.NamaSubkategori,
        kj.Id AS idkategori,
        sj.Id AS idsubkategori,
        u.Nama AS namapekerja,
        p.Id AS idpekerja,
        pj.TglPemesanan::VARCHAR,
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
        pj.Id = _id;
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

CREATE OR REPLACE FUNCTION SIJARTA.get_diskon(
    _kode_diskon VARCHAR(50)
) RETURNS TABLE (
    potongan NUMERIC(15, 2),
    mintrpemesanan INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT D.potongan, D.MinTrPemesanan
    FROM SIJARTA.DISKON D
    WHERE D.Kode = _kode_diskon;
END;
$$ LANGUAGE plpgsql;

DELETE FROM SIJARTA.PEKERJA_KATEGORI_JASA
WHERE PekerjaId = '550e8400-e29b-41d4-a716-446655440007'
  AND KategoriJasaId IN (
    '650e8400-e29b-41d4-a716-446655441002',
    '650e8400-e29b-41d4-a716-446655441004',
    '650e8400-e29b-41d4-a716-446655441000'
  );