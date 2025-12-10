import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, X, CheckCircle2, Upload } from 'lucide-react';
import { Pet } from '../types';

interface AddPetPageProps {
  onBack: () => void;
  onSubmit: (pet: Omit<Pet, 'id'>) => void;
  shelterId: number;
  shelterName: string;
}

export function AddPetPage({ onBack, onSubmit, shelterId, shelterName }: AddPetPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTrait, setCurrentTrait] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog' as 'Dog' | 'Cat',
    breed: '',
    age: 'Adult' as Pet['age'],
    size: 'Medium' as Pet['size'],
    gender: 'Male' as 'Male' | 'Female',
    color: '',
    energy: 'Medium' as Pet['energy'],
    goodWithKids: true,
    goodWithPets: true,
    description: '',
    traits: [] as string[],
    location: '',
    imageUrl: '',
  });

  const handleAddTrait = () => {
    if (currentTrait.trim() && !formData.traits.includes(currentTrait.trim())) {
      setFormData({
        ...formData,
        traits: [...formData.traits, currentTrait.trim()],
      });
      setCurrentTrait('');
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setFormData({
      ...formData,
      traits: formData.traits.filter(t => t !== trait),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newPet: Omit<Pet, 'id'> = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        size: formData.size,
        gender: formData.gender,
        color: formData.color,
        energy: formData.energy,
        goodWithKids: formData.goodWithKids,
        goodWithPets: formData.goodWithPets,
        description: formData.description,
        traits: formData.traits,
        location: formData.location,
        shelter: shelterName,
        shelterId: shelterId,
        image: formData.imageUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400'],
      };
      
      onSubmit(newPet);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: '',
          species: 'Dog',
          breed: '',
          age: 'Adult',
          size: 'Medium',
          gender: 'Male',
          color: '',
          energy: 'Medium',
          goodWithKids: true,
          goodWithPets: true,
          description: '',
          traits: [],
          location: '',
          imageUrl: '',
        });
      }, 2000);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
        </Button>

        {showSuccess ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <h2 className="text-slate-900 mb-2">Pet Added Successfully!</h2>
              <p className="text-slate-600">
                {formData.name} has been added to your available pets and is now visible to potential adopters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <h1 className="text-slate-900 mb-2">Add New Pet for Adoption</h1>
            <p className="text-slate-600 mb-8">
              Fill out the details below to list a new pet for adoption
            </p>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about the pet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Pet Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Max, Luna"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species">Species *</Label>
                      <select
                        id="species"
                        value={formData.species}
                        onChange={(e) => setFormData({ ...formData, species: e.target.value as 'Dog' | 'Cat' })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                        required
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed *</Label>
                      <Input
                        id="breed"
                        value={formData.breed}
                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        placeholder="e.g., Golden Retriever, Tabby"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color/Markings *</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="e.g., Golden, Brown Tabby"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <select
                        id="age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value as Pet['age'] })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                        required
                      >
                        <option value="Puppy/Kitten">Puppy/Kitten</option>
                        <option value="Young">Young</option>
                        <option value="Adult">Adult</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Size *</Label>
                      <select
                        id="size"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value as Pet['size'] })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                        required
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Characteristics */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Characteristics & Behavior</CardTitle>
                  <CardDescription>Help adopters understand this pet's personality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="energy">Energy Level *</Label>
                    <select
                      id="energy"
                      value={formData.energy}
                      onChange={(e) => setFormData({ ...formData, energy: e.target.value as Pet['energy'] })}
                      className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      required
                    >
                      <option value="Low">Low - Calm and relaxed</option>
                      <option value="Medium">Medium - Balanced activity</option>
                      <option value="High">High - Very active and playful</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goodWithKids">Good with Children?</Label>
                      <select
                        id="goodWithKids"
                        value={formData.goodWithKids ? 'yes' : 'no'}
                        onChange={(e) => setFormData({ ...formData, goodWithKids: e.target.value === 'yes' })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goodWithPets">Good with Other Pets?</Label>
                      <select
                        id="goodWithPets"
                        value={formData.goodWithPets ? 'yes' : 'no'}
                        onChange={(e) => setFormData({ ...formData, goodWithPets: e.target.value === 'yes' })}
                        className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm bg-white"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell potential adopters about this pet's personality, habits, and what makes them special..."
                      rows={5}
                      required
                    />
                    <p className="text-xs text-slate-500">
                      Include details about their personality, behavior, special needs, training, and ideal home environment.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traits">Personality Traits</Label>
                    <div className="flex gap-2">
                      <Input
                        id="traits"
                        value={currentTrait}
                        onChange={(e) => setCurrentTrait(e.target.value)}
                        placeholder="e.g., Friendly, Playful, Calm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTrait();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTrait}>
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {formData.traits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.traits.map((trait, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {trait}
                            <button
                              type="button"
                              onClick={() => handleRemoveTrait(trait)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location & Photos */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Location & Photos</CardTitle>
                  <CardDescription>Where is this pet located and add photos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      required
                    />
                    <p className="text-xs text-slate-500">
                      This will be displayed to adopters looking for pets in their area.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Photo URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/pet-photo.jpg"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="size-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Add a URL to the pet's photo. In production, you would upload files directly.
                    </p>
                  </div>

                  {formData.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-700 mb-2">Preview:</p>
                      <div className="w-48 h-48 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={formData.imageUrl}
                          alt="Pet preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding Pet...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4 mr-2" />
                      Add Pet for Adoption
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={onBack}>
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
