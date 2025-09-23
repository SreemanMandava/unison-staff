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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Download,
  Eye,
  Calculator,
  FileText,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  payPeriod: string;
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    others: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    others: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid' | 'failed';
  processedDate?: string;
  paidDate?: string;
}

interface PayrollSummary {
  totalEmployees: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  processed: number;
  pending: number;
}

const samplePayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Priya Sharma',
    department: 'Human Resources',
    position: 'HR Manager',
    payPeriod: '2024-01',
    basicSalary: 70000,
    allowances: { hra: 28000, transport: 2000, medical: 1500, others: 1000 },
    deductions: { pf: 8400, esi: 525, tax: 12000, others: 500 },
    grossSalary: 102500,
    netSalary: 81075,
    status: 'paid',
    processedDate: '2024-01-25',
    paidDate: '2024-01-30',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Arjun Singh',
    department: 'Engineering',
    position: 'Team Lead',
    payPeriod: '2024-01',
    basicSalary: 100000,
    allowances: { hra: 40000, transport: 2000, medical: 1500, others: 2000 },
    deductions: { pf: 12000, esi: 750, tax: 18000, others: 1000 },
    grossSalary: 145500,
    netSalary: 113750,
    status: 'processed',
    processedDate: '2024-01-25',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Sneha Gupta',
    department: 'Engineering',
    position: 'Software Developer',
    payPeriod: '2024-01',
    basicSalary: 62500,
    allowances: { hra: 25000, transport: 2000, medical: 1500, others: 1000 },
    deductions: { pf: 7500, esi: 456, tax: 8000, others: 500 },
    grossSalary: 92000,
    netSalary: 75544,
    status: 'draft',
  },
];

const PayrollDetails: React.FC<{ record: PayrollRecord }> = ({ record }) => {
  const totalAllowances = Object.values(record.allowances).reduce((sum, val) => sum + val, 0);
  const totalDeductions = Object.values(record.deductions).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {record.employeeName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{record.employeeName}</p>
                <p className="text-sm text-muted-foreground">{record.employeeId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{record.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Position</p>
                <p className="font-medium">{record.position}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pay Period</p>
                <p className="font-medium">{record.payPeriod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant={record.status === 'paid' ? 'default' : 'secondary'}>
                  {record.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salary Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Basic Salary</span>
                <span>₹{record.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-success">
                <span className="font-medium">Total Allowances</span>
                <span>+₹{totalAllowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-destructive">
                <span className="font-medium">Total Deductions</span>
                <span>-₹{totalDeductions.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Net Salary</span>
                <span>₹{record.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-success">Allowances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>HRA</span>
                <span>₹{record.allowances.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport</span>
                <span>₹{record.allowances.transport.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Medical</span>
                <span>₹{record.allowances.medical.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Others</span>
                <span>₹{record.allowances.others.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{totalAllowances.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>PF (12%)</span>
                <span>₹{record.deductions.pf.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ESI (0.75%)</span>
                <span>₹{record.deductions.esi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax</span>
                <span>₹{record.deductions.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Others</span>
                <span>₹{record.deductions.others.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Payroll: React.FC = () => {
  const { user } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(samplePayrollRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const payrollSummary: PayrollSummary = {
    totalEmployees: payrollRecords.length,
    totalGross: payrollRecords.reduce((sum, record) => sum + record.grossSalary, 0),
    totalNet: payrollRecords.reduce((sum, record) => sum + record.netSalary, 0),
    totalDeductions: payrollRecords.reduce((sum, record) => sum + (record.grossSalary - record.netSalary), 0),
    processed: payrollRecords.filter(r => r.status === 'processed' || r.status === 'paid').length,
    pending: payrollRecords.filter(r => r.status === 'draft').length,
  };

  const handleProcessPayroll = (recordId: string) => {
    setPayrollRecords(records =>
      records.map(record =>
        record.id === recordId
          ? { ...record, status: 'processed' as const, processedDate: new Date().toISOString().split('T')[0] }
          : record
      )
    );
  };

  const handlePaySalary = (recordId: string) => {
    setPayrollRecords(records =>
      records.map(record =>
        record.id === recordId
          ? { ...record, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] }
          : record
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'processed':
        return <Badge variant="default">Processed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canManagePayroll = user?.role === 'admin' || user?.role === 'hr_manager' || user?.role === 'payroll';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Payroll Management</h1>
          <p className="text-muted-foreground body-text">
            Process salaries, manage deductions, and generate payslips.
          </p>
        </div>
        {canManagePayroll && (
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Payroll
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active payroll records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(payrollSummary.totalGross / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(payrollSummary.totalNet / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.processed}/{payrollSummary.totalEmployees}</div>
            <Progress 
              value={(payrollSummary.processed / payrollSummary.totalEmployees) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {payrollSummary.pending} pending processing
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            Manage employee payroll calculations and payments
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.payPeriod}</TableCell>
                  <TableCell>₹{record.grossSalary.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{record.netSalary.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Payslip
                        </DropdownMenuItem>
                        {canManagePayroll && (
                          <>
                            <DropdownMenuSeparator />
                            {record.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleProcessPayroll(record.id)}
                              >
                                <Calculator className="mr-2 h-4 w-4" />
                                Process Payroll
                              </DropdownMenuItem>
                            )}
                            {record.status === 'processed' && (
                              <DropdownMenuItem
                                onClick={() => handlePaySalary(record.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
            <DialogDescription>
              Complete salary breakdown and payroll information
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && <PayrollDetails record={selectedRecord} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;