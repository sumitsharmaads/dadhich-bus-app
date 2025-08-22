"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { UserInfoType, AuthContextType } from "@/types";
import User from "@/utils/User";
import { useRouter } from "next/navigation";
import { useWebsite } from "./WebsiteProvider";
import { setAuthHandlers } from "@/lib/api/axiosInstance";
import DummyFallback from "@/components/common/DummyFallback";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { websiteInfo } = useWebsite();
  const router = useRouter();
  const [user, setUser] = useState<UserInfoType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * useEffect: Set user state on initial load
   */
  useEffect(() => {
    // Initialize user from storage
    User.initFromStorage();
    const currentUser = User.user;

    if (currentUser) {
      setUser({ ...currentUser, token: "" });
    }

    setIsInitialized(true);

    // Set auth handlers for axios instance
    setAuthHandlers(handleLogout, updateUserInfo);
  }, []);

  /**
   * Function: Login user
   */
  const login = (user: UserInfoType) => {
    // Don't store token in state for security
    const userWithoutToken = { ...user, token: "" };
    setUser(userWithoutToken);
    User.loginUser(user);

    // Navigate to dashboard or intended route
    const intendedRoute = sessionStorage.getItem("intendedRoute");
    if (intendedRoute) {
      sessionStorage.removeItem("intendedRoute");
      router.push(intendedRoute);
    } else {
      // Navigate based on user role
      if (user.roleType === 0) {
        // Admin
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  /**
   * Function: Logout user and cleanup
   */
  const handleLogout = () => {
    User.logout();
    setUser(null);
    router.push("/");
  };

  /**
   * Function: Update user info
   */
  const updateUserInfo = (info: Partial<UserInfoType>) => {
    if (user) {
      const updatedUser = { ...user, ...info };
      setUser(updatedUser);
      User.updateUserInfo(info);
    } else {
      setUser(info as UserInfoType);
      User.updateUserInfo(info);
    }
  };

  const contextValue: AuthContextType = {
    state: user,
    login,
    logout: handleLogout,
    updateUserInfo,
    isAuthenticated: !!user && User.isLogin,
    isAdmin: User.isAdmin,
    isCaptain: User.isCaptain,
    isGuest: User.isGuest,
  };

  if (!isInitialized || !websiteInfo) {
    return <DummyFallback message="Initializing session..." />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};
