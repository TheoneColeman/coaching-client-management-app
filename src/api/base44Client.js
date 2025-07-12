import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68712018c8f49626126ebb9e", 
  requiresAuth: true // Ensure authentication is required for all operations
});
