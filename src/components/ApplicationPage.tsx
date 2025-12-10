import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { Pet, Application } from '../types';

interface ApplicationPageProps {
  selectedPet?: Pet;
  applications: Application[];
  onBack: () => void;
  onSubmit: (application: Omit<Application, 'id' | 'submittedDate' | 'status'>) => void;
}

export function ApplicationPage({ selectedPet, applications, onBack, onSubmit }: ApplicationPageProps) {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    homeType: 'house',
    hasYard: 'yes',
    hasPets: 'no',
    experience: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        petId: selectedPet.id,
        petName: selectedPet.name,
        petImage: selectedPet.image,
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        applicantPhone: formData.applicantPhone,
        homeType: formData.homeType,
        hasYard: formData.hasYard === 'yes',
        hasPets: formData.hasPets === 'yes',
        experience: formData.experience,
        reason: formData.reason,
        shelterId: selectedPet.shelterId,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 2000);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="size-5 text-red-600" />;
      case 'completed':
        return <CheckCircle2 className="size-5 text-blue-600" />;
      default:
        return <Clock className="size-5 text-orange-600" />;
    }
  };

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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        {showSuccess ? (
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <h2 className="text-slate-900 mb-2">Application Submitted!</h2>
              <p className="text-slate-600">
                Your adoption application has been sent to the shelter. They will review it and contact you soon.
              </p>
            </CardContent>
          </Card>
        ) : selectedPet ? (
          <>
            <h1 className="text-slate-900 mb-2">Adoption Application</h1>
            <p className="text-slate-600 mb-8">
              Complete this form to apply for adopting {selectedPet.name}
            </p>

            {/* Pet Summary */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={selectedPet.image}
                      alt={selectedPet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-slate-900">{selectedPet.name}</h3>
                    <p className="text-sm text-slate-600">{selectedPet.breed}</p>
                    <p className="text-sm text-slate-500 mt-1">{selectedPet.shelter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.applicantEmail}
                        onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.applicantPhone}
                      onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Living Situation</CardTitle>
                  <CardDescription>Help us understand your home environment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeType">Type of Home *</Label>
                    <select
                      id="homeType"
                      value={formData.homeType}
                      onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
                      className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      required
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasYard">Do you have a yard? *</Label>
                    <select
                      id="hasYard"
                      value={formData.hasYard}
                      onChange={(e) => setFormData({ ...formData, hasYard: e.target.value })}
                      className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      required
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasPets">Do you currently have other pets? *</Label>
                    <select
                      id="hasPets"
                      value={formData.hasPets}
                      onChange={(e) => setFormData({ ...formData, hasPets: e.target.value })}
                      className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      required
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Pet Care Experience</CardTitle>
                  <CardDescription>Share your experience with pets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Previous Pet Ownership Experience *</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Tell us about your experience caring for pets..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Why do you want to adopt {selectedPet.name}? *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Share your reasons for wanting to adopt this pet..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-slate-900 mb-2">My Applications</h1>
            <p className="text-slate-600 mb-8">
              Track your adoption applications
            </p>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="size-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-slate-900 mb-2">No Applications Yet</h3>
                  <p className="text-slate-600 mb-6">
                    You haven't submitted any adoption applications yet.
                  </p>
                  <Button onClick={onBack} className="bg-orange-600 hover:bg-orange-700">
                    Browse Pets
                  </Button>
                </CardContent>
              </Card>
            ) : (
                <div className="space-y-4">
                {applications.map((app) => {
                  console.log(app);
                  return (
                  <Card key={app.id}>
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
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                        <h3 className="text-slate-900">{app.petName}</h3>
                        <p className="text-sm text-slate-600">
                          Submitted on {new Date(app.submittedDate).toLocaleDateString()}
                        </p>
                        </div>
                        <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Application #{app.id.toString().padStart(6, '0')}
                      </p>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                  );
                })}
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
