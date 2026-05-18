import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface LifeItem {
  id: string;
  name: string;
  emoji: string;
  qty: number;
  totalSpent: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  pin: string;
  balance: number;
  transactions: Transaction[];
  color: string;
  lifeItems: LifeItem[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rateToEFI: number;
  flag: string;
}

interface StoreState {
  users: User[];
  currentUserId: string | null;
  balanceVisible: boolean;

  login: (userId: string, pin: string) => boolean;
  logout: () => void;
  toggleBalanceVisible: () => void;
  sendMoney: (toUserId: string, amount: number) => boolean;
  addBalance: (amount: number) => void;
  spendForLife: (itemId: string, name: string, emoji: string, qty: number, total: number) => void;
  getCurrentUser: () => User | null;
}

const initialUsers: User[] = [
  {
    id: 'stefi',
    name: 'Stefi',
    username: '@stefi',
    avatar: 'S',
    pin: '1234',
    balance: 2500,
    color: '#7c6af7',
    transactions: [
      {
        id: 'stefi-1',
        type: 'topup',
        amount: 2500,
        currency: 'EFI',
        description: 'Welcome bonus',
        counterparty: 'Efi Bank',
        date: '2026-05-01T10:00:00',
        category: 'topup',
      },
      {
        id: 'stefi-2',
        type: 'send',
        amount: 200,
        currency: 'EFI',
        description: 'Trimis la Mara',
        counterparty: 'Mara',
        date: '2026-05-10T14:00:00',
        category: 'transfer',
      },
      {
        id: 'stefi-3',
        type: 'receive',
        amount: 150,
        currency: 'EFI',
        description: 'Primit de la Adriana',
        counterparty: 'Adriana',
        date: '2026-05-12T09:00:00',
        category: 'transfer',
      },
    ],
    lifeItems: [],
  },
  {
    id: 'mara',
    name: 'Mara',
    username: '@mara',
    avatar: 'M',
    pin: '2222',
    balance: 1800,
    color: '#ec4899',
    transactions: [
      {
        id: 'mara-1',
        type: 'topup',
        amount: 1800,
        currency: 'EFI',
        description: 'Welcome bonus',
        counterparty: 'Efi Bank',
        date: '2026-05-01T10:00:00',
        category: 'topup',
      },
      {
        id: 'mara-2',
        type: 'receive',
        amount: 200,
        currency: 'EFI',
        description: 'Primit de la Stefi',
        counterparty: 'Stefi',
        date: '2026-05-10T14:00:00',
        category: 'transfer',
      },
      {
        id: 'mara-3',
        type: 'send',
        amount: 100,
        currency: 'EFI',
        description: 'Trimis la Adriana',
        counterparty: 'Adriana',
        date: '2026-05-15T11:00:00',
        category: 'transfer',
      },
    ],
    lifeItems: [],
  },
  {
    id: 'adriana',
    name: 'Adriana',
    username: '@adriana',
    avatar: 'A',
    pin: '3333',
    balance: 1200,
    color: '#22c55e',
    transactions: [
      {
        id: 'adriana-1',
        type: 'topup',
        amount: 1200,
        currency: 'EFI',
        description: 'Welcome bonus',
        counterparty: 'Efi Bank',
        date: '2026-05-01T10:00:00',
        category: 'topup',
      },
      {
        id: 'adriana-2',
        type: 'send',
        amount: 150,
        currency: 'EFI',
        description: 'Trimis la Stefi',
        counterparty: 'Stefi',
        date: '2026-05-12T09:00:00',
        category: 'transfer',
      },
      {
        id: 'adriana-3',
        type: 'receive',
        amount: 100,
        currency: 'EFI',
        description: 'Primit de la Mara',
        counterparty: 'Mara',
        date: '2026-05-15T11:00:00',
        category: 'transfer',
      },
    ],
    lifeItems: [],
  },
];

export const useCurrencies = (): Currency[] => [
  { code: 'EFI', name: 'Efi Monede', symbol: 'Ɛ', rateToEFI: 1, flag: '💜' },
  { code: 'GOL', name: 'Goldi', symbol: 'G', rateToEFI: 2.5, flag: '🟡' },
  { code: 'SIL', name: 'Silvix', symbol: 'S', rateToEFI: 0.8, flag: '⚪' },
  { code: 'CRY', name: 'Crypto', symbol: 'C', rateToEFI: 150, flag: '🔵' },
  { code: 'PLA', name: 'Platino', symbol: 'P', rateToEFI: 5, flag: '🔴' },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      currentUserId: null,
      balanceVisible: true,

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find((u) => u.id === currentUserId) ?? null;
      },

      login: (userId, pin) => {
        const { users } = get();
        const user = users.find((u) => u.id === userId);
        if (user && user.pin === pin) {
          set({ currentUserId: userId });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUserId: null }),

      toggleBalanceVisible: () =>
        set((s) => ({ balanceVisible: !s.balanceVisible })),

      sendMoney: (toUserId, amount) => {
        const { users, currentUserId } = get();
        const fromUser = users.find((u) => u.id === currentUserId);
        const toUser = users.find((u) => u.id === toUserId);
        if (!fromUser || !toUser || amount > fromUser.balance || amount <= 0) return false;

        const now = new Date().toISOString();
        const sendTx: Transaction = {
          id: Date.now().toString() + '-send',
          type: 'send',
          amount,
          currency: 'EFI',
          description: `Trimis la ${toUser.name}`,
          counterparty: toUser.name,
          date: now,
          category: 'transfer',
        };
        const receiveTx: Transaction = {
          id: Date.now().toString() + '-recv',
          type: 'receive',
          amount,
          currency: 'EFI',
          description: `Primit de la ${fromUser.name}`,
          counterparty: fromUser.name,
          date: now,
          category: 'transfer',
        };

        set({
          users: users.map((u) => {
            if (u.id === currentUserId) {
              return {
                ...u,
                balance: u.balance - amount,
                transactions: [sendTx, ...u.transactions],
              };
            }
            if (u.id === toUserId) {
              return {
                ...u,
                balance: u.balance + amount,
                transactions: [receiveTx, ...u.transactions],
              };
            }
            return u;
          }),
        });
        return true;
      },

      addBalance: (amount) => {
        const { users, currentUserId } = get();
        const now = new Date().toISOString();
        const tx: Transaction = {
          id: Date.now().toString(),
          type: 'topup',
          amount,
          currency: 'EFI',
          description: 'Top-up',
          counterparty: 'Efi Bank',
          date: now,
          category: 'topup',
        };
        set({
          users: users.map((u) =>
            u.id === currentUserId
              ? { ...u, balance: u.balance + amount, transactions: [tx, ...u.transactions] }
              : u
          ),
        });
      },

      spendForLife: (itemId, name, emoji, qty, total) => {
        const { users, currentUserId } = get();
        const now = new Date().toISOString();
        const tx: Transaction = {
          id: Date.now().toString(),
          type: 'exchange',
          amount: total,
          currency: 'EFI',
          description: `${qty}x ${name} ${emoji}`,
          counterparty: 'Efi Life',
          date: now,
          category: 'exchange',
        };
        set({
          users: users.map((u) => {
            if (u.id !== currentUserId) return u;
            const existing = u.lifeItems.find((li) => li.id === itemId);
            const updatedItems = existing
              ? u.lifeItems.map((li) =>
                  li.id === itemId
                    ? { ...li, qty: li.qty + qty, totalSpent: li.totalSpent + total }
                    : li
                )
              : [...u.lifeItems, { id: itemId, name, emoji, qty, totalSpent: total }];
            return {
              ...u,
              balance: u.balance - total,
              transactions: [tx, ...u.transactions],
              lifeItems: updatedItems,
            };
          }),
        });
      },
    }),
    { name: 'efi-monede-store' }
  )
);
