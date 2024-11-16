'use client'
import { useParams } from 'next/navigation';

export default function DetailJasa() {
    const params = useParams();
    const { JasaId } = params; 

    return (
        <h1 className='flex items-center justify-center min-h-screen font-bold'>Detail Jasa {JasaId}</h1>
    );
}
