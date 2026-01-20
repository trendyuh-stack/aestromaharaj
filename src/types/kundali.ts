// Types for Kundali API responses

export interface PlanetPosition {
  planet: string;
  planetHindi: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  sign: string;
  signHindi: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
  nakshatra: string;
  nakshatraPada: number;
}

export interface HouseData {
  house: number;
  sign: string;
  signHindi: string;
  degree: number;
}

export interface NakshatraInfo {
  name: string;
  hindi: string;
  lord: string;
  pada: number;
}

export interface TithiInfo {
  name: string;
  index: number;
  endTime?: string;
}

export interface YogaInfo {
  name: string;
  index: number;
}

export interface KaranaInfo {
  name: string;
  index: number;
}

export interface PanchangData {
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  sunrise: string;
  sunset: string;
  moonPhase: string;
}

export interface AntardashaInfo {
  name: string;
  start: string;
  end: string;
}

export interface DashaData {
  mahadasha: string;
  mahadashaStart: string;
  mahadashaEnd: string;
  antardashas: AntardashaInfo[];
}

export interface DivisionalChartPlanet {
  planet: string;
  sign: number;
  degree: number;
}

export interface DivisionalChart {
  name: string;
  planets: DivisionalChartPlanet[];
}

export interface KundaliInput {
  dateOfBirth: string;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface LagnaInfo {
  tropical: number;
  sidereal: number;
  sign: string;
  signHindi: string;
  degree: number;
  nakshatra: string;
  nakshatraPada: number;
}

export interface SignInfo {
  sign: string;
  signHindi: string;
}

export interface KundaliResult {
  input: KundaliInput;
  ayanamsa: number;
  lagna: LagnaInfo;
  moonSign: SignInfo;
  sunSign: SignInfo;
  moonNakshatra: NakshatraInfo;
  planets: PlanetPosition[];
  houses: HouseData[];
  panchang: PanchangData;
  dashas: DashaData[];
  charts: {
    d1: DivisionalChart;
    d9: DivisionalChart;
  };
}

// Form data from KundaliForm
export interface KundaliFormData {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  country: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}
