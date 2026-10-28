import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'email'>>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectedDeliveryAddress: Address;
  setSelectedDeliveryAddress: (address: Address) => void;
  quickFillDemoUser: (asAdmin?: boolean) => void;
}

const AUTH_STORAGE_KEY = 'crispybite_auth_v1';
const ADDRESS_STORAGE_KEY = 'crispybite_selected_address_v1';

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: 'Flat 402, Sunshine Heights, 12th Main Road, Indiranagar',
    landmark: 'Opposite Metro Station',
    city: 'Bengaluru',
    pincode: '560038',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    street: '6th Floor, Tech Hub Tower, Outer Ring Road, Bellandur',
    landmark: 'Near EcoWorld Gate 2',
    city: 'Bengaluru',
    pincode: '560103',
    isDefault: false,
  },
];

const DEMO_USER: User = {
  id: 'usr-demo-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+91 98765 43210',
  isAdmin: false,
  addresses: DEFAULT_ADDRESSES,
};

const DEMO_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'CrispyBite Admin',
  email: 'admin@crispybite.com',
  phone: '+91 98989 89898',
  isAdmin: true,
  addresses: DEFAULT_ADDRESSES,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEMO_USER; // Start logged in with demo user for smooth testing
    } catch {
      return DEMO_USER;
    }
  });

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<Address>(() => {
    try {
      const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return DEFAULT_ADDRESSES[0];
    } catch {
      return DEFAULT_ADDRESSES[0];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // LocalStorage error handled
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(selectedDeliveryAddress));
    } catch {
      // LocalStorage error handled
    }
  }, [selectedDeliveryAddress]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulated async network delay
    await new Promise((res) => setTimeout(res, 400));

    if (!email || !password) {
      return { success: false, message: 'Please enter both email/phone and password.' };
    }

    if (email.toLowerCase().includes('admin') || email === 'admin@crispybite.com') {
      setUser(DEMO_ADMIN);
      return { success: true, message: 'Welcome back, Administrator!' };
    }

    const loggedInUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ') || 'Happy Customer',
      email: email.includes('@') ? email : `${email}@crispybite.user`,
      phone: email.includes('@') ? '+91 98765 00000' : email,
      isAdmin: false,
      addresses: DEFAULT_ADDRESSES,
    };

    setUser(loggedInUser);
    return { success: true, message: `Welcome back, ${loggedInUser.name}!` };
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 400));

    if (!name || !email || !password) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone: phone || '+91 98765 12345',
      isAdmin: email.toLowerCase().includes('admin'),
      addresses: [
        {
          id: 'addr-' + Date.now(),
          label: 'Home',
          street: '12th Main Road, Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          isDefault: true,
        },
      ],
    };

    setUser(newUser);
    return { success: true, message: 'Account registered successfully! Welcome to CrispyBite.' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<Pick<User, 'name' | 'phone' | 'email'>>) => {
    if (!user) return;
    setUser({
      ...user,
      ...data,
    });
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...addressData,
      id: 'addr-' + Date.now(),
    };

    const updatedAddresses: Address[] = addressData.isDefault
      ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddress]
      : [...user.addresses, newAddress];

    setUser({
      ...user,
      addresses: updatedAddresses,
    });

    if (addressData.isDefault) {
      setSelectedDeliveryAddress(newAddress);
    }
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const filtered = user.addresses.filter((a) => a.id !== id);
    setUser({
      ...user,
      addresses: filtered,
    });
    if (selectedDeliveryAddress.id === id && filtered.length > 0) {
      setSelectedDeliveryAddress(filtered[0]);
    }
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setUser({
      ...user,
      addresses: updated,
    });
    const found = updated.find((a) => a.id === id);
    if (found) setSelectedDeliveryAddress(found);
  };

  const quickFillDemoUser = (asAdmin = false) => {
    setUser(asAdmin ? DEMO_ADMIN : DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        selectedDeliveryAddress,
        setSelectedDeliveryAddress,
        quickFillDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
