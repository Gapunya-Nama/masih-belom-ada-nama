export type ServiceOrder = {
  id: string;
  orderDate: string;
  discountCode?: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'PENDING_PAYMENT' | 'FINDING_WORKER' | 'COMPLETED';
  serviceCategory: string;
  serviceSession: string;
  price: number;
  workerName?: string;
};

export type ServiceOrderFormData = Omit<ServiceOrder, 'id' | 'status' | 'serviceCategory' | 'serviceSession' | 'price' | 'workerName'>;