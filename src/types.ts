export interface Goal {
  id: string;
  name: string;
  amount: number;
  saved: number;
}

export interface UserData {
  salary: string; // Encrypted
  urgentAmount: string; // Encrypted
  bankBalance: string; // Encrypted
  goalsEncrypted?: string; // Encrypted JSON string of Goal[]
  onboardingCompleted?: boolean;
  // Legacy fields
  goalName?: string;
  goalAmount?: string; 
  savedAmount?: string; 
}

export interface DecryptedUserData {
  salary: number;
  urgentAmount: number;
  bankBalance: number;
  goals: Goal[];
  onboardingCompleted: boolean;
}
