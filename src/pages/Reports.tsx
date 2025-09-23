import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import {
  Download,
  FileText,
  BarChart3,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: 'employee' | 'leave' | 'payroll' | 'attendance' | 'performance';
  lastGenerated?: string;
  status: 'available' | 'generating' | 'error';
  access: string[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const availableReports: ReportData[] = [
  {
    id: '1',
    name: 'Employee Directory Report',
    description: 'Complete list of employees with contact information and employment details',
    type: 'employee',
    lastGenerated: '2024-01-15',
    status: 'available',
    access: ['admin', 'hr_manager'],
  },
  {
    id: '2',
    name: 'Monthly Attendance Report',
    description: 'Detailed attendance statistics for all employees',
    type: 'attendance',
    lastGenerated: '2024-01-10',
    status: 'available',
    access: ['admin', 'hr_manager', 'manager'],
  },
  {
    id: '3',
    name: 'Leave Summary Report',
    description: 'Leave balances, requests, and approval statistics',
    type: 'leave',
    lastGenerated: '2024-01-12',
    status: 'available',
    access: ['admin', 'hr_manager', 'manager'],
  },
  {
    id: '4',
    name: 'Payroll Summary Report',
    description: 'Comprehensive payroll breakdown with tax calculations',
    type: 'payroll',
    lastGenerated: '2024-01-01',
    status: 'available',
    access: ['admin', 'hr_manager', 'payroll'],
  },
  {
    id: '5',
    name: 'Department Wise Analysis',
    description: 'Employee distribution and performance by department',
    type: 'performance',
    status: 'generating',
    access: ['admin', 'hr_manager'],
  },
  {
    id: '6',
    name: 'Audit Trail Report',
    description: 'System access logs and data modification history',
    type: 'employee',
    lastGenerated: '2024-01-08',
    status: 'available',
    access: ['admin', 'auditor'],
  },
];

const MetricCard: React.FC<MetricCard> = ({ title, value, change, trend, icon: Icon }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
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
          <div className={`flex items-center text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ReportCard: React.FC<{ 
  report: ReportData; 
  onGenerate: (reportId: string) => void;
  onDownload: (reportId: string) => void;
}> = ({ report, onGenerate, onDownload }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'generating':
        return <Badge variant="secondary">Generating...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'employee': return <Users className="h-5 w-5" />;
      case 'leave': return <CalendarIcon className="h-5 w-5" />;
      case 'payroll': return <DollarSign className="h-5 w-5" />;
      case 'attendance': return <Clock className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getTypeIcon(report.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{report.name}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </div>
          </div>
          {getStatusBadge(report.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {report.lastGenerated ? (
              <>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</>
            ) : (
              'Never generated'
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerate(report.id)}
              disabled={report.status === 'generating'}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate
            </Button>
            {report.status === 'available' && (
              <Button
                size="sm"
                onClick={() => onDownload(report.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [reportFilter, setReportFilter] = useState<string>('all');

  const accessibleReports = availableReports.filter(report =>
    user?.role && report.access.includes(user.role)
  );

  const filteredReports = accessibleReports.filter(report =>
    reportFilter === 'all' || report.type === reportFilter
  );

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report ${reportId}`);
    // In a real app, this would trigger report generation
  };

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`);
    // In a real app, this would trigger file download
  };

  // Sample metrics data
  const metrics: MetricCard[] = [
    {
      title: 'Total Reports Generated',
      value: 48,
      change: '+12% from last month',
      trend: 'up',
      icon: FileText,
    },
    {
      title: 'Data Accuracy',
      value: '99.8%',
      change: '+0.2% improvement',
      trend: 'up',
      icon: BarChart3,
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-15% faster',
      trend: 'up',
      icon: Clock,
    },
    {
      title: 'Report Downloads',
      value: 156,
      change: '+24% this week',
      trend: 'up',
      icon: Download,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground body-text">
            Generate comprehensive reports and analyze HR data and trends.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <PieChart className="mr-2 h-4 w-4" />
            Analytics Dashboard
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Library</CardTitle>
                  <CardDescription>
                    Pre-built reports ready for generation and download
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={reportFilter} onValueChange={setReportFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onGenerate={handleGenerateReport}
                    onDownload={handleDownloadReport}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create custom reports with specific date ranges and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
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
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Custom report builder requires backend integration</p>
                <p className="text-xs text-muted-foreground mt-2">Connect to Supabase to enable advanced reporting features</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automate report generation and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Scheduled reporting requires backend integration</p>
                <p className="text-xs text-muted-foreground mt-2">Connect to Supabase to enable automated report scheduling</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;