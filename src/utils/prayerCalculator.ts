// Astronomical Solar Prayer Calculator Engine
// Calculates exact prayer times for any latitude, longitude, and date

export interface CalculationParameters {
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // minutes after maghrib (e.g. 90 mins for Umm Al-Qura)
  maghribInterval?: number; // minutes after sunset
  asrFactor: 1 | 2; // 1 = Standard (Shafi'i, Maliki, Hanbali), 2 = Hanafi
}

export const CALCULATION_PRESETS: { [key: string]: CalculationParameters } = {
  egypt: {
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    asrFactor: 1
  },
  makkah: {
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaInterval: 90, // 90 min after Maghrib (120 in Ramadan)
    asrFactor: 1
  },
  mwl: {
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    asrFactor: 1
  },
  diyanet: {
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    asrFactor: 1
  },
  karachi: {
    fajrAngle: 18.0,
    ishaAngle: 18.0,
    asrFactor: 2
  },
  isna: {
    fajrAngle: 15.0,
    ishaAngle: 15.0,
    asrFactor: 1
  },
  tehran: {
    fajrAngle: 17.7,
    ishaAngle: 14.0,
    asrFactor: 1
  },
  gulf: {
    fajrAngle: 19.5,
    ishaAngle: 0,
    ishaInterval: 90,
    asrFactor: 1
  }
};

// Trigonometric helpers in degrees
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(Math.max(-1, Math.min(1, x))));
const acosD = (x: number) => r2d(Math.acos(Math.max(-1, Math.min(1, x))));
const atanD = (x: number) => r2d(Math.atan(x));

// Fix angle to 0..360 range
const fixAngle = (a: number) => {
  let res = a % 360.0;
  if (res < 0) res += 360.0;
  return res;
};

// Fix hour to 0..24 range
const fixHour = (h: number) => {
  let res = h % 24.0;
  if (res < 0) res += 24.0;
  return res;
};

export interface ComputedPrayers {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qiblaAngle: number;
}

/**
 * Calculates solar position (declination & equation of time) for Julian Day
 */
function getSunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));

  const e = 23.439 - 0.00000036 * D;
  const d = asinD(sinD(e) * sinD(L));
  let RA = atanD(cosD(e) * sinD(L) / cosD(L)) / 15.0;
  
  if (cosD(L) < 0) {
    RA += 12;
  } else if (sinD(L) < 0) {
    RA += 24;
  }

  const EqT = q / 15.0 - fixHour(RA);
  return { declination: d, equationOfTime: EqT };
}

/**
 * Calculate Julian Day from a Gregorian Date
 */
function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * Computes exact astronomical prayer times for given coordinates and date
 */
export function calculateAstronomicalPrayers(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  methodKey: string = 'egypt',
  asrJuristic: 'standard' | 'hanafi' = 'standard',
  timezoneOffsetHours?: number,
  manualOffsetMinutes: number = 0
): ComputedPrayers {
  const params = CALCULATION_PRESETS[methodKey] || CALCULATION_PRESETS.egypt;
  const asrFactor = asrJuristic === 'hanafi' ? 2 : (params.asrFactor || 1);

  // Timezone in hours from UTC (if not provided, derive from date)
  const tz = timezoneOffsetHours !== undefined ? timezoneOffsetHours : -date.getTimezoneOffset() / 60;
  
  // Apply manual offset in minutes (converted to hours)
  const manualOffsetHours = manualOffsetMinutes / 60;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const { declination, equationOfTime } = getSunPosition(jd);

  // Dhuhr is mid-day (solar transit) with manual offset
  const dhuhrTime = fixHour(12 + tz - longitude / 15.0 - equationOfTime + manualOffsetHours);

  // Function to compute hour angle for a given sun angle
  const getHourAngle = (angle: number): number => {
    const cosHA = (sinD(-angle) - sinD(latitude) * sinD(declination)) / (cosD(latitude) * cosD(declination));
    if (cosHA > 1) return 0; // sun never rises
    if (cosHA < -1) return 180; // sun never sets
    return acosD(cosHA) / 15.0; // hours
  };

  // Sunrise and Sunset (approx 0.833 degrees refraction & radius)
  const sunRiseSetAngle = 0.833;
  const sunRiseSetHA = getHourAngle(sunRiseSetAngle);
  const sunriseTime = fixHour(dhuhrTime - sunRiseSetHA);
  const sunsetTime = fixHour(dhuhrTime + sunRiseSetHA);

  // Fajr
  const fajrHA = getHourAngle(params.fajrAngle);
  const fajrTime = fixHour(dhuhrTime - fajrHA);

  // Asr
  const asrAngle = -atanD(1.0 / (asrFactor + tanD(Math.abs(latitude - declination))));
  const asrHA = getHourAngle(-asrAngle);
  const asrTime = fixHour(dhuhrTime + asrHA);

  // Maghrib
  let maghribTime = sunsetTime;
  if (params.maghribInterval) {
    maghribTime = fixHour(sunsetTime + params.maghribInterval / 60.0);
  }

  // Isha
  let ishaTime: number;
  if (params.ishaInterval) {
    ishaTime = fixHour(maghribTime + params.ishaInterval / 60.0);
  } else {
    const ishaHA = getHourAngle(params.ishaAngle);
    ishaTime = fixHour(dhuhrTime + ishaHA);
  }

  // Format hours as HH:MM string
  const formatTime = (time: number): string => {
    let t = fixHour(time);
    let h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    if (m >= 60) {
      h = (h + 1) % 24;
      m = 0;
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Calculate Qibla direction from latitude and longitude to Kaaba (21.4225° N, 39.8262° E)
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const num = sinD(kaabaLng - longitude);
  const denom = cosD(latitude) * tanD(kaabaLat) - sinD(latitude) * cosD(kaabaLng - longitude);
  let qibla = atanD(num / denom);
  if (denom < 0) qibla += 180;
  qibla = Math.round(fixAngle(qibla));

  return {
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime),
    qiblaAngle: qibla
  };
}

/**
 * Fetch official verified times from AlAdhan API with local fallback
 */
export async function fetchLivePrayerTimes(
  city: string,
  country: string,
  methodId: string = '5', // 5 = Egyptian General Authority, 4 = Umm Al Qura, 3 = MWL, 2 = ISNA, 1 = Karachi, 13 = Diyanet
  latitude?: number,
  longitude?: number
): Promise<ComputedPrayers | null> {
  try {
    const methodMap: { [key: string]: number } = {
      egypt: 5,
      makkah: 4,
      mwl: 3,
      isna: 2,
      karachi: 1,
      diyanet: 13
    };
    const methodNum = methodMap[methodId] || 5;

    let url = '';
    if (latitude !== undefined && longitude !== undefined) {
      url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${methodNum}`;
    } else {
      url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${methodNum}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    if (data.code === 200 && data.data && data.data.timings) {
      const t = data.data.timings;
      const cleanTime = (s: string) => s.replace(/\s*\(.*?\)/, '').trim().slice(0, 5);
      return {
        fajr: cleanTime(t.Fajr),
        sunrise: cleanTime(t.Sunrise),
        dhuhr: cleanTime(t.Dhuhr),
        asr: cleanTime(t.Asr),
        maghrib: cleanTime(t.Maghrib),
        isha: cleanTime(t.Isha),
        qiblaAngle: 0
      };
    }
  } catch (err) {
    console.warn('AlAdhan live API fallback to local calculation:', err);
  }
  return null;
}
