'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User, UserMetrics, Challenge, Deal, Objective, MonthlyScore, Niche, DailyEntry, Infopreneur} from '@prisma/client';


export type FullUser = User & {
  metrics: UserMetrics | null;
  challenges: (Challenge & {
    deals: Deal[];
    dailyEntries: DailyEntry[];
    infopreneur: Infopreneur & { niche: Niche };
  })[];
  objectives: Objective[];
  monthlyScores: MonthlyScore[];
  niches: Niche[];
};

const UserContext = createContext<FullUser | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: FullUser | null;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
}