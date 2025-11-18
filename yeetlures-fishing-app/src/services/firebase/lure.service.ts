/**
 * Lure Service - Firestore operations for lures
 */

import firestore from '@react-native-firebase/firestore';
import { Lure, UserLureNote } from '../../types';
import { COLLECTIONS } from './config';

class LureService {
  /**
   * Get all lures
   */
  async getAllLures(): Promise<Lure[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.LURES)
      .orderBy('name')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lure[];
  }

  /**
   * Get YeetLures brand lures only
   */
  async getYeetLures(): Promise<Lure[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.LURES)
      .where('brand', '==', 'YeetLures')
      .orderBy('name')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lure[];
  }

  /**
   * Get single lure by ID
   */
  async getLureById(lureId: string): Promise<Lure | null> {
    const doc = await firestore()
      .collection(COLLECTIONS.LURES)
      .doc(lureId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as Lure;
  }

  /**
   * Search lures by name or type
   */
  async searchLures(query: string): Promise<Lure[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.LURES)
      .orderBy('name')
      .startAt(query)
      .endAt(query + '\uf8ff')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lure[];
  }

  /**
   * Get user notes for a lure
   */
  async getUserLureNotes(userId: string, lureId: string): Promise<UserLureNote[]> {
    const snapshot = await firestore()
      .collection(COLLECTIONS.USER_LURE_NOTES)
      .where('userId', '==', userId)
      .where('lureId', '==', lureId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserLureNote[];
  }

  /**
   * Add user note for a lure
   */
  async addUserLureNote(
    userId: string,
    lureId: string,
    note: string
  ): Promise<UserLureNote> {
    const noteData = {
      userId,
      lureId,
      note,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.USER_LURE_NOTES)
      .add(noteData);

    return {
      id: docRef.id,
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserLureNote;
  }

  /**
   * Update user lure note
   */
  async updateUserLureNote(noteId: string, note: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.USER_LURE_NOTES)
      .doc(noteId)
      .update({
        note,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Delete user lure note
   */
  async deleteUserLureNote(noteId: string): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.USER_LURE_NOTES)
      .doc(noteId)
      .delete();
  }
}

export const lureService = new LureService();
