CREATE OR REPLACE FUNCTION add_worker(
    _pekerja_id UUID,
    _kategori_jasa_id UUID
) RETURNS VOID AS $$
BEGIN
    INSERT INTO SIJARTA.PEKERJA_KATEGORI_JASA (PekerjaId, KategoriJasaId)
    VALUES (_pekerja_id, _kategori_jasa_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION show_testimoni(
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

CREATE OR REPLACE FUNCTION show_subkategori(
    _kategori_id UUID
) RETURNS TABLE (
    Id UUID,
    NamaSubkategori VARCHAR(100),
    Deskripsi TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        Id,
        NamaSubkategori,
        Deskripsi
    FROM
        SIJARTA.SUBKATEGORI_JASA
    WHERE
        KategoriJasaId = _kategori_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION show_pekerja(
    _kategori_id UUID
) RETURNS TABLE (
    PekerjaId UUID,
    NamaPekerja VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.Id,
        p.Nama
    FROM
        SIJARTA.PEKERJA p
    INNER JOIN
        SIJARTA.PEKERJA_KATEGORI_JASA pk ON p.Id = pk.PekerjaId
    WHERE
        pk.KategoriJasaId = _kategori_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION CheckMypaySaldo()
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

CREATE TRIGGER trg_CheckMypaySaldo
BEFORE INSERT ON SIJARTA.TR_PEMESANAN_JASA
FOR EACH ROW
EXECUTE FUNCTION CheckMypaySaldo();