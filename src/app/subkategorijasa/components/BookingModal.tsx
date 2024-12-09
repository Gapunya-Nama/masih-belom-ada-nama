// src/components/BookingModal.tsx

"use client";

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Diskon, MetodeBayar, PemesananJasa, SesiLayanan, SubCategory } from '@/lib/dataType/interfaces';
import { toast } from '@/components/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

interface Props {
    open: boolean;
    onClose: () => void;
    sesilayanan: SesiLayanan;
    metodebayar: MetodeBayar[];
    subcategory: SubCategory;
}

interface CreatePemesananJasa {
    command: string;
    tglPemesanan: string;
    tglPekerjaan: string;
    waktuPekerjaan: string;
    totalBiaya: number;
    idPelanggan: string;
    idPekerja: string;
    idKategoriJasa: string;
    sesi: number;
    idDiskon: string | null;
    idMetodeBayar: string;
}

export default function BookingModal({ open, sesilayanan, onClose, metodebayar, subcategory }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const [promoCode, setPromoCode] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | ''>('');
    const [isPromoCodeVerified, setIsPromoCodeVerified] = useState<boolean>(false);
    const [totalBiaya, setTotalBiaya] = useState<number>(sesilayanan.harga);

    useEffect(() => {
        if (!open) {
            setVerificationMessage('');
            setVerificationStatus('');
            setPromoCode('');
            setIsPromoCodeVerified(false);
            setTotalBiaya(sesilayanan.harga);
        }
    }, [open, sesilayanan.harga]);

    const handleVerifyPromoCode = async () => {
        if (!user) {
            setVerificationMessage('Anda harus login untuk verifikasi diskon.');
            setVerificationStatus('error');
            return;
        }

        if (!promoCode.trim()) {
            setVerificationMessage('Kode diskon tidak boleh kosong.');
            setVerificationStatus('error');
            return;
        }

        try {
            const response = await fetch('/api/verifikasidiskon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kode: promoCode }),
            });

            if (!response.ok) {
                throw new Error('Gagal memverifikasi kode promo.');
            }

            const data: Diskon = await response.json();
            if (data && data.potongan && data.mintrpemesanan) {
                setVerificationMessage('Diskon berhasil digunakan.');
                setVerificationStatus('success');
                setIsPromoCodeVerified(true);
                setTotalBiaya(sesilayanan.harga - data.potongan);
            } else if (data.mintrpemesanan > sesilayanan.harga) {
                setVerificationMessage('Total biaya tidak memenuhi syarat diskon.');
                setVerificationStatus('error');
                setIsPromoCodeVerified(false);
            } else {
                setVerificationMessage('Diskon tidak ditemukan.');
                setVerificationStatus('error');
                setIsPromoCodeVerified(false);
            }
        } catch (error: any) {
            setVerificationMessage(error.message || 'Gagal memverifikasi kode promo.');
            setVerificationStatus('error');
            setIsPromoCodeVerified(false);
        }
    };

    const handleSubmit = async () => {
        if (
            !tglPemesanan ||
            sesilayanan.harga <= 0 ||
            !user?.id ||
            !subcategory.idkategori ||
            sesilayanan.sesi <= 0 ||
            !idMetodeBayar ||
            (promoCode.trim() && !isPromoCodeVerified)
        ) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields correctly.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedMetodeBayar: MetodeBayar | undefined = metodebayar.find(
                (metode) => metode.nama === paymentMethod
            );

            if (!selectedMetodeBayar) {
                throw new Error('Metode pembayaran tidak valid.');
            }

            const pemesananData: CreatePemesananJasa = {
                command: 'add',
                tglPemesanan: new Date().toISOString().split('T')[0],
                tglPekerjaan: '0001-01-01',
                waktuPekerjaan: '0001-01-01 12:00:00',
                totalBiaya: sesilayanan.harga,
                idPelanggan: user.id,
                idPekerja: '00000000-0000-0000-0000-000000000000',
                idKategoriJasa: subcategory.id,
                sesi: sesilayanan.sesi,
                idDiskon: promoCode.trim() !== '' ? promoCode.trim() : null,
                idMetodeBayar: selectedMetodeBayar.id,
            };

            const response = await fetch('/api/pemesananjasa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pemesananData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambah pemesanan jasa');
            }

            const data: PemesananJasa = await response.json();

            toast({
                title: 'Success',
                description: 'Pemesanan jasa berhasil ditambahkan.',
            });
            router.push('/pemesananjasa');
            onClose();
        } catch (error: any) {
            console.error('Error adding pemesanan jasa:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal menambah pemesanan jasa.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [tglPemesanan, setTglPemesanan] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [idMetodeBayar, setIdMetodeBayarState] = useState<string>('');

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
        const selected = metodebayar.find(m => m.nama === value);
        setIdMetodeBayarState(selected ? selected.id : '');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Pemesanan Jasa</DialogTitle>
                </DialogHeader>
                <form>
                    {/* Tanggal Pemesanan */}
                    <div>
                        <label htmlFor="tglPemesanan">Tanggal Pemesanan:</label>
                        <Input
                            type="date"
                            id="tglPemesanan"
                            value={tglPemesanan}
                            readOnly
                            required
                            className="bg-gray-100"
                        />
                    </div>

                    {/* Total Biaya */}
                    <div>
                        <label htmlFor="totalBiaya">Total Biaya:</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp</span>
                            <Input
                                type="number"
                                id="totalBiaya"
                                value={totalBiaya}
                                readOnly
                                className="pl-10 bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Sesi */}
                    <div>
                        <label htmlFor="sesi">Sesi:</label>
                        <Input
                            type="number"
                            id="sesi"
                            value={sesilayanan.sesi}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>

                    {/* ID Diskon */}
                    <label htmlFor="promoCode">ID Diskon:</label>
                    <div className="relative">
                        <Input
                            type="text"
                            id="promoCode"
                            value={promoCode}
                            onChange={(e) => {
                                setPromoCode(e.target.value);
                                setVerificationMessage('');
                                setVerificationStatus('');
                                setIsPromoCodeVerified(false);
                            }}
                            placeholder="Masukkan kode promo (opsional)"
                            className="pr-20"
                            readOnly={isPromoCodeVerified} // Membuat input tidak bisa diedit setelah verifikasi berhasil
                        />
                        {!isPromoCodeVerified && (
                            <Button
                                type="button"
                                onClick={handleVerifyPromoCode}
                                disabled={!promoCode.trim()}
                                className="absolute right-0 top-0 h-full px-4 bg-[#2ECC71] text-white rounded-r-lg hover:bg-[#27AE60]"
                            >
                                Verifikasi
                            </Button>
                        )}
                    </div>
                    {verificationMessage && (
                        <p className={verificationStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                            {verificationMessage}
                        </p>
                    )}

                    {/* ID Metode Bayar */}
                    <div>
                        <label htmlFor="paymentMethod">Metode Bayar:</label>
                        <Select onValueChange={handlePaymentMethodChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Metode Bayar" />
                            </SelectTrigger>
                            <SelectContent>
                                {metodebayar.map((metode) => (
                                    <SelectItem key={metode.id} value={metode.nama}>
                                        {metode.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tombol Submit */}
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || (!!promoCode.trim() && !isPromoCodeVerified)}
                        className="mt-4"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}