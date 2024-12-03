
CREATE OR REPLACE FUNCTION SIJARTA.get_myPay_transac_history(
    User_Id UUID
)
RETURNS TABLE (
    id UUID , 
    userId UUID, 
    date DATE, 
    amount DECIMAL(15, 2), 
    categoryId UUID,
    namaKategori VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.Id AS id,
        mp.UserId AS userId,
        mp.Tgl AS date,
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


