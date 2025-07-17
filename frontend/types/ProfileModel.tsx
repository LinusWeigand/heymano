export interface ProfileModel {
  id: string;
  viewer_id: string;
  name: string;
  rechtsform_name: string;
  rechtsform_explain_name: string;
  email: string;
  telefon: string;
  craft: string;
  experience: number;
  location: string;
  lng: number
  lat: number
  website: string;
  instagram: string;
  bio: string;
  handwerks_karten_nummer: string;
  skills: string[];
  photos?: string[];
}

