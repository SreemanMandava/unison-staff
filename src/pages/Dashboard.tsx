import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserPlus,
  CalendarCheck,
  FileText,
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, trend = 'neutral' }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${getTrendColor()}`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, onClick }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
      <Icon className="h-6 w-6 text-primary mr-3" />
      <div>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
    </CardHeader>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getKPIsByRole = () => {
    switch (user?.role) {
      case 'hr_manager':
      case 'admin':
        return [
          { title: 'Total Employees', value: 245, change: '+12 from last month', icon: Users, trend: 'up' as const },
          { title: 'Active Leave Requests', value: 18, change: '3 pending approval', icon: Calendar, trend: 'neutral' as const },
          { title: 'Monthly Payroll', value: '₹45.2L', change: '+5.2% from last month', icon: DollarSign, trend: 'up' as const },
          { title: 'Attendance Rate', value: '94.5%', change: '+2.1% from last month', icon: Clock, trend: 'up' as const },
        ];
      case 'manager':
        return [
          { title: 'Team Members', value: 12, change: '+2 new hires', icon: Users, trend: 'up' as const },
          { title: 'Team Leave Requests', value: 3, change: '1 pending approval', icon: Calendar, trend: 'neutral' as const },
          { title: 'Team Attendance', value: '96.2%', change: '+1.5% from last week', icon: Clock, trend: 'up' as const },
          { title: 'Tasks Completed', value: '87%', change: '+8% from last week', icon: CheckCircle, trend: 'up' as const },
        ];
      case 'employee':
        return [
          { title: 'Leave Balance', value: 15, change: '3 used this month', icon: Calendar, trend: 'neutral' as const },
          { title: 'Attendance This Month', value: '95%', change: '19/20 days', icon: Clock, trend: 'up' as const },
          { title: 'Pending Tasks', value: 5, change: '2 due today', icon: AlertCircle, trend: 'neutral' as const },
          { title: 'Performance Score', value: '4.2/5', change: '+0.3 from last review', icon: TrendingUp, trend: 'up' as const },
        ];
      case 'payroll':
        return [
          { title: 'Processed Payrolls', value: 240, change: '5 pending', icon: DollarSign, trend: 'neutral' as const },
          { title: 'Total Disbursed', value: '₹45.2L', change: 'This month', icon: DollarSign, trend: 'neutral' as const },
          { title: 'Tax Calculations', value: '100%', change: 'All completed', icon: FileText, trend: 'up' as const },
          { title: 'Compliance Score', value: '98%', change: 'Excellent', icon: CheckCircle, trend: 'up' as const },
        ];
      default:
        return [
          { title: 'System Health', value: '99.5%', change: 'All systems operational', icon: CheckCircle, trend: 'up' as const },
          { title: 'Active Users', value: 234, change: '+5 from yesterday', icon: Users, trend: 'up' as const },
          { title: 'Data Accuracy', value: '99.8%', change: 'Excellent', icon: TrendingUp, trend: 'up' as const },
          { title: 'Compliance Status', value: '100%', change: 'All requirements met', icon: CheckCircle, trend: 'up' as const },
        ];
    }
  };

  const getQuickActionsByRole = () => {
    switch (user?.role) {
      case 'hr_manager':
      case 'admin':
        return [
          { title: 'Add New Employee', description: 'Onboard a new team member', icon: UserPlus, onClick: () => {} },
          { title: 'Review Leave Requests', description: '3 requests pending approval', icon: Calendar, onClick: () => {} },
          { title: 'Generate Reports', description: 'Monthly HR analytics', icon: FileText, onClick: () => {} },
          { title: 'Process Payroll', description: 'Run monthly payroll', icon: DollarSign, onClick: () => {} },
        ];
      case 'manager':
        return [
          { title: 'Approve Team Leaves', description: '2 requests pending', icon: CalendarCheck, onClick: () => {} },
          { title: 'Team Performance', description: 'Review team metrics', icon: TrendingUp, onClick: () => {} },
          { title: 'Schedule Meeting', description: 'Plan team standup', icon: Calendar, onClick: () => {} },
          { title: 'View Team Report', description: 'Weekly team summary', icon: FileText, onClick: () => {} },
        ];
      case 'employee':
        return [
          { title: 'Apply for Leave', description: 'Request time off', icon: Calendar, onClick: () => {} },
          { title: 'Mark Attendance', description: 'Clock in/out', icon: Clock, onClick: () => {} },
          { title: 'View Payslip', description: 'Download current payslip', icon: FileText, onClick: () => {} },
          { title: 'Update Profile', description: 'Edit personal information', icon: Users, onClick: () => {} },
        ];
      default:
        return [
          { title: 'View Reports', description: 'Access system reports', icon: FileText, onClick: () => {} },
          { title: 'System Status', description: 'Check system health', icon: CheckCircle, onClick: () => {} },
          { title: 'User Activity', description: 'Monitor user actions', icon: Users, onClick: () => {} },
          { title: 'Compliance Check', description: 'Review compliance status', icon: AlertCircle, onClick: () => {} },
        ];
    }
  };

  const kpis = getKPIsByRole();
  const quickActions = getQuickActionsByRole();

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground body-text">
          Here's what's happening with your {user?.role === 'employee' ? 'work' : 'team'} today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {quickActions.map((action, index) => (
                  <QuickAction key={index} {...action} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-success" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Leave approved</p>
                <p className="text-xs text-muted-foreground">John's vacation request approved</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-warning" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Payroll pending</p>
                <p className="text-xs text-muted-foreground">5 payrolls need review</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-info" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New employee</p>
                <p className="text-xs text-muted-foreground">Sarah joined Engineering team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Calendar Overview */}
      {(user?.role === 'hr_manager' || user?.role === 'manager' || user?.role === 'admin') && (
        <Card>
          <CardHeader>
            <CardTitle>Leave Overview</CardTitle>
            <CardDescription>Upcoming leaves and team availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Availability</span>
                <Badge variant="secondary">23/25 available today</Badge>
              </div>
              <Progress value={92} className="h-2" />
              <div className="grid gap-2 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-xs">Available (23)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-xs">On Leave (2)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span className="text-xs">Remote (15)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;