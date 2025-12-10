import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PawPrint, Search, Heart, FileCheck, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <PawPrint className="size-6 text-orange-600" />
              <span className="text-orange-900">Pet Connect</span>
            </div>
            <Button onClick={onGetStarted} className="bg-orange-600 hover:bg-orange-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-slate-900 mb-6">
                Find Your Perfect Pet Companion
              </h1>
              <p className="text-slate-700 mb-8 max-w-xl">
                Connect with loving pets from local shelters. Browse hundreds of dogs and cats waiting for their forever homes. Simple, secure, and designed to help you find your new best friend.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={onGetStarted} className="bg-orange-600 hover:bg-orange-700">
                  Start Browsing Pets
                  <ArrowRight className="size-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={onGetStarted}>
                  I'm a Shelter
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-200">
                <div>
                  <p className="text-orange-900 mb-1">500+</p>
                  <p className="text-sm text-slate-600">Pets Available</p>
                </div>
                <div>
                  <p className="text-orange-900 mb-1">50+</p>
                  <p className="text-sm text-slate-600">Partner Shelters</p>
                </div>
                <div>
                  <p className="text-orange-900 mb-1">1,200+</p>
                  <p className="text-sm text-slate-600">Successful Adoptions</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1600044432780-77c381f5c4af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB3aXRoJTIwcGV0JTIwZG9nfGVufDF8fHx8MTc2Mjg5NTE4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Happy family with pet"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating cards */}
              <div className="hidden lg:block absolute -left-6 top-1/4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1725544109150-8c6cd4a4824d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHB1cHB5fGVufDF8fHx8MTc2Mjg0Njc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Happy puppy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-slate-900">New Match!</p>
                    <p className="text-xs text-slate-600">Max is waiting for you</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block absolute -right-6 bottom-1/4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1614035030394-b6e5b01e0737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2l0dGVufGVufDF8fHx8MTc2Mjg0MTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Cute kitten"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-slate-900">Just Listed</p>
                    <p className="text-xs text-slate-600">Luna needs a home</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">How Pet Connect Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Finding your new furry family member has never been easier. Follow these simple steps to start your adoption journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="size-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                  <Search className="size-8 text-orange-600" />
                </div>
                <h3 className="text-slate-900 mb-3">1. Browse Pets</h3>
                <p className="text-sm text-slate-600">
                  Search our database of available pets by species, size, age, energy level, and location.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="size-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Heart className="size-8 text-purple-600" />
                </div>
                <h3 className="text-slate-900 mb-3">2. Save Favorites</h3>
                <p className="text-sm text-slate-600">
                  Create a list of pets you're interested in and compare their profiles to find the perfect match.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <FileCheck className="size-8 text-blue-600" />
                </div>
                <h3 className="text-slate-900 mb-3">3. Apply Online</h3>
                <p className="text-sm text-slate-600">
                  Submit your adoption application directly through our platform and track its status in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <PawPrint className="size-8 text-green-600" />
                </div>
                <h3 className="text-slate-900 mb-3">4. Meet & Adopt</h3>
                <p className="text-sm text-slate-600">
                  Connect with the shelter, meet your new pet, and welcome them into your loving home!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-slate-900 mb-6">For Pet Adopters</h2>
              <p className="text-slate-600 mb-8">
                Everything you need to find and adopt your perfect companion in one simple platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Advanced Search Filters</p>
                    <p className="text-sm text-slate-600">Find pets that match your lifestyle with detailed filtering options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Detailed Pet Profiles</p>
                    <p className="text-sm text-slate-600">View photos, personality traits, and compatibility information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Application Tracking</p>
                    <p className="text-sm text-slate-600">Monitor the status of your adoption applications in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Favorites List</p>
                    <p className="text-sm text-slate-600">Save and compare multiple pets to make the best decision</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-slate-900 mb-6">For Shelters</h2>
              <p className="text-slate-600 mb-8">
                Powerful tools to manage your adoption process and connect pets with loving families.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Easy Pet Listings</p>
                    <p className="text-sm text-slate-600">Add new pets with comprehensive details and multiple photos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Application Management</p>
                    <p className="text-sm text-slate-600">Review, approve, or reject applications from a central dashboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Track Adoptions</p>
                    <p className="text-sm text-slate-600">Monitor the entire adoption process from application to completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 mb-1">Analytics Dashboard</p>
                    <p className="text-sm text-slate-600">View statistics and insights about your adoption programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet owners who found their perfect companions through Pet Connect. Start your journey today.
          </p>
          <Button size="lg" variant="outline" className="bg-white text-orange-600 hover:bg-orange-50" onClick={onGetStarted}>
            Get Started Now
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="size-6 text-orange-500" />
                <span className="text-white">Pet Connect</span>
              </div>
              <p className="text-sm text-slate-400">
                Connecting pets with loving families since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">For Adopters</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Browse Pets</li>
                <li>How It Works</li>
                <li>Success Stories</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">For Shelters</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Partner With Us</li>
                <li>Dashboard</li>
                <li>Resources</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            © 2024 Pet Connect. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
