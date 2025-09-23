import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'hr_manager' | 'manager' | 'employee' | 'payroll' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For demo purposes
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'System Admin',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    employeeId: 'EMP001',
  },
  hr_manager: {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@company.com',
    role: 'hr_manager',
    department: 'Human Resources',
    employeeId: 'EMP002',
  },
  manager: {
    id: '3',
    name: 'Arjun Singh',
    email: 'arjun@company.com',
    role: 'manager',
    department: 'Engineering',
    employeeId: 'EMP003',
  },
  employee: {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha@company.com',
    role: 'employee',
    department: 'Engineering',
    employeeId: 'EMP004',
  },
  payroll: {
    id: '5',
    name: 'Ravi Kumar',
    email: 'ravi@company.com',
    role: 'payroll',
    department: 'Finance',
    employeeId: 'EMP005',
  },
  auditor: {
    id: '6',
    name: 'Audit User',
    email: 'auditor@company.com',
    role: 'auditor',
    department: 'Compliance',
    employeeId: 'EMP006',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with HR Manager role for demo
  useEffect(() => {
    const savedRole = localStorage.getItem('hrms_demo_role') as UserRole;
    if (savedRole && demoUsers[savedRole]) {
      setUser(demoUsers[savedRole]);
    } else {
      setUser(demoUsers.hr_manager);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (demo)
    const foundUser = Object.values(demoUsers).find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('hrms_demo_role', foundUser.role);
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_demo_role');
  };

  const switchRole = (role: UserRole) => {
    setUser(demoUsers[role]);
    localStorage.setItem('hrms_demo_role', role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};