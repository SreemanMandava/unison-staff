import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Check,
  X,
  Clock,
  User,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface LeaveBalance {
  employeeId: string;
  vacation: number;
  sick: number;
  personal: number;
  maternity: number;
  used: {
    vacation: number;
    sick: number;
    personal: number;
    maternity: number;
  };
}

const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP003',
    employeeName: 'Sneha Gupta',
    leaveType: 'vacation',
    fromDate: '2024-01-15',
    toDate: '2024-01-20',
    days: 6,
    reason: 'Family vacation to Goa',
    status: 'pending',
    appliedDate: '2024-01-01',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Arjun Singh',
    leaveType: 'sick',
    fromDate: '2024-01-10',
    toDate: '2024-01-12',
    days: 3,
    reason: 'Fever and flu symptoms',
    status: 'approved',
    appliedDate: '2024-01-08',
    approvedBy: 'Priya Sharma',
    approvedDate: '2024-01-09',
  },
  {
    id: '3',
    employeeId: 'EMP004',
    employeeName: 'Ravi Kumar',
    leaveType: 'personal',
    fromDate: '2024-01-25',
    toDate: '2024-01-25',
    days: 1,
    reason: 'Personal appointment',
    status: 'rejected',
    appliedDate: '2024-01-22',
    approvedBy: 'Priya Sharma',
    approvedDate: '2024-01-23',
    comments: 'Critical project deadline approaching',
  },
];

const sampleLeaveBalances: LeaveBalance[] = [
  {
    employeeId: 'EMP003',
    vacation: 21,
    sick: 12,
    personal: 5,
    maternity: 90,
    used: { vacation: 8, sick: 2, personal: 1, maternity: 0 },
  },
  {
    employeeId: 'EMP002',
    vacation: 21,
    sick: 12,
    personal: 5,
    maternity: 0,
    used: { vacation: 5, sick: 3, personal: 0, maternity: 0 },
  },
];

const LeaveRequestForm: React.FC<{ onSubmit: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void }> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<string>('');
  const [reason, setReason] = useState('');

  const calculateDays = () => {
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromDate && toDate && leaveType && reason && user) {
      onSubmit({
        employeeId: user.employeeId,
        employeeName: user.name,
        leaveType: leaveType as any,
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        days: calculateDays(),
        reason,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leaveType">Leave Type</Label>
          <Select value={leaveType} onValueChange={setLeaveType}>
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
              <SelectItem value="maternity">Maternity Leave</SelectItem>
              <SelectItem value="emergency">Emergency Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Duration</Label>
          <p className="text-sm text-muted-foreground mt-1">
            {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          placeholder="Please provide a reason for your leave request..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Leave Request
      </Button>
    </form>
  );
};

const LeaveBalance: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
  const leaveTypes = [
    { key: 'vacation', label: 'Vacation', color: 'bg-blue-500' },
    { key: 'sick', label: 'Sick', color: 'bg-red-500' },
    { key: 'personal', label: 'Personal', color: 'bg-green-500' },
    { key: 'maternity', label: 'Maternity', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {leaveTypes.map(({ key, label, color }) => {
        const total = balance[key as keyof Omit<LeaveBalance, 'employeeId' | 'used'>] as number;
        const used = balance.used[key as keyof LeaveBalance['used']];
        const remaining = total - used;
        const percentage = total > 0 ? (used / total) * 100 : 0;

        return (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{remaining}</span>
                <span className="text-sm text-muted-foreground">of {total}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {used} used • {remaining} remaining
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(sampleLeaveRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const userBalance = sampleLeaveBalances.find(b => b.employeeId === user?.employeeId);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    // Filter by user role
    if (user?.role === 'employee') {
      return request.employeeId === user.employeeId && matchesSearch && matchesStatus;
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleApproveRequest = (requestId: string) => {
    setLeaveRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'approved' as const,
              approvedBy: user?.name || 'Manager',
              approvedDate: new Date().toISOString().split('T')[0],
            }
          : request
      )
    );
  };

  const handleRejectRequest = (requestId: string, comments?: string) => {
    setLeaveRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected' as const,
              approvedBy: user?.name || 'Manager',
              approvedDate: new Date().toISOString().split('T')[0],
              comments,
            }
          : request
      )
    );
  };

  const handleSubmitRequest = (requestData: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...requestData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsApplyDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-green-100 text-green-800',
      maternity: 'bg-purple-100 text-purple-800',
      emergency: 'bg-orange-100 text-orange-800',
    };
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const canApproveLeave = user?.role === 'hr_manager' || user?.role === 'manager' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Leave Management</h1>
          <p className="text-muted-foreground body-text">
            Manage leave requests, balances, and approvals.
          </p>
        </div>
        {(user?.role === 'employee' || user?.role === 'manager') && (
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              <LeaveRequestForm onSubmit={handleSubmitRequest} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Leave Balance for Employee */}
      {user?.role === 'employee' && userBalance && (
        <Card>
          <CardHeader>
            <CardTitle>My Leave Balance</CardTitle>
            <CardDescription>Your current leave entitlements and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveBalance balance={userBalance} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'employee' ? 'My Leave Requests' : 'Leave Requests'}
          </CardTitle>
          <CardDescription>
            {user?.role === 'employee' 
              ? 'Track your submitted leave requests'
              : 'Review and manage team leave requests'
            }
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {user?.role !== 'employee' && <TableHead>Employee</TableHead>}
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                {canApproveLeave && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  {user?.role !== 'employee' && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{request.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{request.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                  <TableCell>{request.days} day{request.days !== 1 ? 's' : ''}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(request.fromDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        to {new Date(request.toDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
                  {canApproveLeave && (
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <div className="text-xs text-muted-foreground">
                          {request.status === 'approved' ? 'Approved' : 'Rejected'}
                          {request.approvedBy && (
                            <p>by {request.approvedBy}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;