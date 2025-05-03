// frontend_extracted/project/src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Types
export interface UserData {
  userId?: string;
  from?: string;
  destinationIdeas?: string[];
  dates?: {
    start: string;
    end: string;
  };
  interests?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  completed?: boolean;
}

export interface GroupTrip {
  groupTripId: string;
  users: UserData[];
  createdAt: string;
  numOfMembers: number;
}

// API functions
export const createGroupTrip = async (numOfMembers: number = 2): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/group-trip`, { numOfMembers });
    return response.data.groupTripId;
  } catch (error) {
    console.error('Error creating group trip:', error);
    throw error;
  }
};

export const addUserToTrip = async (groupTripId: string, userData: UserData): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/group-trip/${groupTripId}/user`, userData);
    return response.data.userId;
  } catch (error) {
    console.error('Error adding user to trip:', error);
    throw error;
  }
};

export const getGroupTrip = async (groupTripId: string): Promise<GroupTrip> => {
  try {
    const response = await axios.get(`${API_URL}/group-trip/${groupTripId}`);
    return response.data.groupTrip;
  } catch (error) {
    console.error('Error getting group trip:', error);
    throw error;
  }
};

export const updateUserStep = async (
  groupTripId: string,
  userId: string,
  step: string,
  value: any
): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/group-trip/${groupTripId}/user/${userId}/update-step`, {
      step,
      value
    });
  } catch (error) {
    console.error(`Error updating step ${step}:`, error);
    throw error;
  }
};

export const markUserComplete = async (groupTripId: string, userId: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/group-trip/${groupTripId}/user/${userId}/complete`);
  } catch (error) {
    console.error('Error marking user as complete:', error);
    throw error;
  }
};