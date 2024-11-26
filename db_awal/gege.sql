CREATE OR REPLACE FUNCTION check_user_exists(nama TEXT, nohp TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_count INT;
BEGIN
    
    SELECT COUNT(*) INTO user_count
    FROM SIJARTA.USER
    WHERE nama = $1 AND nohp = $2;

    
    IF user_count > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;
