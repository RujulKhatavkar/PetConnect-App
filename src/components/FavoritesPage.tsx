import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, MapPin, Calendar, Ruler, Zap, Users, HeartOff } from 'lucide-react';
import { Pet } from '../types';

interface FavoritesPageProps {
  pets: Pet[];
  favorites: number[];
  onToggleFavorite: (petId: number) => void;
  onSelectPet: (pet: Pet) => void;
  onBrowse: () => void;
}

export function FavoritesPage({ pets, favorites, onToggleFavorite, onSelectPet, onBrowse }: FavoritesPageProps) {
  const favoritePets = pets.filter(pet => favorites.includes(pet.id));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">My Favorites</h1>
          <p className="text-slate-600">
            {favoritePets.length} {favoritePets.length === 1 ? 'pet' : 'pets'} saved
          </p>
        </div>

        {favoritePets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="size-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <HeartOff className="size-8 text-orange-600" />
              </div>
              <h2 className="text-slate-900 mb-2">No Favorites Yet</h2>
              <p className="text-slate-600 mb-6">
                Start browsing pets and click the heart icon to save your favorites here.
              </p>
              <Button onClick={onBrowse} className="bg-orange-600 hover:bg-orange-700">
                Browse Pets
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritePets.map((pet) => (
              <Card 
                key={pet.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden" onClick={() => onSelectPet(pet)}>
                  <ImageWithFallback
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pet.id);
                    }}
                    className="absolute top-3 right-3 size-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="size-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                <CardContent className="p-4" onClick={() => onSelectPet(pet)}>
                  <div className="mb-3">
                    <h3 className="text-slate-900 mb-1">{pet.name}</h3>
                    <p className="text-sm text-slate-600">{pet.breed}</p>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="size-4" />
                      <span>{pet.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Ruler className="size-4" />
                      <span>{pet.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="size-4" />
                      <span>{pet.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="size-3 mr-1" />
                      {pet.energy}
                    </Badge>
                    {pet.goodWithKids && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="size-3 mr-1" />
                        Kids
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
