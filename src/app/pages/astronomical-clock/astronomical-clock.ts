import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import * as Astronomy from 'astronomy-engine';
import {
  MoonPhaseInfo,
  ObserverLocation,
  SolarTimeInfo,
  SunApparentMovement,
  ZodiacPositionInfo,
} from '../../interfaces/astronomical-interface';

const LOADER_DELAY_MS = 650;
const MINUTES_PER_DAY = 1440;
const MILLISECONDS_PER_DAY = 86_400_000;
const DEGREES_PER_ZODIAC_SIGN = 30;

const DEFAULT_OBSERVER_LOCATION: ObserverLocation = {
  latitude: 25.4232,
  longitude: -100.9964,
  elevation: 1600,
};

const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈' },
  { sign: 'Tauro', symbol: '♉' },
  { sign: 'Géminis', symbol: '♊' },
  { sign: 'Cáncer', symbol: '♋' },
  { sign: 'Leo', symbol: '♌' },
  { sign: 'Virgo', symbol: '♍' },
  { sign: 'Libra', symbol: '♎' },
  { sign: 'Escorpio', symbol: '♏' },
  { sign: 'Sagitario', symbol: '♐' },
  { sign: 'Capricornio', symbol: '♑' },
  { sign: 'Acuario', symbol: '♒' },
  { sign: 'Piscis', symbol: '♓' },
] as const;

@Component({
  selector: 'app-astronomical-clock',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './astronomical-clock.html',
  styleUrl: './astronomical-clock.scss',
})
export class AstronomicalClock {
  readonly selectedDate = signal<Date>(new Date());
  readonly pendingSelectedDate = signal<Date>(new Date());
  readonly isLoading = signal(false);

  readonly sunMovement = computed(() =>
    this.calculateSunApparentMovement(this.selectedDate())
  );

  readonly moonPhase = computed(() =>
    this.calculateMoonPhase(this.selectedDate())
  );

  readonly solarTime = computed(() =>
    this.calculateSolarTime(this.selectedDate())
  );

  readonly zodiacPosition = computed(() =>
    this.calculateZodiacPosition(this.selectedDate())
  );

  private readonly observerLocation = DEFAULT_OBSERVER_LOCATION;

  onPendingDateChange(date: Date | null): void {
  if (!date) return;

  this.pendingSelectedDate.set(date);
}

  searchAstronomicalData(): void {
  this.isLoading.set(true);

  const selectedDate = this.pendingSelectedDate();

  const currentTime = new Date();

  const dateWithCurrentTime = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    currentTime.getHours(),
    currentTime.getMinutes(),
    currentTime.getSeconds()
  );

  window.setTimeout(() => {
    this.selectedDate.set(dateWithCurrentTime);
    this.isLoading.set(false);
  }, LOADER_DELAY_MS);
}
 private calculateSunApparentMovement(date: Date): SunApparentMovement {
  const observer = this.createObserver();

  const sunEquatorialCoordinates = Astronomy.Equator(
    Astronomy.Body.Sun,
    date,
    observer,
    true,
    true
  );

  const rightAscension = sunEquatorialCoordinates.ra;
  const declination = sunEquatorialCoordinates.dec;

  const sunHorizontalCoordinates = Astronomy.Horizon(
    date,
    observer,
    rightAscension,
    declination,
    'normal'
  );

  return {
    altitude: this.round(sunHorizontalCoordinates.altitude),
    azimuth: this.round(sunHorizontalCoordinates.azimuth),
    isAboveHorizon: sunHorizontalCoordinates.altitude > 0,
    sunRotationDeg: this.normalizeDegrees(sunHorizontalCoordinates.azimuth),
  };
}

  private calculateMoonPhase(date: Date): MoonPhaseInfo {
    const phaseAngle = this.normalizeDegrees(Astronomy.MoonPhase(date));
    const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);

    return {
      phaseAngle: this.round(phaseAngle),
      phaseName: this.getMoonPhaseName(phaseAngle),
      illuminationPercent: this.round(illumination.phase_fraction * 100),
      assetName: this.getMoonAssetName(phaseAngle),
    };
  }

  private calculateSolarTime(date: Date): SolarTimeInfo {
    const localMinutes = date.getHours() * 60 + date.getMinutes();
    const equationOfTimeMinutes = this.calculateEquationOfTime(
      this.getDayOfYear(date)
    );

    const timeCorrectionMinutes =
      equationOfTimeMinutes + this.calculateLongitudeCorrection(date);

    const solarMinutes = this.normalizeMinutes(
      localMinutes + timeCorrectionMinutes
    );

    return {
      localTime: this.formatMinutesAsTime(localMinutes),
      solarTime: this.formatMinutesAsTime(solarMinutes),
      equationOfTimeMinutes: this.round(equationOfTimeMinutes),
      timeCorrectionMinutes: this.round(timeCorrectionMinutes),
    };
  }

  private calculateZodiacPosition(date: Date): ZodiacPositionInfo {
    const ecliptic = Astronomy.Ecliptic(
      Astronomy.GeoVector(Astronomy.Body.Sun, date, true)
    );

    const sunEclipticLongitude = this.normalizeDegrees(ecliptic.elon);
    const zodiacIndex = Math.floor(sunEclipticLongitude / DEGREES_PER_ZODIAC_SIGN);
    const zodiac = ZODIAC_SIGNS[zodiacIndex];

    return {
      zodiacSign: zodiac.sign,
      zodiacSymbol: zodiac.symbol,
      eclipticLongitude: this.round(sunEclipticLongitude),
      zodiacRotationDeg: this.round(sunEclipticLongitude),
    };
  }

  private createObserver(): Astronomy.Observer {
    return new Astronomy.Observer(
      this.observerLocation.latitude,
      this.observerLocation.longitude,
      this.observerLocation.elevation
    );
  }

  private createDateWithCurrentTime(date: Date): Date {
    const now = new Date();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
  }

  private calculateLongitudeCorrection(date: Date): number {
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;
    const standardMeridian = timezoneOffsetHours * 15;

    return 4 * (this.observerLocation.longitude - standardMeridian);
  }

  private getMoonPhaseName(phaseAngle: number): string {
    if (phaseAngle < 22.5 || phaseAngle >= 337.5) return 'Luna nueva';
    if (phaseAngle < 67.5) return 'Creciente';
    if (phaseAngle < 112.5) return 'Cuarto creciente';
    if (phaseAngle < 157.5) return 'Gibosa creciente';
    if (phaseAngle < 202.5) return 'Luna llena';
    if (phaseAngle < 247.5) return 'Gibosa menguante';
    if (phaseAngle < 292.5) return 'Cuarto menguante';

    return 'Menguante';
  }

  private getMoonAssetName(phaseAngle: number): string {
    if (phaseAngle < 45 || phaseAngle >= 315) return 'luna_nueva.png';
    if (phaseAngle < 135) return 'cuarto_creciente.png';
    if (phaseAngle < 225) return 'luna_llena.png';

    return 'cuarto_menguante.png';
  }

  private getDayOfYear(date: Date): number {
    const yearStart = new Date(date.getFullYear(), 0, 0);
    const elapsedTime = date.getTime() - yearStart.getTime();

    return Math.floor(elapsedTime / MILLISECONDS_PER_DAY);
  }

  private calculateEquationOfTime(dayOfYear: number): number {
    const angle = (360 / 365) * (dayOfYear - 81);
    const radians = this.degreesToRadians(angle);

    return (
      9.87 * Math.sin(2 * radians) -
      7.53 * Math.cos(radians) -
      1.5 * Math.sin(radians)
    );
  }

  private showLoadingState(): void {
    this.isLoading.set(true);
  }

  private hideLoadingState(): void {
    this.isLoading.set(false);
  }

  private normalizeDegrees(value: number): number {
    return ((value % 360) + 360) % 360;
  }

  private normalizeMinutes(minutes: number): number {
    return ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  }

  private formatMinutesAsTime(totalMinutes: number): string {
    const normalizedMinutes = this.normalizeMinutes(totalMinutes);
    const hours = Math.floor(normalizedMinutes / 60);
    const minutes = Math.floor(normalizedMinutes % 60);

    return `${this.padTimeValue(hours)}:${this.padTimeValue(minutes)}`;
  }

  private padTimeValue(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;

    return Math.round(value * factor) / factor;
  }
}