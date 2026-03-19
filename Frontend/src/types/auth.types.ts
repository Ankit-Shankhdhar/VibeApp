export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  aura: string;
  profileImage?: string; // Add this
  profilePicture?: string; // Add this if you use both
}

// Ensure your AuthContextType includes the token
export interface AuthContextType {
  user: User | null;
  token: string | null; // Ensure this is here
  // ... other methods like login/logout
}