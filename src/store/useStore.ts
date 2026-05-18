import { create } from 'zustand';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'exchange' | 'topup';
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
  date: string;
  category: 'food' | 'transport' | 'shopping' | 'entertainment' | 'transfer' | 'exchange' | 'topup';
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rateToEFI: number;
  flag: string;
}

interface StoreState {
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactions: Transaction[];
  contacts: Contact[];
  currencies: Currency[];
  balanceVisible: boolean;
  toggleBalanceVisible: () => void;
  sendMoney: (amount: number, to: string) => void;
  addBalance: (amount: number) => void;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 500,
    currency: 'EFI',
    description: 'Welcome bonus',
    counterparty: 'Efi Bank',
    date: '2026-05-18T10:00:00',
    category: 'topup',
  },
  {
    id: '2',
    type: 'receive',
    amount: 1200,
    currency: 'EFI',
    description: 'Salary - May',
    counterparty: 'Efi Corp',
    date: '2026-05-15T09:00:00',
    category: 'transfer',
  },
  {
    id: '3',
    type: 'send',
    amount: 45,
    currency: 'EFI',
    description: 'Lunch at Efi Bistro',
    counterparty: 'Efi Bistro',
    date: '2026-05-17T13:30:00',
    category: 'food',
  },
  {
    id: '4',
    type: 'send',
    amount: 120,
    currency: 'EFI',
    description: 'Weekend shopping',
    counterparty: 'Efi Mall',
    date: '2026-05-16T16:00:00',
    category: 'shopping',
  },
  {
    id: '5',
    type: 'exchange',
    amount: 200,
    currency: 'EFI',
    description: 'Exchanged to Goldi',
    counterparty: 'Efi Exchange',
    date: '2026-05-14T11:00:00',
    category: 'exchange',
  },
  {
    id: '6',
    type: 'send',
    amount: 30,
    currency: 'EFI',
    description: 'Bus pass',
    counterparty: 'Efi Transit',
    date: '2026-05-13T08:00:00',
    category: 'transport',
  },
  {
    id: '7',
    type: 'send',
    amount: 80,
    currency: 'EFI',
    description: 'Cinema tickets',
    counterparty: 'EfiPlex',
    date: '2026-05-12T20:00:00',
    category: 'entertainment',
  },
  {
    id: '8',
    type: 'receive',
    amount: 350,
    currency: 'EFI',
    description: 'Freelance payment',
    counterparty: 'Alex M.',
    date: '2026-05-11T14:00:00',
    category: 'transfer',
  },
];

export const useCurrencies = (): Currency[] => [
  { code: 'EFI', name: 'Efi Monede', symbol: 'Ɛ', rateToEFI: 1, flag: '💜' },
  { code: 'GOL', name: 'Goldi', symbol: 'G', rateToEFI: 2.5, flag: '🟡' },
  { code: 'SIL', name: 'Silvix', symbol: 'S', rateToEFI: 0.8, flag: '⚪' },
  { code: 'CRY', name: 'Crypto', symbol: 'C', rateToEFI: 150, flag: '🔵' },
  { code: 'PLA', name: 'Platino', symbol: 'P', rateToEFI: 5, flag: '🔴' },
];

export const useStore = create<StoreState>((set) => ({
  balance: 1575,
  totalReceived: 2050,
  totalSent: 475,
  transactions: initialTransactions,
  balanceVisible: true,
  contacts: [
    { id: '1', name: 'Alex Monede', username: '@alexm', avatar: 'AM' },
    { id: '2', name: 'Sofia Efi', username: '@sofiae', avatar: 'SE' },
    { id: '3', name: 'Marco Coin', username: '@marcoc', avatar: 'MC' },
    { id: '4', name: 'Luna Pay', username: '@lunap', avatar: 'LP' },
    { id: '5', name: 'Radu Efi', username: '@radue', avatar: 'RE' },
    { id: '6', name: 'Ioana Gold', username: '@ioanag', avatar: 'IG' },
  ],
  currencies: [
    { code: 'EFI', name: 'Efi Monede', symbol: 'Ɛ', rateToEFI: 1, flag: '💜' },
    { code: 'GOL', name: 'Goldi', symbol: 'G', rateToEFI: 2.5, flag: '🟡' },
    { code: 'SIL', name: 'Silvix', symbol: 'S', rateToEFI: 0.8, flag: '⚪' },
    { code: 'CRY', name: 'Crypto', symbol: 'C', rateToEFI: 150, flag: '🔵' },
    { code: 'PLA', name: 'Platino', symbol: 'P', rateToEFI: 5, flag: '🔴' },
  ],
  toggleBalanceVisible: () => set((s) => ({ balanceVisible: !s.balanceVisible })),
  sendMoney: (amount, to) =>
    set((s) => {
      if (amount > s.balance) return s;
      const tx: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        amount,
        currency: 'EFI',
        description: `Sent to ${to}`,
        counterparty: to,
        date: new Date().toISOString(),
        category: 'transfer',
      };
      return {
        balance: s.balance - amount,
        totalSent: s.totalSent + amount,
        transactions: [tx, ...s.transactions],
      };
    }),
  addBalance: (amount) =>
    set((s) => {
      const tx: Transaction = {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        currency: 'EFI',
        description: 'Top-up',
        counterparty: 'Efi Bank',
        date: new Date().toISOString(),
        category: 'topup',
      };
      return {
        balance: s.balance + amount,
        totalReceived: s.totalReceived + amount,
        transactions: [tx, ...s.transactions],
      };
    }),
}));
