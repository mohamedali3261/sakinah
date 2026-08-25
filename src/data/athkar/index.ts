import { AthkarCategory } from '../../types';
import { morningAthkar } from './morning';
import { eveningAthkar } from './evening';
import { sleepAthkar } from './sleep';
import { wakingAthkar } from './waking';
import { afterPrayerAthkar } from './afterPrayer';
import { ruqyahAthkar } from './ruqyah';
import { distressAthkar } from './distress';
import { foodAthkar } from './food';
import { travelAthkar } from './travel';
import { hajjUmrahAthkar } from './hajjUmrah';
import { quranicDuasAthkar } from './quranicDuas';

export {
  morningAthkar,
  eveningAthkar,
  sleepAthkar,
  wakingAthkar,
  afterPrayerAthkar,
  ruqyahAthkar,
  distressAthkar,
  foodAthkar,
  travelAthkar,
  hajjUmrahAthkar,
  quranicDuasAthkar
};

export const ATHKAR_CATEGORIES: AthkarCategory[] = [
  morningAthkar,
  eveningAthkar,
  sleepAthkar,
  wakingAthkar,
  afterPrayerAthkar,
  ruqyahAthkar,
  distressAthkar,
  foodAthkar,
  travelAthkar,
  hajjUmrahAthkar,
  quranicDuasAthkar
];
