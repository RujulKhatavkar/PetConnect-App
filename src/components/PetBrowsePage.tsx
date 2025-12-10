import React, { useMemo, useState } from "react";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Heart, MapPin, Calendar, Ruler, Zap, Users } from 'lucide-react';
import { Pet } from '../types';

interface PetBrowsePageProps {
  pets: Pet[];
  favorites: number[];
  onToggleFavorite: (petId: number) => void;
  onSelectPet: (pet: Pet) => void;
}
type AgeFilter = "all" | "Infant" | "Young" | "Adult" | "Senior";

function getAgeInYears(ageStr: string): number | null {
  const s = ageStr.toLowerCase().trim();

  // e.g. "10 months", "6 month"
  const monthsMatch = s.match(/(\d+)\s*month/);
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10);
    if (!Number.isNaN(months)) {
      return months / 12;
    }
  }

  // e.g. "2 years", "1 year"
  const yearsMatch = s.match(/(\d+)\s*year/);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1], 10);
    if (!Number.isNaN(years)) {
      return years;
    }
  }

  // fallback: just a number like "3"
  const n = parseInt(ageStr, 10);
  return Number.isNaN(n) ? null : n;
}

function getAgeBucket(ageStr: string): AgeFilter {
  const years = getAgeInYears(ageStr);
  if (years == null) return "Adult"; // safe default

  if (years < 1) return "Infant";
  if (years < 3) return "Young";
  if (years < 8) return "Adult";
  return "Senior";
}


export function PetBrowsePage({ pets, favorites, onToggleFavorite, onSelectPet }: PetBrowsePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [energyFilter, setEnergyFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const speciesOptions = useMemo(() => {
  const set = new Set<string>();
  pets.forEach((p) => {
    if (p.species) set.add(p.species);
  });
  return Array.from(set).sort();
}, [pets]);

  const filteredPets = pets.filter((pet) => {
  const matchesSearch =
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesSpecies =
    speciesFilter === "all" || pet.species === speciesFilter;


  const matchesAge =
    ageFilter === "all" || getAgeBucket(pet.age) === ageFilter;

  const matchesSize =
    sizeFilter === "all" || pet.size === sizeFilter;

  const matchesEnergy =
    energyFilter === "all" || pet.energy === energyFilter;

  const matchesLocation =
    !locationFilter ||
    pet.location.toLowerCase().includes(locationFilter.toLowerCase());

  return (
    matchesSearch &&
    matchesSpecies &&
    matchesAge &&
    matchesSize &&
    matchesEnergy &&
    matchesLocation
  );
});


  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Find Your Perfect Pet</h1>
          <p className="text-slate-600">
            Browse {pets.length} pets available for adoption
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-slate-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Species</label>
              <select
  value={speciesFilter}
  onChange={(e) => setSpeciesFilter(e.target.value)}
  className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
>
  <option value="all">All species</option>
  {speciesOptions.map((sp) => (
    <option key={sp} value={sp}>
      {sp}
    </option>
  ))}
</select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Age</label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                <option value="all">All Ages</option>
                <option value="Puppy/Kitten">Puppy/Kitten</option>
                <option value="Young">Young</option>
                <option value="Adult">Adult</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Size</label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                <option value="all">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Energy Level</label>
              <select
                value={energyFilter}
                onChange={(e) => setEnergyFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                <option value="all">All Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Location</label>
              <Input
                type="text"
                placeholder="City or ZIP"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          {(speciesFilter !== 'all' || ageFilter !== 'all' || sizeFilter !== 'all' || 
            energyFilter !== 'all' || locationFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSpeciesFilter('all');
                  setAgeFilter('all');
                  setSizeFilter('all');
                  setEnergyFilter('all');
                  setLocationFilter('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600">
            Showing {filteredPets.length} of {pets.length} pets
          </p>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
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
                  <Heart
                    className={`size-5 ${
                      favorites.includes(pet.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-slate-600'
                    }`}
                  />
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

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No pets found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSpeciesFilter('all');
                setAgeFilter('all');
                setSizeFilter('all');
                setEnergyFilter('all');
                setLocationFilter('');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
