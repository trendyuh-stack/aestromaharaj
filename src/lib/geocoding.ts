// Geocoding utilities for converting place names to coordinates
// Uses OpenStreetMap Nominatim API (free, no API key required)

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  timezone: string;
}

// Common Indian cities with pre-cached coordinates for faster lookups
const INDIAN_CITIES: Record<string, { lat: number; lon: number; tz: string }> = {
  'mumbai': { lat: 19.0760, lon: 72.8777, tz: 'Asia/Kolkata' },
  'delhi': { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  'new delhi': { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  'bangalore': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  'chennai': { lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' },
  'kolkata': { lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, tz: 'Asia/Kolkata' },
  'pune': { lat: 18.5204, lon: 73.8567, tz: 'Asia/Kolkata' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, tz: 'Asia/Kolkata' },
  'jaipur': { lat: 26.9124, lon: 75.7873, tz: 'Asia/Kolkata' },
  'lucknow': { lat: 26.8467, lon: 80.9462, tz: 'Asia/Kolkata' },
  'kanpur': { lat: 26.4499, lon: 80.3319, tz: 'Asia/Kolkata' },
  'nagpur': { lat: 21.1458, lon: 79.0882, tz: 'Asia/Kolkata' },
  'indore': { lat: 22.7196, lon: 75.8577, tz: 'Asia/Kolkata' },
  'thane': { lat: 19.2183, lon: 72.9781, tz: 'Asia/Kolkata' },
  'bhopal': { lat: 23.2599, lon: 77.4126, tz: 'Asia/Kolkata' },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185, tz: 'Asia/Kolkata' },
  'patna': { lat: 25.5941, lon: 85.1376, tz: 'Asia/Kolkata' },
  'vadodara': { lat: 22.3072, lon: 73.1812, tz: 'Asia/Kolkata' },
  'ghaziabad': { lat: 28.6692, lon: 77.4538, tz: 'Asia/Kolkata' },
  'ludhiana': { lat: 30.9010, lon: 75.8573, tz: 'Asia/Kolkata' },
  'agra': { lat: 27.1767, lon: 78.0081, tz: 'Asia/Kolkata' },
  'nashik': { lat: 19.9975, lon: 73.7898, tz: 'Asia/Kolkata' },
  'faridabad': { lat: 28.4089, lon: 77.3178, tz: 'Asia/Kolkata' },
  'meerut': { lat: 28.9845, lon: 77.7064, tz: 'Asia/Kolkata' },
  'rajkot': { lat: 22.3039, lon: 70.8022, tz: 'Asia/Kolkata' },
  'varanasi': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  'srinagar': { lat: 34.0837, lon: 74.7973, tz: 'Asia/Kolkata' },
  'aurangabad': { lat: 19.8762, lon: 75.3433, tz: 'Asia/Kolkata' },
  'dhanbad': { lat: 23.7957, lon: 86.4304, tz: 'Asia/Kolkata' },
  'amritsar': { lat: 31.6340, lon: 74.8723, tz: 'Asia/Kolkata' },
  'navi mumbai': { lat: 19.0330, lon: 73.0297, tz: 'Asia/Kolkata' },
  'allahabad': { lat: 25.4358, lon: 81.8463, tz: 'Asia/Kolkata' },
  'prayagraj': { lat: 25.4358, lon: 81.8463, tz: 'Asia/Kolkata' },
  'ranchi': { lat: 23.3441, lon: 85.3096, tz: 'Asia/Kolkata' },
  'howrah': { lat: 22.5958, lon: 88.2636, tz: 'Asia/Kolkata' },
  'coimbatore': { lat: 11.0168, lon: 76.9558, tz: 'Asia/Kolkata' },
  'jabalpur': { lat: 23.1815, lon: 79.9864, tz: 'Asia/Kolkata' },
  'gwalior': { lat: 26.2183, lon: 78.1828, tz: 'Asia/Kolkata' },
  'vijayawada': { lat: 16.5062, lon: 80.6480, tz: 'Asia/Kolkata' },
  'jodhpur': { lat: 26.2389, lon: 73.0243, tz: 'Asia/Kolkata' },
  'madurai': { lat: 9.9252, lon: 78.1198, tz: 'Asia/Kolkata' },
  'raipur': { lat: 21.2514, lon: 81.6296, tz: 'Asia/Kolkata' },
  'kota': { lat: 25.2138, lon: 75.8648, tz: 'Asia/Kolkata' },
  'guwahati': { lat: 26.1445, lon: 91.7362, tz: 'Asia/Kolkata' },
  'chandigarh': { lat: 30.7333, lon: 76.7794, tz: 'Asia/Kolkata' },
  'solapur': { lat: 17.6599, lon: 75.9064, tz: 'Asia/Kolkata' },
  'hubli': { lat: 15.3647, lon: 75.1240, tz: 'Asia/Kolkata' },
  'mysore': { lat: 12.2958, lon: 76.6394, tz: 'Asia/Kolkata' },
  'mysuru': { lat: 12.2958, lon: 76.6394, tz: 'Asia/Kolkata' },
  'tiruchirappalli': { lat: 10.7905, lon: 78.7047, tz: 'Asia/Kolkata' },
  'bareilly': { lat: 28.3670, lon: 79.4304, tz: 'Asia/Kolkata' },
  'aligarh': { lat: 27.8974, lon: 78.0880, tz: 'Asia/Kolkata' },
  'tiruppur': { lat: 11.1085, lon: 77.3411, tz: 'Asia/Kolkata' },
  'gurgaon': { lat: 28.4595, lon: 77.0266, tz: 'Asia/Kolkata' },
  'gurugram': { lat: 28.4595, lon: 77.0266, tz: 'Asia/Kolkata' },
  'moradabad': { lat: 28.8386, lon: 78.7733, tz: 'Asia/Kolkata' },
  'jalandhar': { lat: 31.3260, lon: 75.5762, tz: 'Asia/Kolkata' },
  'bhubaneswar': { lat: 20.2961, lon: 85.8245, tz: 'Asia/Kolkata' },
  'salem': { lat: 11.6643, lon: 78.1460, tz: 'Asia/Kolkata' },
  'warangal': { lat: 17.9784, lon: 79.6000, tz: 'Asia/Kolkata' },
  'guntur': { lat: 16.3067, lon: 80.4365, tz: 'Asia/Kolkata' },
  'bhiwandi': { lat: 19.3003, lon: 73.0628, tz: 'Asia/Kolkata' },
  'saharanpur': { lat: 29.9680, lon: 77.5510, tz: 'Asia/Kolkata' },
  'gorakhpur': { lat: 26.7606, lon: 83.3732, tz: 'Asia/Kolkata' },
  'bikaner': { lat: 28.0229, lon: 73.3119, tz: 'Asia/Kolkata' },
  'amravati': { lat: 20.9374, lon: 77.7796, tz: 'Asia/Kolkata' },
  'noida': { lat: 28.5355, lon: 77.3910, tz: 'Asia/Kolkata' },
  'jamshedpur': { lat: 22.8046, lon: 86.2029, tz: 'Asia/Kolkata' },
  'bhilai': { lat: 21.2094, lon: 81.4285, tz: 'Asia/Kolkata' },
  'cuttack': { lat: 20.4625, lon: 85.8830, tz: 'Asia/Kolkata' },
  'firozabad': { lat: 27.1591, lon: 78.3957, tz: 'Asia/Kolkata' },
  'kochi': { lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  'cochin': { lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  'nellore': { lat: 14.4426, lon: 79.9865, tz: 'Asia/Kolkata' },
  'bhavnagar': { lat: 21.7645, lon: 72.1519, tz: 'Asia/Kolkata' },
  'dehradun': { lat: 30.3165, lon: 78.0322, tz: 'Asia/Kolkata' },
  'durgapur': { lat: 23.5204, lon: 87.3119, tz: 'Asia/Kolkata' },
  'asansol': { lat: 23.6889, lon: 86.9661, tz: 'Asia/Kolkata' },
  'nanded': { lat: 19.1383, lon: 77.3210, tz: 'Asia/Kolkata' },
  'kolhapur': { lat: 16.7050, lon: 74.2433, tz: 'Asia/Kolkata' },
  'ajmer': { lat: 26.4499, lon: 74.6399, tz: 'Asia/Kolkata' },
  'akola': { lat: 20.7002, lon: 77.0082, tz: 'Asia/Kolkata' },
  'gulbarga': { lat: 17.3297, lon: 76.8343, tz: 'Asia/Kolkata' },
  'jamnagar': { lat: 22.4707, lon: 70.0577, tz: 'Asia/Kolkata' },
  'ujjain': { lat: 23.1765, lon: 75.7885, tz: 'Asia/Kolkata' },
  'loni': { lat: 28.7516, lon: 77.2945, tz: 'Asia/Kolkata' },
  'siliguri': { lat: 26.7271, lon: 88.3953, tz: 'Asia/Kolkata' },
  'jhansi': { lat: 25.4484, lon: 78.5685, tz: 'Asia/Kolkata' },
  'ulhasnagar': { lat: 19.2183, lon: 73.1631, tz: 'Asia/Kolkata' },
  'jammu': { lat: 32.7266, lon: 74.8570, tz: 'Asia/Kolkata' },
  'sangli': { lat: 16.8524, lon: 74.5815, tz: 'Asia/Kolkata' },
  'mangalore': { lat: 12.9141, lon: 74.8560, tz: 'Asia/Kolkata' },
  'erode': { lat: 11.3410, lon: 77.7172, tz: 'Asia/Kolkata' },
  'belgaum': { lat: 15.8497, lon: 74.4977, tz: 'Asia/Kolkata' },
  'ambattur': { lat: 13.1143, lon: 80.1548, tz: 'Asia/Kolkata' },
  'tirunelveli': { lat: 8.7139, lon: 77.7567, tz: 'Asia/Kolkata' },
  'malegaon': { lat: 20.5579, lon: 74.5089, tz: 'Asia/Kolkata' },
  'gaya': { lat: 24.7955, lon: 85.0002, tz: 'Asia/Kolkata' },
  'udaipur': { lat: 24.5854, lon: 73.7125, tz: 'Asia/Kolkata' },
  'kakinada': { lat: 16.9891, lon: 82.2475, tz: 'Asia/Kolkata' },
  'davanagere': { lat: 14.4644, lon: 75.9218, tz: 'Asia/Kolkata' },
  'kozhikode': { lat: 11.2588, lon: 75.7804, tz: 'Asia/Kolkata' },
  'calicut': { lat: 11.2588, lon: 75.7804, tz: 'Asia/Kolkata' },
  'maheshtala': { lat: 22.5024, lon: 88.2558, tz: 'Asia/Kolkata' },
  'rajpur sonarpur': { lat: 22.4490, lon: 88.3915, tz: 'Asia/Kolkata' },
  'bokaro': { lat: 23.6693, lon: 86.1511, tz: 'Asia/Kolkata' },
  'south dumdum': { lat: 22.6208, lon: 88.4127, tz: 'Asia/Kolkata' },
  'bellary': { lat: 15.1394, lon: 76.9214, tz: 'Asia/Kolkata' },
  'patiala': { lat: 30.3398, lon: 76.3869, tz: 'Asia/Kolkata' },
  'gopalpur': { lat: 19.2583, lon: 84.9053, tz: 'Asia/Kolkata' },
  'agartala': { lat: 23.8315, lon: 91.2868, tz: 'Asia/Kolkata' },
  'bhagalpur': { lat: 25.2425, lon: 86.9842, tz: 'Asia/Kolkata' },
  'muzaffarnagar': { lat: 29.4727, lon: 77.7085, tz: 'Asia/Kolkata' },
  'bhatpara': { lat: 22.8664, lon: 88.4114, tz: 'Asia/Kolkata' },
  'panihati': { lat: 22.6934, lon: 88.3706, tz: 'Asia/Kolkata' },
  'latur': { lat: 18.4088, lon: 76.5604, tz: 'Asia/Kolkata' },
  'dhule': { lat: 20.9042, lon: 74.7749, tz: 'Asia/Kolkata' },
  'tirupati': { lat: 13.6288, lon: 79.4192, tz: 'Asia/Kolkata' },
  'rohtak': { lat: 28.8955, lon: 76.6066, tz: 'Asia/Kolkata' },
  'korba': { lat: 22.3595, lon: 82.7501, tz: 'Asia/Kolkata' },
  'bhilwara': { lat: 25.3407, lon: 74.6313, tz: 'Asia/Kolkata' },
  'berhampur': { lat: 19.3150, lon: 84.7941, tz: 'Asia/Kolkata' },
  'muzaffarpur': { lat: 26.1209, lon: 85.3647, tz: 'Asia/Kolkata' },
  'ahmednagar': { lat: 19.0948, lon: 74.7480, tz: 'Asia/Kolkata' },
  'mathura': { lat: 27.4924, lon: 77.6737, tz: 'Asia/Kolkata' },
  'kollam': { lat: 8.8932, lon: 76.6141, tz: 'Asia/Kolkata' },
  'avadi': { lat: 13.1067, lon: 80.1097, tz: 'Asia/Kolkata' },
  'kadapa': { lat: 14.4673, lon: 78.8242, tz: 'Asia/Kolkata' },
  'kamarhati': { lat: 22.6704, lon: 88.3713, tz: 'Asia/Kolkata' },
  'sambalpur': { lat: 21.4669, lon: 83.9812, tz: 'Asia/Kolkata' },
  'bilaspur': { lat: 22.0796, lon: 82.1391, tz: 'Asia/Kolkata' },
  'shahjahanpur': { lat: 27.8826, lon: 79.9110, tz: 'Asia/Kolkata' },
  'satara': { lat: 17.6805, lon: 74.0183, tz: 'Asia/Kolkata' },
  'bijapur': { lat: 16.8302, lon: 75.7100, tz: 'Asia/Kolkata' },
  'rampur': { lat: 28.8089, lon: 79.0250, tz: 'Asia/Kolkata' },
  'shimoga': { lat: 13.9299, lon: 75.5681, tz: 'Asia/Kolkata' },
  'chandrapur': { lat: 19.9615, lon: 79.2961, tz: 'Asia/Kolkata' },
  'junagadh': { lat: 21.5222, lon: 70.4579, tz: 'Asia/Kolkata' },
  'thrissur': { lat: 10.5276, lon: 76.2144, tz: 'Asia/Kolkata' },
  'alwar': { lat: 27.5530, lon: 76.6346, tz: 'Asia/Kolkata' },
  'bardhaman': { lat: 23.2324, lon: 87.8615, tz: 'Asia/Kolkata' },
  'kulti': { lat: 23.7285, lon: 86.8505, tz: 'Asia/Kolkata' },
  'kavaratti': { lat: 10.5593, lon: 72.6358, tz: 'Asia/Kolkata' },
  'nizamabad': { lat: 18.6725, lon: 78.0941, tz: 'Asia/Kolkata' },
  'parbhani': { lat: 19.2704, lon: 76.7747, tz: 'Asia/Kolkata' },
  'tumkur': { lat: 13.3379, lon: 77.1173, tz: 'Asia/Kolkata' },
  'khammam': { lat: 17.2473, lon: 80.1514, tz: 'Asia/Kolkata' },
  'ozhukarai': { lat: 11.9526, lon: 79.7706, tz: 'Asia/Kolkata' },
  'bihar sharif': { lat: 25.1982, lon: 85.5236, tz: 'Asia/Kolkata' },
  'panipat': { lat: 29.3909, lon: 76.9635, tz: 'Asia/Kolkata' },
  'darbhanga': { lat: 26.1542, lon: 85.8918, tz: 'Asia/Kolkata' },
  'bally': { lat: 22.6500, lon: 88.3400, tz: 'Asia/Kolkata' },
  'aizawl': { lat: 23.7271, lon: 92.7176, tz: 'Asia/Kolkata' },
  'dewas': { lat: 22.9676, lon: 76.0534, tz: 'Asia/Kolkata' },
  'ichalkaranji': { lat: 16.6910, lon: 74.4614, tz: 'Asia/Kolkata' },
  'karnal': { lat: 29.6857, lon: 76.9905, tz: 'Asia/Kolkata' },
  'bathinda': { lat: 30.2110, lon: 74.9455, tz: 'Asia/Kolkata' },
  'jalna': { lat: 19.8296, lon: 75.8800, tz: 'Asia/Kolkata' },
  'eluru': { lat: 16.7107, lon: 81.0952, tz: 'Asia/Kolkata' },
  'barasat': { lat: 22.7225, lon: 88.4812, tz: 'Asia/Kolkata' },
  'kirari suleman nagar': { lat: 28.7667, lon: 77.0667, tz: 'Asia/Kolkata' },
  'purnia': { lat: 25.7771, lon: 87.4753, tz: 'Asia/Kolkata' },
  'satna': { lat: 24.5979, lon: 80.8322, tz: 'Asia/Kolkata' },
  'mau': { lat: 25.9419, lon: 83.5608, tz: 'Asia/Kolkata' },
  'sonipat': { lat: 28.9931, lon: 77.0151, tz: 'Asia/Kolkata' },
  'farrukhabad': { lat: 27.3906, lon: 79.5800, tz: 'Asia/Kolkata' },
  'sagar': { lat: 23.8388, lon: 78.7378, tz: 'Asia/Kolkata' },
  'rourkela': { lat: 22.2604, lon: 84.8536, tz: 'Asia/Kolkata' },
  'durg': { lat: 21.1904, lon: 81.2849, tz: 'Asia/Kolkata' },
  'imphal': { lat: 24.8170, lon: 93.9368, tz: 'Asia/Kolkata' },
  'ratlam': { lat: 23.3315, lon: 75.0367, tz: 'Asia/Kolkata' },
  'hapur': { lat: 28.7437, lon: 77.7628, tz: 'Asia/Kolkata' },
  'arrah': { lat: 25.5541, lon: 84.6603, tz: 'Asia/Kolkata' },
  'karimnagar': { lat: 18.4386, lon: 79.1288, tz: 'Asia/Kolkata' },
  'anantapur': { lat: 14.6819, lon: 77.6006, tz: 'Asia/Kolkata' },
  'etawah': { lat: 26.7856, lon: 79.0158, tz: 'Asia/Kolkata' },
  'ambarnath': { lat: 19.1910, lon: 73.1884, tz: 'Asia/Kolkata' },
  'north dumdum': { lat: 22.6567, lon: 88.4350, tz: 'Asia/Kolkata' },
  'bharatpur': { lat: 27.2152, lon: 77.5030, tz: 'Asia/Kolkata' },
  'begusarai': { lat: 25.4182, lon: 86.1272, tz: 'Asia/Kolkata' },
  'gandhidham': { lat: 23.0753, lon: 70.1337, tz: 'Asia/Kolkata' },
  'baranagar': { lat: 22.6418, lon: 88.3749, tz: 'Asia/Kolkata' },
  'tiruvottiyur': { lat: 13.1609, lon: 80.3015, tz: 'Asia/Kolkata' },
  'pondicherry': { lat: 11.9416, lon: 79.8083, tz: 'Asia/Kolkata' },
  'puducherry': { lat: 11.9416, lon: 79.8083, tz: 'Asia/Kolkata' },
  'sikar': { lat: 27.6094, lon: 75.1399, tz: 'Asia/Kolkata' },
  'thoothukudi': { lat: 8.7642, lon: 78.1348, tz: 'Asia/Kolkata' },
  'rewa': { lat: 24.5362, lon: 81.3037, tz: 'Asia/Kolkata' },
  'mirzapur': { lat: 25.1337, lon: 82.5644, tz: 'Asia/Kolkata' },
  'raichur': { lat: 16.2120, lon: 77.3439, tz: 'Asia/Kolkata' },
  'pali': { lat: 25.7725, lon: 73.3233, tz: 'Asia/Kolkata' },
  'ramagundam': { lat: 18.7546, lon: 79.4749, tz: 'Asia/Kolkata' },
  'haridwar': { lat: 29.9457, lon: 78.1642, tz: 'Asia/Kolkata' },
  'vijayanagaram': { lat: 18.1066, lon: 83.4205, tz: 'Asia/Kolkata' },
  'katihar': { lat: 25.5546, lon: 87.5616, tz: 'Asia/Kolkata' },
  'nagarcoil': { lat: 8.1833, lon: 77.4119, tz: 'Asia/Kolkata' },
  'sri ganganagar': { lat: 29.9038, lon: 73.8772, tz: 'Asia/Kolkata' },
  'karawal nagar': { lat: 28.7600, lon: 77.2900, tz: 'Asia/Kolkata' },
  'mango': { lat: 22.8382, lon: 86.2145, tz: 'Asia/Kolkata' },
  'thanjavur': { lat: 10.7867, lon: 79.1378, tz: 'Asia/Kolkata' },
  'bulandshahr': { lat: 28.4070, lon: 77.8498, tz: 'Asia/Kolkata' },
  'uluberia': { lat: 22.4709, lon: 88.1144, tz: 'Asia/Kolkata' },
  'murwara': { lat: 23.8333, lon: 80.4000, tz: 'Asia/Kolkata' },
  'katni': { lat: 23.8333, lon: 80.4000, tz: 'Asia/Kolkata' },
  'sambhal': { lat: 28.5843, lon: 78.5549, tz: 'Asia/Kolkata' },
  'singrauli': { lat: 24.2017, lon: 82.6694, tz: 'Asia/Kolkata' },
  'nadiad': { lat: 22.6916, lon: 72.8634, tz: 'Asia/Kolkata' },
  'secunderabad': { lat: 17.4399, lon: 78.4983, tz: 'Asia/Kolkata' },
  'naihati': { lat: 22.8897, lon: 88.4219, tz: 'Asia/Kolkata' },
  'yamunanagar': { lat: 30.1290, lon: 77.2674, tz: 'Asia/Kolkata' },
  'bidhan nagar': { lat: 22.5958, lon: 88.4106, tz: 'Asia/Kolkata' },
  'pallavaram': { lat: 12.9675, lon: 80.1491, tz: 'Asia/Kolkata' },
  'bidar': { lat: 17.9126, lon: 77.5199, tz: 'Asia/Kolkata' },
  'munger': { lat: 25.3708, lon: 86.4734, tz: 'Asia/Kolkata' },
  'panchkula': { lat: 30.6942, lon: 76.8606, tz: 'Asia/Kolkata' },
  'burhanpur': { lat: 21.3104, lon: 76.2301, tz: 'Asia/Kolkata' },
  'raibareli': { lat: 26.2307, lon: 81.2330, tz: 'Asia/Kolkata' },
  'kharagpur': { lat: 22.3460, lon: 87.2320, tz: 'Asia/Kolkata' },
  'dindigul': { lat: 10.3673, lon: 77.9803, tz: 'Asia/Kolkata' },
  'gandhinagar': { lat: 23.2156, lon: 72.6369, tz: 'Asia/Kolkata' },
  'hospet': { lat: 15.2689, lon: 76.3909, tz: 'Asia/Kolkata' },
  'nangloi jat': { lat: 28.6833, lon: 77.0667, tz: 'Asia/Kolkata' },
  'malda': { lat: 25.0108, lon: 88.1411, tz: 'Asia/Kolkata' },
  'ongole': { lat: 15.5057, lon: 80.0499, tz: 'Asia/Kolkata' },
  'deoghar': { lat: 24.4764, lon: 86.6946, tz: 'Asia/Kolkata' },
  'chapra': { lat: 25.7805, lon: 84.7463, tz: 'Asia/Kolkata' },
  'haldia': { lat: 22.0257, lon: 88.0583, tz: 'Asia/Kolkata' },
  'khandwa': { lat: 21.8200, lon: 76.3600, tz: 'Asia/Kolkata' },
  'nandyal': { lat: 15.4784, lon: 78.4839, tz: 'Asia/Kolkata' },
  'morena': { lat: 26.4970, lon: 77.9910, tz: 'Asia/Kolkata' },
  'amroha': { lat: 28.9044, lon: 78.4673, tz: 'Asia/Kolkata' },
  'anand': { lat: 22.5645, lon: 72.9289, tz: 'Asia/Kolkata' },
  'bhind': { lat: 26.5671, lon: 78.7873, tz: 'Asia/Kolkata' },
  'bhiwani': { lat: 28.7929, lon: 76.1323, tz: 'Asia/Kolkata' },
  'porbandar': { lat: 21.6417, lon: 69.6293, tz: 'Asia/Kolkata' },
  'bhayandar': { lat: 19.3011, lon: 72.8512, tz: 'Asia/Kolkata' },
  'varanasi banaras': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  'banaras': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  'kashi': { lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
};

// International cities
const INTERNATIONAL_CITIES: Record<string, { lat: number; lon: number; tz: string }> = {
  'new york': { lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  'london': { lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  'paris': { lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  'tokyo': { lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  'sydney': { lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  'dubai': { lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  'singapore': { lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  'hong kong': { lat: 22.3193, lon: 114.1694, tz: 'Asia/Hong_Kong' },
  'los angeles': { lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles' },
  'chicago': { lat: 41.8781, lon: -87.6298, tz: 'America/Chicago' },
  'toronto': { lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  'melbourne': { lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne' },
  'berlin': { lat: 52.5200, lon: 13.4050, tz: 'Europe/Berlin' },
  'amsterdam': { lat: 52.3676, lon: 4.9041, tz: 'Europe/Amsterdam' },
  'san francisco': { lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles' },
  'seattle': { lat: 47.6062, lon: -122.3321, tz: 'America/Los_Angeles' },
  'boston': { lat: 42.3601, lon: -71.0589, tz: 'America/New_York' },
  'washington': { lat: 38.9072, lon: -77.0369, tz: 'America/New_York' },
  'houston': { lat: 29.7604, lon: -95.3698, tz: 'America/Chicago' },
  'dallas': { lat: 32.7767, lon: -96.7970, tz: 'America/Chicago' },
  'miami': { lat: 25.7617, lon: -80.1918, tz: 'America/New_York' },
  'atlanta': { lat: 33.7490, lon: -84.3880, tz: 'America/New_York' },
  'denver': { lat: 39.7392, lon: -104.9903, tz: 'America/Denver' },
  'phoenix': { lat: 33.4484, lon: -112.0740, tz: 'America/Phoenix' },
  'philadelphia': { lat: 39.9526, lon: -75.1652, tz: 'America/New_York' },
  'san diego': { lat: 32.7157, lon: -117.1611, tz: 'America/Los_Angeles' },
  'vancouver': { lat: 49.2827, lon: -123.1207, tz: 'America/Vancouver' },
  'montreal': { lat: 45.5017, lon: -73.5673, tz: 'America/Montreal' },
  'calgary': { lat: 51.0447, lon: -114.0719, tz: 'America/Edmonton' },
  'ottawa': { lat: 45.4215, lon: -75.6972, tz: 'America/Toronto' },
  'brisbane': { lat: -27.4698, lon: 153.0251, tz: 'Australia/Brisbane' },
  'perth': { lat: -31.9505, lon: 115.8605, tz: 'Australia/Perth' },
  'auckland': { lat: -36.8485, lon: 174.7633, tz: 'Pacific/Auckland' },
  'wellington': { lat: -41.2865, lon: 174.7762, tz: 'Pacific/Auckland' },
  'kuala lumpur': { lat: 3.1390, lon: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  'jakarta': { lat: -6.2088, lon: 106.8456, tz: 'Asia/Jakarta' },
  'bangkok': { lat: 13.7563, lon: 100.5018, tz: 'Asia/Bangkok' },
  'manila': { lat: 14.5995, lon: 120.9842, tz: 'Asia/Manila' },
  'seoul': { lat: 37.5665, lon: 126.9780, tz: 'Asia/Seoul' },
  'taipei': { lat: 25.0330, lon: 121.5654, tz: 'Asia/Taipei' },
  'beijing': { lat: 39.9042, lon: 116.4074, tz: 'Asia/Shanghai' },
  'shanghai': { lat: 31.2304, lon: 121.4737, tz: 'Asia/Shanghai' },
  'guangzhou': { lat: 23.1291, lon: 113.2644, tz: 'Asia/Shanghai' },
  'shenzhen': { lat: 22.5431, lon: 114.0579, tz: 'Asia/Shanghai' },
  'rome': { lat: 41.9028, lon: 12.4964, tz: 'Europe/Rome' },
  'milan': { lat: 45.4642, lon: 9.1900, tz: 'Europe/Rome' },
  'madrid': { lat: 40.4168, lon: -3.7038, tz: 'Europe/Madrid' },
  'barcelona': { lat: 41.3851, lon: 2.1734, tz: 'Europe/Madrid' },
  'lisbon': { lat: 38.7223, lon: -9.1393, tz: 'Europe/Lisbon' },
  'vienna': { lat: 48.2082, lon: 16.3738, tz: 'Europe/Vienna' },
  'munich': { lat: 48.1351, lon: 11.5820, tz: 'Europe/Berlin' },
  'frankfurt': { lat: 50.1109, lon: 8.6821, tz: 'Europe/Berlin' },
  'zurich': { lat: 47.3769, lon: 8.5417, tz: 'Europe/Zurich' },
  'geneva': { lat: 46.2044, lon: 6.1432, tz: 'Europe/Zurich' },
  'brussels': { lat: 50.8503, lon: 4.3517, tz: 'Europe/Brussels' },
  'dublin': { lat: 53.3498, lon: -6.2603, tz: 'Europe/Dublin' },
  'stockholm': { lat: 59.3293, lon: 18.0686, tz: 'Europe/Stockholm' },
  'copenhagen': { lat: 55.6761, lon: 12.5683, tz: 'Europe/Copenhagen' },
  'oslo': { lat: 59.9139, lon: 10.7522, tz: 'Europe/Oslo' },
  'helsinki': { lat: 60.1699, lon: 24.9384, tz: 'Europe/Helsinki' },
  'moscow': { lat: 55.7558, lon: 37.6173, tz: 'Europe/Moscow' },
  'st petersburg': { lat: 59.9343, lon: 30.3351, tz: 'Europe/Moscow' },
  'istanbul': { lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul' },
  'cairo': { lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' },
  'cape town': { lat: -33.9249, lon: 18.4241, tz: 'Africa/Johannesburg' },
  'johannesburg': { lat: -26.2041, lon: 28.0473, tz: 'Africa/Johannesburg' },
  'lagos': { lat: 6.5244, lon: 3.3792, tz: 'Africa/Lagos' },
  'nairobi': { lat: -1.2921, lon: 36.8219, tz: 'Africa/Nairobi' },
  'riyadh': { lat: 24.7136, lon: 46.6753, tz: 'Asia/Riyadh' },
  'jeddah': { lat: 21.4858, lon: 39.1925, tz: 'Asia/Riyadh' },
  'doha': { lat: 25.2854, lon: 51.5310, tz: 'Asia/Qatar' },
  'abu dhabi': { lat: 24.4539, lon: 54.3773, tz: 'Asia/Dubai' },
  'muscat': { lat: 23.5880, lon: 58.3829, tz: 'Asia/Muscat' },
  'karachi': { lat: 24.8607, lon: 67.0011, tz: 'Asia/Karachi' },
  'lahore': { lat: 31.5204, lon: 74.3587, tz: 'Asia/Karachi' },
  'islamabad': { lat: 33.6844, lon: 73.0479, tz: 'Asia/Karachi' },
  'dhaka': { lat: 23.8103, lon: 90.4125, tz: 'Asia/Dhaka' },
  'colombo': { lat: 6.9271, lon: 79.8612, tz: 'Asia/Colombo' },
  'kathmandu': { lat: 27.7172, lon: 85.3240, tz: 'Asia/Kathmandu' },
  'hanoi': { lat: 21.0285, lon: 105.8542, tz: 'Asia/Ho_Chi_Minh' },
  'ho chi minh': { lat: 10.8231, lon: 106.6297, tz: 'Asia/Ho_Chi_Minh' },
  'yangon': { lat: 16.8661, lon: 96.1951, tz: 'Asia/Yangon' },
  'phnom penh': { lat: 11.5564, lon: 104.9282, tz: 'Asia/Phnom_Penh' },
};

// Combine all cached cities
const ALL_CITIES = { ...INDIAN_CITIES, ...INTERNATIONAL_CITIES };

// Export list of cities for dropdowns
export const CITIES_LIST = Object.keys(ALL_CITIES).sort();

export async function geocodePlace(placeName: string, country?: string): Promise<GeocodingResult | null> {
  const normalizedPlace = placeName.toLowerCase().trim();

  // Check cached cities first
  if (ALL_CITIES[normalizedPlace]) {
    const cached = ALL_CITIES[normalizedPlace];
    return {
      latitude: cached.lat,
      longitude: cached.lon,
      displayName: placeName,
      timezone: cached.tz
    };
  }

  // If not in cache, use Nominatim API
  try {
    const searchQuery = country ? `${placeName}, ${country}` : placeName;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      {
        headers: {
          'User-Agent': 'AstroMaharaj-Kundali-App/1.0'
        }
      }
    );

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      // Estimate timezone based on longitude (approximate)
      const timezone = estimateTimezone(lat, lon, country);

      return {
        latitude: lat,
        longitude: lon,
        displayName: result.display_name,
        timezone
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

function estimateTimezone(lat: number, lon: number, country?: string): string {
  // For India, always return IST
  if (country?.toLowerCase() === 'india' || (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97)) {
    return 'Asia/Kolkata';
  }

  // Simple timezone estimation based on longitude
  const offset = Math.round(lon / 15);

  // Common timezone mappings by offset
  const timezoneMap: Record<number, string> = {
    [-12]: 'Etc/GMT+12',
    [-11]: 'Pacific/Midway',
    [-10]: 'Pacific/Honolulu',
    [-9]: 'America/Anchorage',
    [-8]: 'America/Los_Angeles',
    [-7]: 'America/Denver',
    [-6]: 'America/Chicago',
    [-5]: 'America/New_York',
    [-4]: 'America/Halifax',
    [-3]: 'America/Sao_Paulo',
    [-2]: 'Etc/GMT+2',
    [-1]: 'Atlantic/Azores',
    [0]: 'Europe/London',
    [1]: 'Europe/Paris',
    [2]: 'Europe/Helsinki',
    [3]: 'Europe/Moscow',
    [4]: 'Asia/Dubai',
    [5]: 'Asia/Karachi',
    [6]: 'Asia/Dhaka',
    [7]: 'Asia/Bangkok',
    [8]: 'Asia/Shanghai',
    [9]: 'Asia/Tokyo',
    [10]: 'Australia/Sydney',
    [11]: 'Pacific/Noumea',
    [12]: 'Pacific/Auckland',
  };

  return timezoneMap[offset] || 'UTC';
}
