import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Building2,
  Clock,
  UserCheck,
  BarChart3,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    roles: ['admin', 'hr_manager', 'manager', 'employee', 'payroll', 'auditor'],
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: Users,
    roles: ['admin', 'hr_manager', 'manager'],
  },
  {
    title: 'My Profile',
    url: '/profile',
    icon: UserCheck,
    roles: ['employee'],
  },
  {
    title: 'Leave Management',
    url: '/leave',
    icon: Calendar,
    roles: ['admin', 'hr_manager', 'manager', 'employee'],
  },
  {
    title: 'Attendance',
    url: '/attendance',
    icon: Clock,
    roles: ['admin', 'hr_manager', 'manager', 'employee'],
  },
  {
    title: 'Payroll',
    url: '/payroll',
    icon: DollarSign,
    roles: ['admin', 'hr_manager', 'payroll'],
  },
  {
    title: 'My Payslips',
    url: '/payslips',
    icon: FileText,
    roles: ['employee', 'manager'],
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: BarChart3,
    roles: ['admin', 'hr_manager', 'payroll', 'auditor'],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    roles: ['admin', 'hr_manager'],
  },
];

export const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { user, switchRole } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  // Demo role switcher for testing
  const roles = ['hr_manager', 'admin', 'manager', 'employee', 'payroll', 'auditor'] as const;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg">HRMS</h2>
                <p className="text-xs text-muted-foreground">HR Management System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "hover:bg-accent"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Demo Role Switcher */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Demo Roles</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-1 px-2">
                {roles.map((role) => (
                  <Button
                    key={role}
                    variant={user?.role === role ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => switchRole(role)}
                  >
                    {role.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};