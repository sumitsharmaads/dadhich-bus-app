export interface UserInfo {
  id: string;
  email: string;
  username: string;
  role: string;
}

export type UserInfoType = {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  _id: string;
  roleType: number;
  token: string;
  username: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type SignUpType = {
  email: string;
  fullname: string;
  password: string;
  phone: string;
  username: string;
  gender?: string;
};

export type ForgotPasswordType = {
  email: string;
};

export type ResetPasswordType = {
  token: string;
  password: string;
  confirmPassword: string;
};

// Role types
export enum UserRole {
  ADMIN = 0,
  GUEST = 1,
  CAPTAIN = 2,
}

export interface AuthState {
  user: UserInfoType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  state: UserInfoType | null;
  updateUserInfo: (user: Partial<UserInfoType>) => void;
  login: (user: UserInfoType) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCaptain: boolean;
  isGuest: boolean;
}
