import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    planType: string;
    accountType: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      planType: string;
      accountType: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    planType: string;
    accountType: string;
  }
}
