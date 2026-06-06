/**
 * Data definitions for Green Mango E-Commerce
 */

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: 'fresh-mango' | 'juice' | 'mango-bar' | 'pickle';
  description: string;
  descriptionEn: string;
  price: number;
  discountPrice?: number;
  unit: string;
  image: string;
  rating: number;
  stock: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  address: string;
  phone: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  paymentMethod: 'bkash' | 'nagad' | 'cod';
  paymentNumber?: string;
  transactionId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}
