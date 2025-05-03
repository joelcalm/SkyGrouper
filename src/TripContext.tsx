// frontend_extracted/project/src/TripContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, GroupTrip, createGroupTrip, addUserToTrip, updateUserStep, markUserComplete, getGroupTrip } from './api';

interface TripContextType {
  groupTripId: string | null;
  userId: string | null;
  userData: UserData;
  loading: boolean;
  error: string | null;
  createNewTrip: () => Promise<string>;
  joinTrip: (groupTripId: string) => Promise<void>;
  updateOrigin: (from: string) => Promise<void>;
  updateDestinationIdeas: (destinations: string) => Promise<void>;
  updateDates: (start: string, end: string) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  updateBudget: (min: number, max: number, currency: string) => Promise<void>;
  completeUserInput: () => Promise<void>;
  groupData: GroupTrip | null;
  refreshGroupData: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [groupTripId, setGroupTripId] = useState<string | null>(localStorage.getItem('groupTripId'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupTrip | null>(null);

  // Persist IDs to local storage
  useEffect(() => {
    if (groupTripId) localStorage.setItem('groupTripId', groupTripId);
    if (userId) localStorage.setItem('userId', userId);
  }, [groupTripId, userId]);

  // Load user data if we have IDs
  useEffect(() => {
    if (groupTripId && userId) {
      refreshGroupData();
    }
  }, [groupTripId, userId]);

  const refreshGroupData = async () => {
    if (!groupTripId) return;
    
    try {
      setLoading(true);
      const trip = await getGroupTrip(groupTripId);
      setGroupData(trip);
      
      // If we have a userId, find and set the user data
      if (userId) {
        const user = trip.users.find(u => u.userId === userId);
        if (user) {
          setUserData(user);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load group trip data');
      setLoading(false);
    }
  };

  const createNewTrip = async (): Promise<string> => {
    try {
      setLoading(true);
      const newTripId = await createGroupTrip();
      setGroupTripId(newTripId);
      
      // Create a new user in this trip
      const newUserId = await addUserToTrip(newTripId, {});
      setUserId(newUserId);
      
      setLoading(false);
      return newTripId;
    } catch (err) {
      setError('Failed to create new trip');
      setLoading(false);
      throw err;
    }
  };

  const joinTrip = async (tripId: string): Promise<void> => {
    try {
      setLoading(true);
      setGroupTripId(tripId);
      
      // Create a new user in this trip
      const newUserId = await addUserToTrip(tripId, {});
      setUserId(newUserId);
      
      await refreshGroupData();
      setLoading(false);
    } catch (err) {
      setError('Failed to join trip');
      setLoading(false);
      throw err;
    }
  };

  const updateOrigin = async (from: string): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      await updateUserStep(groupTripId, userId, 'from', from);
      setUserData(prev => ({ ...prev, from }));
    } catch (err) {
      setError('Failed to update origin');
      throw err;
    }
  };

  const updateDestinationIdeas = async (destinations: string): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      await updateUserStep(groupTripId, userId, 'destinationIdeas', destinations);
      setUserData(prev => ({ ...prev, destinations }));
    } catch (err) {
      setError('Failed to update destination ideas');
      throw err;
    }
  };

  const updateDates = async (start: string, end: string): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      const dates = { start, end };
      await updateUserStep(groupTripId, userId, 'dates', dates);
      setUserData(prev => ({ ...prev, dates }));
    } catch (err) {
      setError('Failed to update dates');
      throw err;
    }
  };

  const updateInterests = async (interests: string[]): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      await updateUserStep(groupTripId, userId, 'interests', interests);
      setUserData(prev => ({ ...prev, interests }));
    } catch (err) {
      setError('Failed to update interests');
      throw err;
    }
  };

  const updateBudget = async (min: number, max: number, currency: string): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      const budget = { min, max, currency };
      await updateUserStep(groupTripId, userId, 'budget', budget);
      setUserData(prev => ({ ...prev, budget }));
    } catch (err) {
      setError('Failed to update budget');
      throw err;
    }
  };

  const completeUserInput = async (): Promise<void> => {
    if (!groupTripId || !userId) return;
    
    try {
      await markUserComplete(groupTripId, userId);
      setUserData(prev => ({ ...prev, completed: true }));
      await refreshGroupData();
    } catch (err) {
      setError('Failed to complete user input');
      throw err;
    }
  };

  return (
    <TripContext.Provider
      value={{
        groupTripId,
        userId,
        userData,
        loading,
        error,
        createNewTrip,
        joinTrip,
        updateOrigin,
        updateDestinationIdeas,
        updateDates,
        updateInterests,
        updateBudget,
        completeUserInput,
        groupData,
        refreshGroupData
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};