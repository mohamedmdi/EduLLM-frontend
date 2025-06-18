/**
 * Utility functions for user authentication and identification
 */

export interface UserInfo {
  userId: string;
  provider: string;
  isGuest: boolean;
}

/**
 * Get the current user's UUID from localStorage
 * @returns The user's UUID or null if not authenticated
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

/**
 * Get the current user's provider from localStorage
 * @returns The user's provider (google, microsoft, guest) or null
 */
export function getUserProvider(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userProvider');
}

/**
 * Get complete user information
 * @returns UserInfo object or null if not authenticated
 */
export function getUserInfo(): UserInfo | null {
  const userId = getUserId();
  const provider = getUserProvider();
  
  if (!userId || !provider) return null;
  
  return {
    userId,
    provider,
    isGuest: provider === 'guest'
  };
}

/**
 * Check if user is authenticated (has a valid UUID)
 * @returns true if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return getUserId() !== null;
}

/**
 * Generate a new UUID for a user
 * @param provider The authentication provider (google, microsoft, guest)
 * @returns A new unique user ID
 */
export function generateUserId(provider: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `${provider}_${timestamp}_${randomString}`;
}

/**
 * Set user authentication data in localStorage
 * @param userId The user's unique ID
 * @param provider The authentication provider
 */
export function setUserAuth(userId: string, provider: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userId', userId);
  localStorage.setItem('userProvider', provider);
}

/**
 * Clear user authentication data from localStorage
 */
export function clearUserAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userId');
  localStorage.removeItem('userProvider');
}
