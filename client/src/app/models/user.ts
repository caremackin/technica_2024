export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    typeId?: number;
    createdAt?: string;
  }

export enum UserRole {
    User = 1,
    Admin = 2,
  }