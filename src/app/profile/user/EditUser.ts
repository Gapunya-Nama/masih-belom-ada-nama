"use server"
import { callStoredProcedure } from "@/lib/database/function";
import { AuthCombined, Gender } from "@/lib/dataType/interfaces";


export async function editAccount(values: string[]) :Promise <Partial<AuthCombined> | false>{
    console.log(values);
    let result: true | false = false;
    let user: AuthCombined | false = false; 
    let gender: Gender = 'Other';
    try{
        result = await callStoredProcedure("update_pelanggan", [
            values[0],
            values[1],
            values[2],
            values[3],
            values[4],
            values[5],
        ]) || false;
        if (result) {
            switch (values[2]) {
                case 'L': // Male (Laki-Laki)
                gender = 'Laki-Laki';
                break;
                case 'P': // Female (Perempuan)
                gender = 'Perempuan';
                break;
            }
            
            user = {
                name: values[1],       
                gender: gender,     
                pno: values[3],      
                birth_date: values[4],  
                address: values[5],   
            } as AuthCombined;
        }

        return user;
    }catch (error){
        console.log(error);
        return false;
    }
};