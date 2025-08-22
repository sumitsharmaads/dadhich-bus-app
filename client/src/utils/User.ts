import { userStorage } from "@/lib/storage/localStorage";
import { UserInfoType, UserRole } from "@/types";

export const defaultUser: Partial<UserInfoType> = {
  gender: "",
  fullname: "",
  email: "",
  phone: "",
  username: "",
  _id: "",
};

class User {
  private static _shareUser: User | null = null;

  static shareInstance(): User {
    if (!this._shareUser) {
      this._shareUser = new User();
      this._shareUser.initFromStorage();
    }
    return this._shareUser;
  }

  static initFromStorage() {
    return this.shareInstance().initFromStorage();
  }

  static saveToStorage() {
    return this.shareInstance().saveToStorage();
  }

  static loginUser(user: UserInfoType) {
    return this.shareInstance().loginUser(user);
  }

  static logout() {
    return this.shareInstance().logout();
  }

  static checkLogin() {
    if (this.shareInstance().isLogin) {
      return true;
    } else {
      // For Next.js, we can't directly modify window.location in SSR
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return false;
    }
  }

  static get isLogin() {
    return this.shareInstance().isLogin;
  }

  static get isAdmin() {
    return this.shareInstance().isAdmin;
  }

  static get user() {
    return this.shareInstance().getUser();
  }

  static get isCaptin() {
    return this.shareInstance().isCaptin;
  }

  static get isCaptain() {
    return this.shareInstance().isCaptin; // Alias for consistency
  }

  static get isGuest() {
    return this.shareInstance().isGuest;
  }

  static updateUserInfo(user: Partial<UserInfoType>) {
    return this.shareInstance().updateUserInfo(user);
  }

  static getRoleString() {
    return this.shareInstance().getRoleString();
  }

  static hasPermission(requiredRole: UserRole) {
    return this.shareInstance().hasPermission(requiredRole);
  }

  private info: {
    user: UserInfoType | null;
  };

  constructor() {
    this.info = {
      user: null,
    };
  }

  private initFromStorage() {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const storedUser = userStorage.getItem("users");
    if (storedUser) {
      this.info = {
        user: storedUser,
      };
    }
  }

  private saveToStorage() {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    if (!this.isLogin) {
      userStorage.removeItem("users");
    } else {
      userStorage.setItem("users", this.info.user as UserInfoType);
    }
  }

  private loginUser(user: UserInfoType) {
    this.info = { user };
    this.saveToStorage();
  }

  private logout() {
    this.info = {
      user: null,
    };

    // Only run in browser environment
    if (typeof window !== "undefined") {
      userStorage.removeItem("users");

      // Clear session cookies by setting them to expire
      document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }

  private getUser(): Omit<UserInfoType, "token"> | null {
    if (!this.info.user) return null;
    const { token, ...userWithoutToken } = this.info.user;
    return userWithoutToken;
  }

  private updateUserInfo(user: Partial<UserInfoType>) {
    if (this.info.user) {
      this.info.user = { ...this.info.user, ...user };
      this.saveToStorage();
    }
  }

  private getRoleString(): string {
    if (!this.info.user) return "Guest";

    switch (this.info.user.roleType) {
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.CAPTAIN:
        return "Captain";
      case UserRole.GUEST:
        return "Guest";
      default:
        return "Unknown";
    }
  }

  private hasPermission(requiredRole: UserRole): boolean {
    if (!this.info.user) return false;

    // Admin has all permissions
    if (this.info.user.roleType === UserRole.ADMIN) return true;

    // Check specific role
    return this.info.user.roleType === requiredRole;
  }

  get isLogin() {
    return !!(this.info?.user && this.info?.user?._id);
  }

  get isAdmin() {
    return this.info.user?.roleType === UserRole.ADMIN;
  }

  get isGuest() {
    return this.info.user?.roleType === UserRole.GUEST;
  }

  get isCaptin() {
    return this.info.user?.roleType === UserRole.CAPTAIN;
  }

  get UserInfo() {
    return this.info.user;
  }

  // Additional utility methods
  get userDisplayName(): string {
    if (!this.info.user) return "Guest";
    return (
      this.info.user.fullname ||
      this.info.user.username ||
      this.info.user.email ||
      "User"
    );
  }

  get userInitials(): string {
    if (!this.info.user || !this.info.user.fullname) return "U";

    const names = this.info.user.fullname.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  // Check if user has step-up authentication
  get hasStepUpAuth(): boolean {
    if (!this.info.user) return false;

    // Check if user has TOTP or WebAuthn enabled
    // This would be set by the backend during login
    return (
      !!(this.info.user as any).hasTotp || !!(this.info.user as any).hasWebAuthn
    );
  }

  // Check if user needs step-up for sensitive operations
  get needsStepUp(): boolean {
    if (!this.info.user) return false;

    // This would be determined by the backend session state
    // For now, return false - backend will handle this
    return false;
  }
}

export default User;
