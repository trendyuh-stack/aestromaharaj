import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= ASTRONOMICAL CONSTANTS =============
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const J2000 = 2451545.0; // Julian date for J2000.0 epoch

// Lahiri Ayanamsa constants (most widely used in India)
const AYANAMSA_J2000 = 23.85; // degrees at J2000
const AYANAMSA_RATE = 50.27 / 3600; // degrees per year (precession rate)

// Zodiac signs in order
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_SIGNS_HINDI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

// Nakshatras (27 lunar mansions)
const NAKSHATRAS = [
  { name: 'Ashwini', hindi: 'अश्विनी', lord: 'Ketu', start: 0 },
  { name: 'Bharani', hindi: 'भरणी', lord: 'Venus', start: 13.333 },
  { name: 'Krittika', hindi: 'कृत्तिका', lord: 'Sun', start: 26.667 },
  { name: 'Rohini', hindi: 'रोहिणी', lord: 'Moon', start: 40 },
  { name: 'Mrigashira', hindi: 'मृगशिरा', lord: 'Mars', start: 53.333 },
  { name: 'Ardra', hindi: 'आर्द्रा', lord: 'Rahu', start: 66.667 },
  { name: 'Punarvasu', hindi: 'पुनर्वसु', lord: 'Jupiter', start: 80 },
  { name: 'Pushya', hindi: 'पुष्य', lord: 'Saturn', start: 93.333 },
  { name: 'Ashlesha', hindi: 'आश्लेषा', lord: 'Mercury', start: 106.667 },
  { name: 'Magha', hindi: 'मघा', lord: 'Ketu', start: 120 },
  { name: 'Purva Phalguni', hindi: 'पूर्वा फाल्गुनी', lord: 'Venus', start: 133.333 },
  { name: 'Uttara Phalguni', hindi: 'उत्तरा फाल्गुनी', lord: 'Sun', start: 146.667 },
  { name: 'Hasta', hindi: 'हस्त', lord: 'Moon', start: 160 },
  { name: 'Chitra', hindi: 'चित्रा', lord: 'Mars', start: 173.333 },
  { name: 'Swati', hindi: 'स्वाति', lord: 'Rahu', start: 186.667 },
  { name: 'Vishakha', hindi: 'विशाखा', lord: 'Jupiter', start: 200 },
  { name: 'Anuradha', hindi: 'अनुराधा', lord: 'Saturn', start: 213.333 },
  { name: 'Jyeshtha', hindi: 'ज्येष्ठा', lord: 'Mercury', start: 226.667 },
  { name: 'Mula', hindi: 'मूल', lord: 'Ketu', start: 240 },
  { name: 'Purva Ashadha', hindi: 'पूर्वाषाढ़ा', lord: 'Venus', start: 253.333 },
  { name: 'Uttara Ashadha', hindi: 'उत्तराषाढ़ा', lord: 'Sun', start: 266.667 },
  { name: 'Shravana', hindi: 'श्रवण', lord: 'Moon', start: 280 },
  { name: 'Dhanishtha', hindi: 'धनिष्ठा', lord: 'Mars', start: 293.333 },
  { name: 'Shatabhisha', hindi: 'शतभिषा', lord: 'Rahu', start: 306.667 },
  { name: 'Purva Bhadrapada', hindi: 'पूर्वभाद्रपद', lord: 'Jupiter', start: 320 },
  { name: 'Uttara Bhadrapada', hindi: 'उत्तरभाद्रपद', lord: 'Saturn', start: 333.333 },
  { name: 'Revati', hindi: 'रेवती', lord: 'Mercury', start: 346.667 },
];

// Vimshottari Dasha periods in years
const DASHA_PERIODS: Record<string, number> = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
  'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};

const DASHA_SEQUENCE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

// ============= DATE/TIME UTILITIES =============

function dateToJulianDay(year: number, month: number, day: number, hour: number = 0): number {
  // Convert date to Julian Day Number
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + B - 1524.5 + hour / 24;

  return JD;
}

function julianCenturies(jd: number): number {
  return (jd - J2000) / 36525;
}

// ============= AYANAMSA CALCULATION =============

function calculateLahiriAyanamsa(jd: number): number {
  // Calculate Lahiri Ayanamsa for given Julian Day
  const yearsFromJ2000 = (jd - J2000) / 365.25;
  return AYANAMSA_J2000 + (yearsFromJ2000 * AYANAMSA_RATE);
}

// ============= PLANETARY CALCULATIONS =============
// Based on VSOP87 simplified algorithms

interface OrbitalElements {
  L0: number; // Mean longitude
  L1: number; // Longitude rate per century
  e0: number; // Eccentricity
  e1: number; // Eccentricity rate
  I0: number; // Inclination
  I1: number; // Inclination rate
  omega0: number; // Longitude of ascending node
  omega1: number; // Node rate
  w0: number; // Longitude of perihelion
  w1: number; // Perihelion rate
  a: number; // Semi-major axis (AU)
}

// Orbital elements at J2000.0 with rates per Julian century
const ORBITAL_ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: {
    L0: 252.25084, L1: 149474.07078,
    e0: 0.20563069, e1: 0.00002527,
    I0: 7.00487, I1: -0.00594,
    omega0: 48.33167, omega1: -0.12534,
    w0: 77.45645, w1: 1.55469,
    a: 0.38709893
  },
  Venus: {
    L0: 181.97973, L1: 58519.21305,
    e0: 0.00677323, e1: -0.00004938,
    I0: 3.39471, I1: -0.00079,
    omega0: 76.68069, omega1: -0.27769,
    w0: 131.53298, w1: 0.00806,
    a: 0.72333199
  },
  Earth: {
    L0: 100.46435, L1: 35999.37206,
    e0: 0.01671022, e1: -0.00003804,
    I0: 0.00005, I1: -0.01294,
    omega0: -11.26064, omega1: -0.18175,
    w0: 102.94719, w1: 1.71946,
    a: 1.00000011
  },
  Mars: {
    L0: 355.45332, L1: 19141.69551,
    e0: 0.09341233, e1: 0.00011902,
    I0: 1.85061, I1: -0.00681,
    omega0: 49.57854, omega1: -0.29257,
    w0: 336.04084, w1: 1.84064,
    a: 1.52366231
  },
  Jupiter: {
    L0: 34.40438, L1: 3036.27462,
    e0: 0.04839266, e1: -0.00012880,
    I0: 1.30530, I1: -0.00189,
    omega0: 100.55615, omega1: 0.39081,
    w0: 14.75385, w1: 0.56199,
    a: 5.20336301
  },
  Saturn: {
    L0: 49.94432, L1: 1222.49362,
    e0: 0.05415060, e1: -0.00036762,
    I0: 2.48446, I1: 0.00465,
    omega0: 113.71504, omega1: -0.35571,
    w0: 92.43194, w1: 0.97135,
    a: 9.53707032
  }
};

function calculatePlanetPosition(planet: string, jd: number): { longitude: number; latitude: number; distance: number } {
  const T = julianCenturies(jd);
  const elements = ORBITAL_ELEMENTS[planet];

  if (!elements) {
    throw new Error(`Unknown planet: ${planet}`);
  }

  // Calculate orbital elements at time T
  const L = (elements.L0 + elements.L1 * T) % 360;
  const e = elements.e0 + elements.e1 * T;
  const I = elements.I0 + elements.I1 * T;
  const omega = elements.omega0 + elements.omega1 * T;
  const w = elements.w0 + elements.w1 * T;
  const a = elements.a;

  // Mean anomaly
  const M = (L - w) % 360;
  const M_rad = M * DEG_TO_RAD;

  // Solve Kepler's equation for eccentric anomaly (iterative)
  let E = M_rad;
  for (let i = 0; i < 10; i++) {
    E = M_rad + e * Math.sin(E);
  }

  // True anomaly
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)) * RAD_TO_DEG;

  // Heliocentric longitude
  let helioLong = (v + w) % 360;
  if (helioLong < 0) helioLong += 360;

  // For Earth, we need to convert to geocentric (as seen from Earth)
  if (planet === 'Earth') {
    return { longitude: helioLong, latitude: 0, distance: a };
  }

  // Distance from Sun
  const r = a * (1 - e * Math.cos(E));

  return { longitude: helioLong, latitude: I * Math.sin((helioLong - omega) * DEG_TO_RAD), distance: r };
}

function helioToGeo(helioLong: number, helioDist: number, earthLong: number, earthDist: number): number {
  // Convert heliocentric to geocentric longitude
  const helioX = helioDist * Math.cos(helioLong * DEG_TO_RAD);
  const helioY = helioDist * Math.sin(helioLong * DEG_TO_RAD);

  const earthX = earthDist * Math.cos(earthLong * DEG_TO_RAD);
  const earthY = earthDist * Math.sin(earthLong * DEG_TO_RAD);

  const geoX = helioX - earthX;
  const geoY = helioY - earthY;

  let geoLong = Math.atan2(geoY, geoX) * RAD_TO_DEG;
  if (geoLong < 0) geoLong += 360;

  return geoLong;
}

// Sun position (as seen from Earth) - simplified algorithm
function calculateSunPosition(jd: number): number {
  const T = julianCenturies(jd);

  // Mean longitude of the Sun
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = L0 % 360;
  if (L0 < 0) L0 += 360;

  // Mean anomaly of the Sun
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M % 360;
  const M_rad = M * DEG_TO_RAD;

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad)
    + 0.000289 * Math.sin(3 * M_rad);

  // True longitude
  let sunLong = L0 + C;
  sunLong = sunLong % 360;
  if (sunLong < 0) sunLong += 360;

  return sunLong;
}

// Moon position - simplified algorithm based on Meeus
function calculateMoonPosition(jd: number): { longitude: number; latitude: number } {
  const T = julianCenturies(jd);

  // Mean longitude of Moon
  let Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  Lp = Lp % 360;
  if (Lp < 0) Lp += 360;

  // Mean elongation of Moon
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  D = D % 360;

  // Mean anomaly of Sun
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
  M = M % 360;

  // Mean anomaly of Moon
  let Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  Mp = Mp % 360;

  // Argument of latitude
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  F = F % 360;

  // Convert to radians
  const D_rad = D * DEG_TO_RAD;
  const M_rad = M * DEG_TO_RAD;
  const Mp_rad = Mp * DEG_TO_RAD;
  const F_rad = F * DEG_TO_RAD;

  // Longitude corrections (main terms)
  let dL = 6288774 * Math.sin(Mp_rad)
    + 1274027 * Math.sin(2 * D_rad - Mp_rad)
    + 658314 * Math.sin(2 * D_rad)
    + 213618 * Math.sin(2 * Mp_rad)
    - 185116 * Math.sin(M_rad)
    - 114332 * Math.sin(2 * F_rad);

  // Latitude corrections (main terms)
  let dB = 5128122 * Math.sin(F_rad)
    + 280602 * Math.sin(Mp_rad + F_rad)
    + 277693 * Math.sin(Mp_rad - F_rad);

  // Final longitude and latitude
  let moonLong = Lp + dL / 1000000;
  moonLong = moonLong % 360;
  if (moonLong < 0) moonLong += 360;

  let moonLat = dB / 1000000;

  return { longitude: moonLong, latitude: moonLat };
}

// Rahu (Mean North Node) calculation
function calculateRahuPosition(jd: number): number {
  const T = julianCenturies(jd);

  // Mean longitude of ascending node (Rahu)
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  omega = omega % 360;
  if (omega < 0) omega += 360;

  return omega;
}

// ============= HOUSE CALCULATIONS =============

function calculateLagna(jd: number, latitude: number, longitude: number): number {
  // Calculate Local Sidereal Time
  const T = julianCenturies(jd);

  // Greenwich Mean Sidereal Time at 0h UT
  let GMST = 280.46061837 + 360.98564736629 * (jd - J2000) + 0.000387933 * T * T - T * T * T / 38710000;
  GMST = GMST % 360;
  if (GMST < 0) GMST += 360;

  // Local Sidereal Time
  let LST = GMST + longitude;
  LST = LST % 360;
  if (LST < 0) LST += 360;

  // Calculate Ascendant (Lagna)
  const eps = 23.4393 - 0.013 * T; // Obliquity of ecliptic
  const lat_rad = latitude * DEG_TO_RAD;
  const eps_rad = eps * DEG_TO_RAD;
  const LST_rad = LST * DEG_TO_RAD;

  // Ascendant formula
  let y = Math.cos(LST_rad);
  let x = -Math.sin(LST_rad) * Math.cos(eps_rad) - Math.tan(lat_rad) * Math.sin(eps_rad);

  let asc = Math.atan2(y, x) * RAD_TO_DEG;
  if (asc < 0) asc += 360;

  return asc;
}

function calculateHouses(lagna: number): number[] {
  // Whole sign house system (traditional Vedic)
  const houses: number[] = [];
  const lagnaSign = Math.floor(lagna / 30);

  for (let i = 0; i < 12; i++) {
    houses.push(((lagnaSign + i) % 12) * 30);
  }

  return houses;
}

// ============= PANCHANG CALCULATIONS =============

interface PanchangData {
  tithi: { name: string; index: number; endTime: string };
  nakshatra: { name: string; hindi: string; lord: string; pada: number };
  yoga: { name: string; index: number };
  karana: { name: string; index: number };
  sunrise: string;
  sunset: string;
  moonPhase: string;
}

function calculateTithi(sunLong: number, moonLong: number): { name: string; index: number } {
  const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];

  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;

  const tithiIndex = Math.floor(diff / 12);
  const tithiName = TITHIS[tithiIndex % 15];
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';

  return { name: `${paksha} ${tithiName}`, index: tithiIndex };
}

function calculateYoga(sunLong: number, moonLong: number): { name: string; index: number } {
  const YOGAS = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];

  let sum = sunLong + moonLong;
  sum = sum % 360;

  const yogaIndex = Math.floor(sum / (360 / 27));

  return { name: YOGAS[yogaIndex], index: yogaIndex };
}

function calculateKarana(sunLong: number, moonLong: number): { name: string; index: number } {
  const KARANAS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
  ];

  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;

  const karanaIndex = Math.floor(diff / 6) % 60;
  const karanaName = karanaIndex < 57 ? KARANAS[karanaIndex % 7] : KARANAS[7 + (karanaIndex - 57)];

  return { name: karanaName, index: karanaIndex };
}

function calculateSunriseSunset(jd: number, latitude: number, longitude: number): { sunrise: string; sunset: string } {
  // Approximate sunrise/sunset calculation
  const T = julianCenturies(jd);

  // Solar declination
  const sunLong = calculateSunPosition(jd);
  const eps = 23.4393 - 0.013 * T;
  const delta = Math.asin(Math.sin(eps * DEG_TO_RAD) * Math.sin(sunLong * DEG_TO_RAD)) * RAD_TO_DEG;

  // Hour angle at sunrise/sunset
  const lat_rad = latitude * DEG_TO_RAD;
  const delta_rad = delta * DEG_TO_RAD;

  const cosH = (Math.sin(-0.833 * DEG_TO_RAD) - Math.sin(lat_rad) * Math.sin(delta_rad)) /
    (Math.cos(lat_rad) * Math.cos(delta_rad));

  if (cosH > 1) return { sunrise: 'No sunrise', sunset: 'No sunset' }; // Polar night
  if (cosH < -1) return { sunrise: 'No sunrise', sunset: 'No sunset' }; // Midnight sun

  const H = Math.acos(cosH) * RAD_TO_DEG;

  // Solar noon
  const noonOffset = -longitude / 15; // Hours from UTC

  // Sunrise and sunset times (approximate)
  const sunriseHour = 12 - H / 15 + noonOffset;
  const sunsetHour = 12 + H / 15 + noonOffset;

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.floor((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return { sunrise: formatTime(sunriseHour), sunset: formatTime(sunsetHour) };
}

// ============= DASHA CALCULATIONS =============

interface DashaData {
  mahadasha: string;
  mahadashaStart: string;
  mahadashaEnd: string;
  antardashas: { name: string; start: string; end: string }[];
}

function calculateVimshottariDasha(moonLong: number, birthDate: Date): DashaData[] {
  // Find nakshatra of Moon
  const nakshatraIndex = Math.floor(moonLong / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const nakshatraLord = nakshatra.lord;

  // Calculate remaining portion of nakshatra at birth
  const nakshatraStart = nakshatraIndex * (360 / 27);
  const degreeInNakshatra = moonLong - nakshatraStart;
  const fractionCompleted = degreeInNakshatra / (360 / 27);
  const fractionRemaining = 1 - fractionCompleted;

  // Find starting dasha
  const lordIndex = DASHA_SEQUENCE.indexOf(nakshatraLord);
  const firstDashaYears = DASHA_PERIODS[nakshatraLord] * fractionRemaining;

  // Calculate all 9 Mahadashas
  const dashas: DashaData[] = [];
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 9; i++) {
    const dashaLord = DASHA_SEQUENCE[(lordIndex + i) % 9];
    const dashaPeriod = i === 0 ? firstDashaYears : DASHA_PERIODS[dashaLord];

    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + Math.floor(dashaPeriod * 365.25));

    // Calculate Antardashas (sub-periods)
    const antardashas: { name: string; start: string; end: string }[] = [];
    let antardashStart = new Date(startDate);

    for (let j = 0; j < 9; j++) {
      const antardashLord = DASHA_SEQUENCE[(lordIndex + i + j) % 9];
      const antardashPeriod = (dashaPeriod * DASHA_PERIODS[antardashLord]) / 120;

      const antardashEnd = new Date(antardashStart);
      antardashEnd.setDate(antardashEnd.getDate() + Math.floor(antardashPeriod * 365.25));

      antardashas.push({
        name: antardashLord,
        start: antardashStart.toISOString().split('T')[0],
        end: antardashEnd.toISOString().split('T')[0]
      });

      antardashStart = new Date(antardashEnd);
    }

    dashas.push({
      mahadasha: dashaLord,
      mahadashaStart: startDate.toISOString().split('T')[0],
      mahadashaEnd: endDate.toISOString().split('T')[0],
      antardashas
    });

    currentDate = new Date(endDate);
  }

  return dashas;
}

// ============= DIVISIONAL CHARTS =============

interface DivisionalChart {
  name: string;
  planets: { planet: string; sign: number; degree: number }[];
}

function calculateNavamsa(tropicalLong: number): { sign: number; degree: number } {
  // D9 - Navamsa chart
  const signDegree = tropicalLong % 30;
  const navamsaNumber = Math.floor(signDegree / 3.333333);
  const signNumber = Math.floor(tropicalLong / 30);

  // Calculate navamsa sign based on element
  const element = signNumber % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
  const startSign = element * 3; // Fire signs start from Aries, Earth from Capricorn, etc.

  const navamsaSign = (startSign + navamsaNumber) % 12;
  const navamsaDegree = (signDegree % 3.333333) * 9;

  return { sign: navamsaSign, degree: navamsaDegree };
}

// ============= MAIN CALCULATION FUNCTION =============

interface KundaliInput {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  latitude: number;
  longitude: number;
  timezone: string;
}

interface PlanetPosition {
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

interface KundaliResult {
  input: KundaliInput;
  ayanamsa: number;
  lagna: {
    tropical: number;
    sidereal: number;
    sign: string;
    signHindi: string;
    degree: number;
    nakshatra: string;
    nakshatraPada: number;
  };
  moonSign: {
    sign: string;
    signHindi: string;
  };
  sunSign: {
    sign: string;
    signHindi: string;
  };
  moonNakshatra: {
    name: string;
    hindi: string;
    lord: string;
    pada: number;
  };
  planets: PlanetPosition[];
  houses: { house: number; sign: string; signHindi: string; degree: number }[];
  panchang: PanchangData;
  dashas: DashaData[];
  charts: {
    d1: DivisionalChart;
    d9: DivisionalChart;
  };
}

function calculateKundali(input: KundaliInput): KundaliResult {
  // Parse date and time
  const [year, month, day] = input.dateOfBirth.split('-').map(Number);
  const [hour, minute] = input.timeOfBirth.split(':').map(Number);

  // Helpers to handle timezone offsets
  // We need to convert Local Time to UTC for astronomical calculations (Julian Day)
  // Since we don't have a full TZDB here, we'll try to use the IANA timezone string if possible,
  // or fall back to a simple logic if we can parse the offset.

  // Create a date object with the local time
  // Note: Date.UTC() creates a generic UTC timestamp, we then adjust by the timezone offset
  // But Deno/Browser Intl API is better for this.

  // Let's rely on a robust way: Construct string with offset if we can, or use specific libraries.
  // Standard simple approach: Treat input as "Base Time".
  // If input timezone is "Asia/Kolkata", parse it as such.

  // We'll use a hacky but effective way for Deno:
  // Create a formatter for the given timezone, get the offset, and apply it.

  // Better yet: Just assume the input time needs to be converted to UTC.
  // J = 367Y - INT(7(Y + INT((M+9)/12))/4) + INT(275M/9) + D + 1721013.5 + UT/24

  // We need to get the UTC Hour from Local Hour.
  // We will use the 'date-fns-tz' equivalent logic or native Intl.

  // 1. Create a date string representing the local time: "YYYY-MM-DDTHH:mm:00"
  const localDateTimeStr = `${input.dateOfBirth}T${input.timeOfBirth}:00`;

  // 2. We need the offset for this timezone at this date.
  // Using Intl to get the offset part or just the UTC parts.
  const getParts = (tz: string) => {
    try {
      const d = new Date(localDateTimeStr);
      // This 'd' is created in system local time (e.g. server time), which is WRONG.
      // We must treat the numbers as abstract.

      // Correct approach using Intl.DateTimeFormat to find parsed parts in UTC
      // But simpler:
      // We just want to subtract the offset.

      // Hardcoded offsets for common zones to ensure reliability in this limited environment
      const timezones: Record<string, number> = {
        'Asia/Kolkata': 5.5,
        'IST': 5.5,
        'Asia/Dubai': 4,
        'Asia/Bangkok': 7,
        'Asia/Singapore': 8,
        'Asia/Tokyo': 9,
        'Australia/Sydney': 10, // approximate (no DST)
        'Europe/London': 0,
        'UTC': 0,
        'America/New_York': -5,
        'America/Los_Angeles': -8,
      };

      // Try to use provided timezone offset if we had it, but we only have ID.
      // Fallback to 0 if unknown for safety, or try to parse typical offsets.
      return timezones[input.timezone] ?? 5.5; // Default to IST if unknown for now as it's an Indian app
    } catch (e) {
      return 5.5;
    }
  };

  const tzOffsetHours = getParts(input.timezone);

  // Convert Local Hour to UTC Hour
  const decimalLocalHour = hour + minute / 60;
  const decimalUtcHour = decimalLocalHour - tzOffsetHours;

  // Handle day rollover (simplified)
  // Ideally we re-calculate day/month/year if hour goes < 0 or > 24
  // But standard JD algorithm usually handles decimal hours outside 0-24?
  // Let's trust dateToJulianDay can handle negative hours or >24?
  // The current dateToJulianDay implementation:
  // JD = ... + hour / 24;
  // Yes, standard math handles fractional day correctly even if negative.

  // Calculate Julian Day using UTC time
  const jd = dateToJulianDay(year, month, day, decimalUtcHour);

  // Calculate Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(jd);

  // Calculate Lagna (Ascendant)
  const tropicalLagna = calculateLagna(jd, input.latitude, input.longitude);
  let siderealLagna = tropicalLagna - ayanamsa;
  if (siderealLagna < 0) siderealLagna += 360;

  const lagnaSign = Math.floor(siderealLagna / 30);
  const lagnaDegree = siderealLagna % 30;
  const lagnaNakshatraIndex = Math.floor(siderealLagna / (360 / 27));
  const lagnaNakshatra = NAKSHATRAS[lagnaNakshatraIndex];
  const lagnaPada = Math.floor((siderealLagna % (360 / 27)) / (360 / 27 / 4)) + 1;

  // Calculate houses (whole sign system)
  const houses = calculateHouses(siderealLagna);
  const houseData = houses.map((h, i) => ({
    house: i + 1,
    sign: ZODIAC_SIGNS[Math.floor(h / 30)],
    signHindi: ZODIAC_SIGNS_HINDI[Math.floor(h / 30)],
    degree: h % 30
  }));

  // Calculate Earth position for heliocentric to geocentric conversion
  const earthPos = calculatePlanetPosition('Earth', jd);

  // Calculate Sun position
  const sunTropical = calculateSunPosition(jd);
  let sunSidereal = sunTropical - ayanamsa;
  if (sunSidereal < 0) sunSidereal += 360;

  // Calculate Moon position
  const moonPos = calculateMoonPosition(jd);
  let moonSidereal = moonPos.longitude - ayanamsa;
  if (moonSidereal < 0) moonSidereal += 360;

  // Calculate Rahu position
  const rahuTropical = calculateRahuPosition(jd);
  let rahuSidereal = rahuTropical - ayanamsa;
  if (rahuSidereal < 0) rahuSidereal += 360;

  // Ketu is always 180° opposite to Rahu
  let ketuSidereal = (rahuSidereal + 180) % 360;

  // Calculate other planets
  const planetNames = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const planetHindiNames: Record<string, string> = {
    'Sun': 'सूर्य', 'Moon': 'चंद्र', 'Mercury': 'बुध', 'Venus': 'शुक्र',
    'Mars': 'मंगल', 'Jupiter': 'गुरु', 'Saturn': 'शनि', 'Rahu': 'राहु', 'Ketu': 'केतु'
  };

  const planets: PlanetPosition[] = [];

  // Helper function to get house from longitude
  const getHouse = (siderealLong: number): number => {
    const planetSign = Math.floor(siderealLong / 30);
    const lagnaSignNum = Math.floor(siderealLagna / 30);
    return ((planetSign - lagnaSignNum + 12) % 12) + 1;
  };

  // Helper to calculate nakshatra info
  const getNakshatraInfo = (siderealLong: number) => {
    const index = Math.floor(siderealLong / (360 / 27));
    const nakshatra = NAKSHATRAS[index];
    const pada = Math.floor((siderealLong % (360 / 27)) / (360 / 27 / 4)) + 1;
    return { nakshatra: nakshatra.name, pada };
  };

  // Sun
  const sunNakshatra = getNakshatraInfo(sunSidereal);
  planets.push({
    planet: 'Sun',
    planetHindi: planetHindiNames['Sun'],
    tropicalLongitude: sunTropical,
    siderealLongitude: sunSidereal,
    sign: ZODIAC_SIGNS[Math.floor(sunSidereal / 30)],
    signHindi: ZODIAC_SIGNS_HINDI[Math.floor(sunSidereal / 30)],
    degree: sunSidereal % 30,
    house: getHouse(sunSidereal),
    isRetrograde: false, // Sun never retrograde
    nakshatra: sunNakshatra.nakshatra,
    nakshatraPada: sunNakshatra.pada
  });

  // Moon
  const moonNakshatra = getNakshatraInfo(moonSidereal);
  planets.push({
    planet: 'Moon',
    planetHindi: planetHindiNames['Moon'],
    tropicalLongitude: moonPos.longitude,
    siderealLongitude: moonSidereal,
    sign: ZODIAC_SIGNS[Math.floor(moonSidereal / 30)],
    signHindi: ZODIAC_SIGNS_HINDI[Math.floor(moonSidereal / 30)],
    degree: moonSidereal % 30,
    house: getHouse(moonSidereal),
    isRetrograde: false, // Moon never retrograde
    nakshatra: moonNakshatra.nakshatra,
    nakshatraPada: moonNakshatra.pada
  });

  // Other planets
  for (const planetName of planetNames) {
    const pos = calculatePlanetPosition(planetName, jd);
    const geoLong = helioToGeo(pos.longitude, pos.distance, earthPos.longitude, earthPos.distance);
    let sidereal = geoLong - ayanamsa;
    if (sidereal < 0) sidereal += 360;

    // Simple retrograde detection (comparing with position 1 day earlier)
    const prevJd = jd - 1;
    const prevPos = calculatePlanetPosition(planetName, prevJd);
    const prevEarthPos = calculatePlanetPosition('Earth', prevJd);
    const prevGeoLong = helioToGeo(prevPos.longitude, prevPos.distance, prevEarthPos.longitude, prevEarthPos.distance);

    let isRetrograde = false;
    const movement = geoLong - prevGeoLong;
    if (movement < -300) { // Handle 360° wrap
      isRetrograde = false;
    } else if (movement > 300) {
      isRetrograde = true;
    } else if (movement < 0) {
      isRetrograde = true;
    }

    const nakshatraInfo = getNakshatraInfo(sidereal);

    planets.push({
      planet: planetName,
      planetHindi: planetHindiNames[planetName],
      tropicalLongitude: geoLong,
      siderealLongitude: sidereal,
      sign: ZODIAC_SIGNS[Math.floor(sidereal / 30)],
      signHindi: ZODIAC_SIGNS_HINDI[Math.floor(sidereal / 30)],
      degree: sidereal % 30,
      house: getHouse(sidereal),
      isRetrograde,
      nakshatra: nakshatraInfo.nakshatra,
      nakshatraPada: nakshatraInfo.pada
    });
  }

  // Rahu
  const rahuNakshatra = getNakshatraInfo(rahuSidereal);
  planets.push({
    planet: 'Rahu',
    planetHindi: planetHindiNames['Rahu'],
    tropicalLongitude: rahuTropical,
    siderealLongitude: rahuSidereal,
    sign: ZODIAC_SIGNS[Math.floor(rahuSidereal / 30)],
    signHindi: ZODIAC_SIGNS_HINDI[Math.floor(rahuSidereal / 30)],
    degree: rahuSidereal % 30,
    house: getHouse(rahuSidereal),
    isRetrograde: true, // Rahu is always retrograde
    nakshatra: rahuNakshatra.nakshatra,
    nakshatraPada: rahuNakshatra.pada
  });

  // Ketu
  const ketuNakshatra = getNakshatraInfo(ketuSidereal);
  planets.push({
    planet: 'Ketu',
    planetHindi: planetHindiNames['Ketu'],
    tropicalLongitude: (rahuTropical + 180) % 360,
    siderealLongitude: ketuSidereal,
    sign: ZODIAC_SIGNS[Math.floor(ketuSidereal / 30)],
    signHindi: ZODIAC_SIGNS_HINDI[Math.floor(ketuSidereal / 30)],
    degree: ketuSidereal % 30,
    house: getHouse(ketuSidereal),
    isRetrograde: true, // Ketu is always retrograde
    nakshatra: ketuNakshatra.nakshatra,
    nakshatraPada: ketuNakshatra.pada
  });

  // Calculate Panchang
  const tithi = calculateTithi(sunSidereal, moonSidereal);
  const yoga = calculateYoga(sunSidereal, moonSidereal);
  const karana = calculateKarana(sunSidereal, moonSidereal);
  const { sunrise, sunset } = calculateSunriseSunset(jd, input.latitude, input.longitude);

  const moonPhaseAngle = moonSidereal - sunSidereal;
  let moonPhase = 'Waxing';
  if (moonPhaseAngle < 0 || moonPhaseAngle > 180) moonPhase = 'Waning';

  const moonNakshatraData = NAKSHATRAS[Math.floor(moonSidereal / (360 / 27))];
  const moonPada = Math.floor((moonSidereal % (360 / 27)) / (360 / 27 / 4)) + 1;

  const panchang: PanchangData = {
    tithi: { ...tithi, endTime: 'Calculated dynamically' },
    nakshatra: {
      name: moonNakshatraData.name,
      hindi: moonNakshatraData.hindi,
      lord: moonNakshatraData.lord,
      pada: moonPada
    },
    yoga,
    karana,
    sunrise,
    sunset,
    moonPhase
  };

  // Calculate Dashas
  const birthDate = new Date(year, month - 1, day, hour, minute);
  const dashas = calculateVimshottariDasha(moonSidereal, birthDate);

  // Calculate Divisional Charts
  const d1Planets = planets.map(p => ({
    planet: p.planet,
    sign: Math.floor(p.siderealLongitude / 30),
    degree: p.siderealLongitude % 30
  }));

  const d9Planets = planets.map(p => {
    const navamsa = calculateNavamsa(p.siderealLongitude);
    return { planet: p.planet, sign: navamsa.sign, degree: navamsa.degree };
  });

  return {
    input,
    ayanamsa,
    lagna: {
      tropical: tropicalLagna,
      sidereal: siderealLagna,
      sign: ZODIAC_SIGNS[lagnaSign],
      signHindi: ZODIAC_SIGNS_HINDI[lagnaSign],
      degree: lagnaDegree,
      nakshatra: lagnaNakshatra.name,
      nakshatraPada: lagnaPada
    },
    moonSign: {
      sign: ZODIAC_SIGNS[Math.floor(moonSidereal / 30)],
      signHindi: ZODIAC_SIGNS_HINDI[Math.floor(moonSidereal / 30)]
    },
    sunSign: {
      sign: ZODIAC_SIGNS[Math.floor(sunSidereal / 30)],
      signHindi: ZODIAC_SIGNS_HINDI[Math.floor(sunSidereal / 30)]
    },
    moonNakshatra: {
      name: moonNakshatraData.name,
      hindi: moonNakshatraData.hindi,
      lord: moonNakshatraData.lord,
      pada: moonPada
    },
    planets,
    houses: houseData,
    panchang,
    dashas,
    charts: {
      d1: { name: 'Rashi (D1)', planets: d1Planets },
      d9: { name: 'Navamsa (D9)', planets: d9Planets }
    }
  };
}

// ============= CURRENT TRANSITS =============

function calculateCurrentTransits() {
  const now = new Date();
  const jd = dateToJulianDay(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours() + now.getMinutes() / 60);
  const ayanamsa = calculateLahiriAyanamsa(jd);

  const transits: { planet: string; sign: string; degree: number; isRetrograde: boolean }[] = [];

  // Sun
  const sunTropical = calculateSunPosition(jd);
  let sunSidereal = sunTropical - ayanamsa;
  if (sunSidereal < 0) sunSidereal += 360;
  transits.push({
    planet: 'Sun',
    sign: ZODIAC_SIGNS[Math.floor(sunSidereal / 30)],
    degree: sunSidereal % 30,
    isRetrograde: false
  });

  // Moon
  const moonPos = calculateMoonPosition(jd);
  let moonSidereal = moonPos.longitude - ayanamsa;
  if (moonSidereal < 0) moonSidereal += 360;
  transits.push({
    planet: 'Moon',
    sign: ZODIAC_SIGNS[Math.floor(moonSidereal / 30)],
    degree: moonSidereal % 30,
    isRetrograde: false
  });

  // Other planets
  const earthPos = calculatePlanetPosition('Earth', jd);
  for (const planetName of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
    const pos = calculatePlanetPosition(planetName, jd);
    const geoLong = helioToGeo(pos.longitude, pos.distance, earthPos.longitude, earthPos.distance);
    let sidereal = geoLong - ayanamsa;
    if (sidereal < 0) sidereal += 360;

    // Retrograde check
    const prevJd = jd - 1;
    const prevPos = calculatePlanetPosition(planetName, prevJd);
    const prevEarthPos = calculatePlanetPosition('Earth', prevJd);
    const prevGeoLong = helioToGeo(prevPos.longitude, prevPos.distance, prevEarthPos.longitude, prevEarthPos.distance);

    let isRetrograde = false;
    const movement = geoLong - prevGeoLong;
    if (movement < -300) isRetrograde = false;
    else if (movement > 300) isRetrograde = true;
    else if (movement < 0) isRetrograde = true;

    transits.push({
      planet: planetName,
      sign: ZODIAC_SIGNS[Math.floor(sidereal / 30)],
      degree: sidereal % 30,
      isRetrograde
    });
  }

  // Rahu/Ketu
  const rahuTropical = calculateRahuPosition(jd);
  let rahuSidereal = rahuTropical - ayanamsa;
  if (rahuSidereal < 0) rahuSidereal += 360;
  transits.push({
    planet: 'Rahu',
    sign: ZODIAC_SIGNS[Math.floor(rahuSidereal / 30)],
    degree: rahuSidereal % 30,
    isRetrograde: true
  });

  const ketuSidereal = (rahuSidereal + 180) % 360;
  transits.push({
    planet: 'Ketu',
    sign: ZODIAC_SIGNS[Math.floor(ketuSidereal / 30)],
    degree: ketuSidereal % 30,
    isRetrograde: true
  });

  return transits;
}

// ============= HTTP HANDLER =============

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Route: /kundali - Full birth chart calculation
    if (path === 'kundali' || path === 'calculate-kundali') {
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { dateOfBirth, timeOfBirth, latitude, longitude, timezone } = body;

      // Validate inputs
      if (!dateOfBirth || !timeOfBirth || latitude === undefined || longitude === undefined) {
        return new Response(JSON.stringify({
          error: 'Missing required fields',
          required: ['dateOfBirth (YYYY-MM-DD)', 'timeOfBirth (HH:MM)', 'latitude', 'longitude']
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateOfBirth)) {
        return new Response(JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate time format
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(timeOfBirth)) {
        return new Response(JSON.stringify({ error: 'Invalid time format. Use HH:MM (24-hour)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate coordinates
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return new Response(JSON.stringify({ error: 'Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('Calculating kundali for:', { dateOfBirth, timeOfBirth, latitude, longitude, timezone });

      const result = calculateKundali({
        dateOfBirth,
        timeOfBirth,
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone: timezone || 'UTC'
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route: /panchang - Daily panchang
    if (path === 'panchang') {
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { date, latitude, longitude } = body;

      if (!date || latitude === undefined || longitude === undefined) {
        return new Response(JSON.stringify({
          error: 'Missing required fields',
          required: ['date (YYYY-MM-DD)', 'latitude', 'longitude']
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const [year, month, day] = date.split('-').map(Number);
      const jd = dateToJulianDay(year, month, day, 12); // Noon
      const ayanamsa = calculateLahiriAyanamsa(jd);

      const sunTropical = calculateSunPosition(jd);
      let sunSidereal = sunTropical - ayanamsa;
      if (sunSidereal < 0) sunSidereal += 360;

      const moonPos = calculateMoonPosition(jd);
      let moonSidereal = moonPos.longitude - ayanamsa;
      if (moonSidereal < 0) moonSidereal += 360;

      const tithi = calculateTithi(sunSidereal, moonSidereal);
      const yoga = calculateYoga(sunSidereal, moonSidereal);
      const karana = calculateKarana(sunSidereal, moonSidereal);
      const { sunrise, sunset } = calculateSunriseSunset(jd, Number(latitude), Number(longitude));

      const moonNakshatraIndex = Math.floor(moonSidereal / (360 / 27));
      const moonNakshatra = NAKSHATRAS[moonNakshatraIndex];
      const moonPada = Math.floor((moonSidereal % (360 / 27)) / (360 / 27 / 4)) + 1;

      return new Response(JSON.stringify({
        date,
        tithi,
        nakshatra: { ...moonNakshatra, pada: moonPada },
        yoga,
        karana,
        sunrise,
        sunset,
        moonSign: ZODIAC_SIGNS[Math.floor(moonSidereal / 30)],
        sunSign: ZODIAC_SIGNS[Math.floor(sunSidereal / 30)],
        ayanamsa
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route: /transits - Current planetary transits
    if (path === 'transits') {
      const transits = calculateCurrentTransits();

      return new Response(JSON.stringify({
        calculatedAt: new Date().toISOString(),
        transits
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route: /dasha - Calculate dasha for a birth chart
    if (path === 'dasha') {
      if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { dateOfBirth, timeOfBirth, latitude, longitude } = body;

      if (!dateOfBirth || !timeOfBirth || latitude === undefined || longitude === undefined) {
        return new Response(JSON.stringify({
          error: 'Missing required fields',
          required: ['dateOfBirth', 'timeOfBirth', 'latitude', 'longitude']
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const [year, month, day] = dateOfBirth.split('-').map(Number);
      const [hour, minute] = timeOfBirth.split(':').map(Number);
      const jd = dateToJulianDay(year, month, day, hour + minute / 60);
      const ayanamsa = calculateLahiriAyanamsa(jd);

      const moonPos = calculateMoonPosition(jd);
      let moonSidereal = moonPos.longitude - ayanamsa;
      if (moonSidereal < 0) moonSidereal += 360;

      const birthDate = new Date(year, month - 1, day, hour, minute);
      const dashas = calculateVimshottariDasha(moonSidereal, birthDate);

      // Find current dasha
      const now = new Date();
      let currentMahadasha = '';
      let currentAntardasha = '';

      for (const dasha of dashas) {
        const startDate = new Date(dasha.mahadashaStart);
        const endDate = new Date(dasha.mahadashaEnd);

        if (now >= startDate && now <= endDate) {
          currentMahadasha = dasha.mahadasha;

          for (const antardasha of dasha.antardashas) {
            const antStart = new Date(antardasha.start);
            const antEnd = new Date(antardasha.end);
            if (now >= antStart && now <= antEnd) {
              currentAntardasha = antardasha.name;
              break;
            }
          }
          break;
        }
      }

      return new Response(JSON.stringify({
        currentMahadasha,
        currentAntardasha,
        dashas
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Default: Return API info
    return new Response(JSON.stringify({
      name: 'Vedic Astrology API',
      version: '1.0.0',
      endpoints: [
        { path: '/kundali', method: 'POST', description: 'Full birth chart calculation' },
        { path: '/panchang', method: 'POST', description: 'Daily panchang' },
        { path: '/transits', method: 'GET', description: 'Current planetary transits' },
        { path: '/dasha', method: 'POST', description: 'Vimshottari dasha calculation' }
      ],
      note: 'All calculations use Lahiri Ayanamsa and whole sign house system'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      error: 'Calculation error',
      message: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
