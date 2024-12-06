// "use client";

// import { useState } from 'react';
// // import { ServiceSession } from '../data/subcategories';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useRouter } from 'next/navigation';

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   // session: ServiceSession | undefined;
// }

// export default function BookingModal({ open, onClose }: Props) {
//   const router = useRouter();
//   const [promoCode, setPromoCode] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (!session) return;
    
//     setIsSubmitting(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Redirect to booking view page
//     router.push('/pemesananjasa');
//     setIsSubmitting(false);
//     onClose();
//   };

//   if (!session) return null;

//   const today = new Date().toLocaleDateString('id-ID');
//   const total = session.price; // In a real app, apply promo code discount here

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Pemesanan Jasa</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Tanggal Pemesanan</label>
//             <Input value={today} disabled />
//           </div>
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Kode Promo</label>
//             <Input
//               placeholder="Masukkan kode promo"
//               value={promoCode}
//               onChange={(e) => setPromoCode(e.target.value)}
//             />
//           </div>
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Total Pembayaran</label>
//             <Input
//               value={`Rp ${total.toLocaleString('id-ID')}`}
//               disabled
//             />
//           </div>
//           <div className="grid gap-2">
//             <label className="text-sm font-medium">Metode Pembayaran</label>
//             <Select value={paymentMethod} onValueChange={setPaymentMethod}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Pilih metode pembayaran" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="transfer">Transfer Bank</SelectItem>
//                 <SelectItem value="ewallet">E-Wallet</SelectItem>
//                 <SelectItem value="cash">Tunai</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="flex justify-end gap-3">
//           <Button variant="outline" onClick={onClose}>
//             Batal
//           </Button>
//           <Button
//             className="bg-[#2ECC71] hover:bg-[#27AE60]"
//             onClick={handleSubmit}
//             disabled={!paymentMethod || isSubmitting}
//           >
//             {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }