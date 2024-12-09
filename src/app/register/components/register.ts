"use server"
import { callStoredProcedure } from "@/lib/database/function";
import { AuthCombined, Gender, Role } from "@/lib/dataType/interfaces";
import { v4 } from "uuid";


export async function registerAccount(values: string[]) :Promise <AuthCombined | false> {
    console.log("ini adalah backend register",values);
    const p_id = v4();
    let result: true | false = false;
    let user: AuthCombined | false = false; 
    let gender: Gender = 'Other';

    if (values[6] == "user"){
        console.log(values[6])

    
        try{
            result = await callStoredProcedure("insert_pelanggan", [
                p_id,
                values[0],
                values[1],
                values[2],
                values[3],
                values[4],
                values[5],
                0,
                "Bronze"
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
                    id: p_id,              
                    name: values[0],       
                    password: values[1],
                    role: values[6] as Role,
                    gender: gender,     
                    pno: values[3],      
                    birth_date: values[4],  
                    address: values[5],    
                    balance: 0,            
                    level: "Bronze"        
                } as AuthCombined;
            }
        
            return user;
        }catch (error){
            console.log(error);
            return false;
        }
    }else{
        console.log(values[2]);
        try{
            result = await callStoredProcedure("insert_pekerja", [
                p_id,
                values[0],
                values[1],
                values[2],
                values[3],
                values[4],
                values[5],
                0,
                values[6],
                values[7],
                values[8],
                values[9],
                0.0,
                0
            ]) || false;
            if (result) {
                console.log(result);
                switch (values[2]) {
                    case 'L': // Male (Laki-Laki)
                    gender = 'Laki-Laki';
                    break;
                    case 'P': // Female (Perempuan)
                    gender = 'Perempuan';
                    break;
                }
                
                user = {
                    id: p_id,              
                    name: values[0],       
                    password: values[1],
                    role: values[10] as Role,
                    gender: gender,     
                    pno: values[3],      
                    birth_date: values[4],  
                    address: values[5],    
                    balance: 0,   
                    accountNumber: values[7],
                    bankName: values[8],
                    npwp: values[9],
                    rating: 0,
                    completedOrders: 0,
                    photoUrl: values[9],
                    categories: []

                          
                } as AuthCombined;
            }
        
            return user;
        }catch (error){
            console.log(error);
            return false;
        }
    };
    

    
//     try {
        
//         const validatedData = workerSchema.parse(values);

//         // const user = await authenticateUser(values);

//         try{
//             return await callStoredProcedure<void>(
//               'insert_pekerja',
//               [
//                 validatedData.id,
//                 validatedData.name,
//                 validatedData.gender,
//                 validatedData.noHP,
//                 validatedData.password,
//                 validatedData.birthDate,
//                 validatedData.address,
//                 0,
//                 validatedData.bankName,
//                 validatedData.accountNumber,
//                 validatedData.npwp,
//                 validatedData.photoUrl,
//                 0,
//                 0
//               ]
//             );
//           }
//           catch (error){
//             throw error;
//           }
        
//         console.log(user);
        
//         login(user);

//         toast({
//             title: "Login successful!",
//             description: `Welcome back, ${user.name}`,
//         });

//         router.push("/homepage");
//     } catch (error) {
//         toast({
//             variant: "destructive",
//             title: "Login failed",
//             description: error instanceof Error ? error.message : "Please try again",
//         });
//     } finally {
//         setIsLoading(false);
//     }
}