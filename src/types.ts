export interface Pet {
  id: number;
  name: string;
  species: string; 
  breed: string;
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  gender: 'Male' | 'Female';
  color: string;
  energy: 'Low' | 'Medium' | 'High';
  goodWithKids: boolean;
  goodWithPets: boolean;
  description: string;
  traits: string[];
  location: string;
  shelter: string;
  shelterId: number;
  image: string;
  images: string[];
}

export interface Application {
  id: number;
  petId: number;
  petName: string;
  petImage: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  homeType: string;
  hasYard: boolean;
  hasPets: boolean;
  experience: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedDate: string;
  shelterId: number;
}

export type UserType = 'adopter' | 'shelter' | null;
