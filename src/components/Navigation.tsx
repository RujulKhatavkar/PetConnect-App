import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PawPrint, Search, Heart, FileText, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { UserType } from '../types';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType: UserType;
  favoriteCount: number;
  applicationCount: number;
  onLogout: () => void;
}

export function Navigation({ 
  currentPage, 
  onNavigate, 
  userType, 
  favoriteCount,
  applicationCount,
  onLogout 
}: NavigationProps) {
  if (!userType) return null;

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate(userType === 'shelter' ? 'dashboard' : 'browse')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <PawPrint className="size-6 text-orange-600" />
            <span className="text-orange-900">Pet Connect</span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {userType === 'adopter' && (
              <>
                <Button
                  variant={currentPage === 'browse' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('browse')}
                  className={currentPage === 'browse' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <Search className="size-4 mr-2" />
                  Browse
                </Button>
                <Button
                  variant={currentPage === 'favorites' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('favorites')}
                  className={currentPage === 'favorites' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <Heart className="size-4 mr-2" />
                  Favorites
                  {favoriteCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">{favoriteCount}</Badge>
                  )}
                </Button>
                <Button
                  variant={currentPage === 'applications' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('applications')}
                  className={currentPage === 'applications' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <FileText className="size-4 mr-2" />
                  My Applications
                  {applicationCount > 0 && (
                    <Badge className="ml-2 bg-orange-500 text-white">{applicationCount}</Badge>
                  )}
                </Button>
              </>
            )}

            {userType === 'shelter' && (
              <>
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                  className={currentPage === 'dashboard' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <LayoutDashboard className="size-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'add-pet' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('add-pet')}
                  className={currentPage === 'add-pet' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  <Plus className="size-4 mr-2" />
                  Add Pet
                </Button>
              </>
            )}

            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
