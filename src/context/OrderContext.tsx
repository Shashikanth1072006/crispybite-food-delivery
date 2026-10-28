import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerDetails, Order, OrderPricing, OrderStatus, PaymentMethod } from '../types';
import { useCart } from './CartContext';

interface PlaceOrderParams {
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  pricing: OrderPricing;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderStage: (orderId: string) => void;
  reorder: (orderId: string) => void;
}

const ORDER_STORAGE_KEY = 'crispybite_orders_v1';

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'CB-884129',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'out_for_delivery',
    items: [
      {
        cartItemId: 'item-demo-1',
        product: {
          id: 'prod-chicken-1',
          name: 'Original Crispy Chicken (4 Pcs)',
          description: 'Secret 11 herbs & spices crispy chicken drumsticks',
          price: 249,
          category: 'chicken',
          image: '/assets/images/hero_crispy_chicken_1791867060918.jpg',
          rating: 4.8,
          reviewsCount: 1420,
          isVeg: false,
          available: true,
        },
        quantity: 1,
        spiceLevel: 'Original Recipe',
        selectedAddons: [
          { id: 'add-1', name: 'Signature Garlic Mayo Dip', price: 35 },
        ],
        unitPrice: 284,
        totalPrice: 284,
      },
      {
        cartItemId: 'item-demo-2',
        product: {
          id: 'prod-burger-1',
          name: 'Spicy Zinger-Style Burger',
          description: 'Crisp chicken fillet with spicy mayonnaise',
          price: 229,
          category: 'burgers',
          image: '/assets/images/burger_crispy_zinger_1791867061124.jpg',
          rating: 4.9,
          reviewsCount: 3200,
          isVeg: false,
          available: true,
        },
        quantity: 2,
        spiceLevel: 'Original Zinger',
        selectedAddons: [],
        unitPrice: 229,
        totalPrice: 458,
      },
    ],
    pricing: {
      subtotal: 742,
      deliveryFee: 0,
      tax: 37,
      discount: 148,
      total: 631,
      couponCode: 'CRISPY50',
    },
    customer: {
      name: 'Alex Johnson',
      phone: '+91 98765 43210',
      street: 'Flat 402, Sunshine Heights, 12th Main Road, Indiranagar',
      landmark: 'Opposite Metro Station',
      city: 'Bengaluru',
      pincode: '560038',
      addressType: 'Home',
      instructions: 'Please ring the bell twice and leave package on table.',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedDeliveryTime: '12-15 mins remaining',
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 11223',
      rating: 4.9,
    },
  },
  {
    id: 'ord-1002',
    orderNumber: 'CB-761904',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    items: [
      {
        cartItemId: 'item-demo-3',
        product: {
          id: 'prod-bucket-1',
          name: 'Family Chicken Bucket (8 Pcs)',
          description: 'Crunchy chicken drumsticks with large fries',
          price: 799,
          category: 'buckets',
          image: '/assets/images/bucket_family_feast_1791867062066.jpg',
          rating: 4.9,
          reviewsCount: 2750,
          isVeg: false,
          available: true,
        },
        quantity: 1,
        spiceLevel: 'Half Original / Half Spicy',
        selectedAddons: [],
        unitPrice: 799,
        totalPrice: 799,
      },
    ],
    pricing: {
      subtotal: 799,
      deliveryFee: 0,
      tax: 40,
      discount: 200,
      total: 639,
      couponCode: 'FEAST100',
    },
    customer: {
      name: 'Alex Johnson',
      phone: '+91 98765 43210',
      street: 'Flat 402, Sunshine Heights, 12th Main Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      addressType: 'Home',
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    estimatedDeliveryTime: 'Delivered',
  },
];

const ORDER_STATUS_FLOW: OrderStatus[] = [
  'placed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items: cartItems, clearCart, addToCart, openCart } = useCart();
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // LocalStorage error handled
    }
  }, [orders]);

  const placeOrder = async ({
    customer,
    paymentMethod,
    pricing,
  }: PlaceOrderParams): Promise<Order> => {
    // Generate order ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `CB-${randomDigits}`;
    const newOrderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'placed',
      items: [...cartItems],
      pricing,
      customer,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      estimatedDeliveryTime: '25-30 mins',
      deliveryPartner: {
        name: 'Vikas Sharma',
        phone: '+91 98111 22334',
        rating: 4.9,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();

    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const advanceOrderStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
        if (currentIndex < ORDER_STATUS_FLOW.length - 1) {
          const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1];
          return {
            ...order,
            status: nextStatus,
            estimatedDeliveryTime:
              nextStatus === 'delivered' ? 'Delivered successfully' : order.estimatedDeliveryTime,
          };
        }
        return order;
      })
    );
  };

  const reorder = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    // Add all items to cart
    order.items.forEach((item) => {
      addToCart(
        item.product,
        item.quantity,
        item.spiceLevel,
        item.selectedAddons,
        item.specialInstructions
      );
    });

    openCart();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        advanceOrderStage,
        reorder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

