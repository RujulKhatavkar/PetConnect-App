import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  FileText, Clock, CheckCircle2, XCircle, Users, 
  PawPrint, Mail, Phone, Home 
} from 'lucide-react';
import { Application, Pet } from '../types';

interface ShelterDashboardProps {
  applications: Application[];
  pets: Pet[];
  onUpdateStatus: (applicationId: number, status: Application['status']) => void;
}

export function ShelterDashboard({ applications, pets, onUpdateStatus }: ShelterDashboardProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    completed: applications.filter(app => app.status === 'completed').length,
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const handleStatusUpdate = (appId: number, status: Application['status']) => {
    onUpdateStatus(appId, status);
    setSelectedApplication(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Shelter Dashboard</h1>
          <p className="text-slate-600">
            Manage adoption applications and track progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Applications</p>
                  <p className="text-slate-900">{stats.total}</p>
                </div>
                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <FileText className="size-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pending Review</p>
                  <p className="text-slate-900">{stats.pending}</p>
                </div>
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="size-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Approved</p>
                  <p className="text-slate-900">{stats.approved}</p>
                </div>
                <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed</p>
                  <p className="text-slate-900">{stats.completed}</p>
                </div>
                <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <PawPrint className="size-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="size-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No applications in this category</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <Card key={app.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={app.petImage}
                                alt={app.petName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-slate-900">{app.petName}</h3>
                                    <Badge className={getStatusColor(app.status)}>
                                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    Application #{app.id.toString().padStart(6, '0')}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Submitted {new Date(app.submittedDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  View Details
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Users className="size-4" />
                                  <span>{app.applicantName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Mail className="size-4" />
                                  <span>{app.applicantEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Phone className="size-4" />
                                  <span>{app.applicantPhone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Home className="size-4" />
                                  <span>{app.homeType.charAt(0).toUpperCase() + app.homeType.slice(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Application Details</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Application #{selectedApplication.id.toString().padStart(6, '0')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pet Info */}
                <div>
                  <h4 className="text-slate-900 mb-3">Pet Information</h4>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={selectedApplication.petImage}
                        alt={selectedApplication.petName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-slate-900">{selectedApplication.petName}</h3>
                      <p className="text-sm text-slate-600">
                        Submitted {new Date(selectedApplication.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applicant Info */}
                <div>
                  <h4 className="text-slate-900 mb-3">Applicant Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-slate-500" />
                      <span className="text-slate-700">{selectedApplication.applicantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-slate-500" />
                      <span className="text-slate-700">{selectedApplication.applicantEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-slate-500" />
                      <span className="text-slate-700">{selectedApplication.applicantPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Living Situation */}
                <div>
                  <h4 className="text-slate-900 mb-3">Living Situation</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Home Type</p>
                      <p className="text-slate-700 capitalize">{selectedApplication.homeType}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Has Yard</p>
                      <p className="text-slate-700">{selectedApplication.hasYard ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Current Pets</p>
                      <p className="text-slate-700">{selectedApplication.hasPets ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-slate-900 mb-3">Pet Experience</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {selectedApplication.experience}
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <h4 className="text-slate-900 mb-3">Adoption Reason</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {selectedApplication.reason}
                  </p>
                </div>

                {/* Status & Actions */}
                <div>
                  <h4 className="text-slate-900 mb-3">Application Status</h4>
                  <Badge className={`${getStatusColor(selectedApplication.status)} mb-4`}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </Badge>
                  
                  {selectedApplication.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Approve Application
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                      >
                        <XCircle className="size-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  )}
                  
                  {selectedApplication.status === 'approved' && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'completed')}
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
