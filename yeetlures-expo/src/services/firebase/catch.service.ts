/**
 * Catch Service - Firestore operations for catches
 */

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Catch, CatchFormData, Location } from '../../types';
import { COLLECTIONS } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_CATCHES_KEY = '@offline_catches';

class CatchService {
  /**
   * Create a new catch
   */
  async createCatch(
    userId: string,
    formData: CatchFormData,
    location?: Location,
    weather?: any
  ): Promise<Catch> {
    try {
      const catchData: Omit<Catch, 'id'> = {
        userId,
        species: formData.species,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        notes: formData.notes,
        location,
        weather,
        lureUsed: formData.lureUsed,
        photos: formData.photos,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'synced',
      };

      const docRef = await firestore()
        .collection(COLLECTIONS.CATCHES)
        .add(catchData);

      return { id: docRef.id, ...catchData };
    } catch (error) {
      console.error('Error creating catch:', error);
      // Save to offline storage if network fails
      await this.saveOfflineCatch({ ...formData, location, weather });
      throw error;
    }
  }

  /**
   * Get all catches for a user
   */
  async getUserCatches(userId: string, limit: number = 50): Promise<Catch[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.CATCHES)
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Catch[];
  }

  /**
   * Get single catch by ID
   */
  async getCatchById(catchId: string): Promise<Catch | null> {
    const doc = await firestore()
      .collection(COLLECTIONS.CATCHES)
      .doc(catchId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as Catch;
  }

  /**
   * Update a catch
   */
  async updateCatch(catchId: string, updates: Partial<Catch>): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.CATCHES)
      .doc(catchId)
      .update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Delete a catch
   */
  async deleteCatch(catchId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.CATCHES)
      .doc(catchId)
      .delete();
  }

  /**
   * Upload catch photo to Firebase Storage
   */
  async uploadPhoto(userId: string, photoUri: string): Promise<string> {
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const reference = storage().ref(`catches/${userId}/${filename}`);

    await reference.putFile(photoUri);
    const downloadUrl = await reference.getDownloadURL();

    return downloadUrl;
  }

  /**
   * Save catch offline for later sync
   */
  private async saveOfflineCatch(catchData: any): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(OFFLINE_CATCHES_KEY);
      const offlineCatches = existing ? JSON.parse(existing) : [];

      offlineCatches.push({
        ...catchData,
        offlineId: Date.now().toString(),
        syncStatus: 'pending',
      });

      await AsyncStorage.setItem(OFFLINE_CATCHES_KEY, JSON.stringify(offlineCatches));
    } catch (error) {
      console.error('Error saving offline catch:', error);
    }
  }

  /**
   * Sync offline catches when online
   */
  async syncOfflineCatches(userId: string): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(OFFLINE_CATCHES_KEY);
      if (!existing) return;

      const offlineCatches = JSON.parse(existing);

      for (const catchData of offlineCatches) {
        try {
          await this.createCatch(
            userId,
            catchData,
            catchData.location,
            catchData.weather
          );
        } catch (error) {
          console.error('Error syncing catch:', error);
        }
      }

      // Clear offline storage after successful sync
      await AsyncStorage.removeItem(OFFLINE_CATCHES_KEY);
    } catch (error) {
      console.error('Error syncing offline catches:', error);
    }
  }
}

export const catchService = new CatchService();
