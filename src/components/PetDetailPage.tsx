import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, Heart, MapPin, Calendar, Ruler, Zap, Users, 
  Home, Share2, CheckCircle2, XCircle 
} from 'lucide-react';
import { Pet } from '../types';

interface PetDetailPageProps {
  pet: Pet;
  isFavorite: boolean;
  onToggleFavorite: (petId: number) => void;
  onBack: () => void;
  onApply: (pet: Pet) => void;
}

export function PetDetailPage({ pet, isFavorite, onToggleFavorite, onBack, onApply }: PetDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100">
              <ImageWithFallback
                src={pet.images[selectedImage]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {pet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-orange-600'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${pet.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-slate-900 mb-2">{pet.name}</h1>
                <p className="text-slate-600">{pet.breed}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleFavorite(pet.id)}
                >
                  <Heart
                    className={`size-5 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
                    }`}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="size-5" />
                </Button>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="size-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="text-slate-900">{pet.age}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Ruler className="size-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-500">Size</p>
                    <p className="text-slate-900">{pet.size}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Zap className="size-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-500">Energy</p>
                    <p className="text-slate-900">{pet.energy}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="size-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-slate-900">{pet.location}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compatibility */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-slate-600" />
                    <span className="text-slate-700">Good with children</span>
                  </div>
                  {pet.goodWithKids ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <XCircle className="size-5 text-slate-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="size-5 text-slate-600" />
                    <span className="text-slate-700">Good with other pets</span>
                  </div>
                  {pet.goodWithPets ? (
                    <CheckCircle2 className="size-5 text-green-600" />
                  ) : (
                    <XCircle className="size-5 text-slate-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About {pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{pet.description}</p>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Personality Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {pet.traits.map((trait, index) => (
                      <Badge key={index} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shelter Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shelter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Home className="size-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-slate-900">{pet.shelter}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="size-4" />
                      {pet.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => onApply(pet)}
            >
              Apply to Adopt {pet.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
