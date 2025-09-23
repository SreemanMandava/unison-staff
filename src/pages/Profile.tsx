import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit,
  Save,
  Upload,
  FileText,
  Shield,
  Clock,
  Award,
} from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
}

interface EmploymentInfo {
  employeeId: string;
  department: string;
  position: string;
  manager: string;
  joinDate: string;
  employmentType: string;
  workLocation: string;
  salary: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: '123 Tech Street, Sector 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    maritalStatus: 'Single',
  });

  const [employmentInfo] = useState<EmploymentInfo>({
    employeeId: user?.employeeId || '',
    department: user?.department || '',
    position: 'HR Manager',
    manager: 'CEO',
    joinDate: '2022-01-15',
    employmentType: 'Full-time',
    workLocation: 'Mumbai Office',
    salary: '₹8,50,000',
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: 'Rajesh Sharma',
    relationship: 'Father',
    phone: '+91 98765 43211',
    address: '456 Family Street, Mumbai',
  });

  const handleSavePersonalInfo = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    console.log('Saving personal info:', personalInfo);
  };

  const handleSaveEmergencyContact = () => {
    // In a real app, this would save to backend
    console.log('Saving emergency contact:', emergencyContact);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Profile</h1>
          <p className="text-muted-foreground body-text">
            Manage your personal information and account settings.
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSavePersonalInfo() : setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-muted-foreground">{employmentInfo.position}</p>
              <Badge variant="secondary" className="mt-2">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{employmentInfo.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(employmentInfo.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={personalInfo.state}
                        onValueChange={(value) => setPersonalInfo({...personalInfo, state: value})}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={(e) => setPersonalInfo({...personalInfo, zipCode: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={personalInfo.gender}
                        onValueChange={(value) => setPersonalInfo({...personalInfo, gender: value})}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={personalInfo.maritalStatus}
                        onValueChange={(value) => setPersonalInfo({...personalInfo, maritalStatus: value})}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                  <CardDescription>
                    Your job details and organizational information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Employee ID</Label>
                      <Input value={employmentInfo.employeeId} disabled />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input value={employmentInfo.department} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Position</Label>
                      <Input value={employmentInfo.position} disabled />
                    </div>
                    <div>
                      <Label>Manager</Label>
                      <Input value={employmentInfo.manager} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Join Date</Label>
                      <Input 
                        value={new Date(employmentInfo.joinDate).toLocaleDateString()} 
                        disabled 
                      />
                    </div>
                    <div>
                      <Label>Employment Type</Label>
                      <Input value={employmentInfo.employmentType} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Work Location</Label>
                      <Input value={employmentInfo.workLocation} disabled />
                    </div>
                    <div>
                      <Label>Salary</Label>
                      <Input value={employmentInfo.salary} disabled />
                    </div>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Note</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Employment information can only be updated by HR. Contact your HR department for any changes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>
                    Person to contact in case of emergency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={emergencyContact.relationship}
                        onValueChange={(value) => setEmergencyContact({...emergencyContact, relationship: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactAddress">Address</Label>
                    <Textarea
                      id="contactAddress"
                      value={emergencyContact.address}
                      onChange={(e) => setEmergencyContact({...emergencyContact, address: e.target.value})}
                    />
                  </div>

                  <Button onClick={handleSaveEmergencyContact}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Emergency Contact
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Upload and manage your personal documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Document management requires backend integration</p>
                    <p className="text-xs text-muted-foreground mt-2">Connect to Supabase to enable file uploads and storage</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;