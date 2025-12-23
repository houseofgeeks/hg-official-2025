import { firestore } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

export interface Donation {
  id: string;
  userId: string;
  name: string;
  email: string;
  amount: number;
  orderId: string;
  paymentId: string;
  timestamp: Timestamp;
  status: 'completed' | 'pending' | 'failed';
}

export const donationService = {
  async saveDonation(donation: Omit<Donation, 'id' | 'timestamp'>) {
    try {
      const donationsRef = collection(firestore, 'donations');
      const docRef = await addDoc(donationsRef, {
        ...donation,
        timestamp: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving donation:', error);
      throw error;
    }
  },

  async getTopDonors(limitCount = 20): Promise<Donation[]> {
    try {
      const donationsRef = collection(firestore, 'donations');
      const q = query(
        donationsRef,
        where('status', '==', 'completed'),
        orderBy('amount', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const donations: Donation[] = [];

      querySnapshot.forEach((doc) => {
        donations.push({
          id: doc.id,
          ...doc.data(),
        } as Donation);
      });

      return donations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  async getUserDonations(userId: string): Promise<Donation[]> {
    try {
      const donationsRef = collection(firestore, 'donations');
      const q = query(
        donationsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const donations: Donation[] = [];

      querySnapshot.forEach((doc) => {
        donations.push({
          id: doc.id,
          ...doc.data(),
        } as Donation);
      });

      return donations;
    } catch (error) {
      console.error('Error fetching user donations:', error);
      throw error;
    }
  },

  async getTotalDonationAmount(userId: string): Promise<number> {
    try {
      const donations = await this.getUserDonations(userId);
      return donations.reduce((total, donation) => total + donation.amount, 0);
    } catch (error) {
      console.error('Error calculating total donation:', error);
      return 0;
    }
  },
};
