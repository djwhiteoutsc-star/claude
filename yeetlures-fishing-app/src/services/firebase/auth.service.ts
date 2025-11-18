/**
 * Firebase Authentication Service
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User, UserPreferences } from '../../types';
import { COLLECTIONS } from './config';

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const credential = await auth().createUserWithEmailAndPassword(email, password);

      if (displayName && credential.user) {
        await credential.user.updateProfile({ displayName });
      }

      // Create user document in Firestore
      const user = await this.createUserDocument(credential.user);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const credential = await auth().signInWithEmailAndPassword(email, password);
      const user = await this.getUserDocument(credential.user.uid);

      // Update last login
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(credential.user.uid)
        .update({ lastLoginAt: firestore.FieldValue.serverTimestamp() });

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(authUser: FirebaseAuthTypes.User): Promise<User> {
    const defaultPreferences: UserPreferences = {
      units: 'imperial',
      notifications: {
        fishingForecasts: true,
        weatherAlerts: true,
        catchReminders: true,
      },
    };

    const user: Omit<User, 'id'> = {
      email: authUser.email!,
      displayName: authUser.displayName || undefined,
      photoUrl: authUser.photoURL || undefined,
      subscription: {
        status: 'free',
        autoRenew: false,
      },
      preferences: defaultPreferences,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(authUser.uid)
      .set(user);

    return { ...user, id: authUser.uid };
  }

  /**
   * Get user document from Firestore
   */
  async getUserDocument(userId: string): Promise<User> {
    const doc = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .get();

    if (!doc.exists) {
      throw new Error('User document not found');
    }

    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .update(updates);
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email);
  }
}

export const authService = new AuthService();
