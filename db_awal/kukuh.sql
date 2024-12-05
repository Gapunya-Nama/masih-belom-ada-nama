
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


CREATE OR REPLACE PROCEDURE SIJARTA.top_up_myPay(
    p_id UUID,
    p_userId UUID,
    p_nominal DECIMAL(15, 2)
) AS $$
BEGIN
    -- Insert a new transaction with the provided UUID
    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (p_id, p_userId, CURRENT_DATE, p_nominal, '950e8400-e29b-41d4-a716-446655444000'); -- 'Top-up' category ID

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
    -- Insert a new transaction for the payment
    INSERT INTO SIJARTA.TR_MYPAY (Id, UserId, Tgl, Nominal, KategoriId)
    VALUES (p_id, p_userId, CURRENT_DATE, -p_nominal, '950e8400-e29b-41d4-a716-446655444001'); -- 'Service Payment' category ID

    -- Ensure balance does not go negative
    IF ((SELECT SaldoMyPay FROM SIJARTA.USER WHERE Id = p_userId) - p_amount) < 0 THEN
        RAISE EXCEPTION 'Insufficient balance for payment.';
    END IF;

    -- Update the user's SaldoMyPay
    UPDATE SIJARTA.USER
    SET SaldoMyPay = SaldoMyPay - p_amount
    WHERE Id = p_userId;
END;
$$ LANGUAGE plpgsql;
