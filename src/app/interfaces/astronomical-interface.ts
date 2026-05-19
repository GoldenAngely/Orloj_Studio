
//Movimiento aparente del sol
export interface ObserverLocation {
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface SunApparentMovement {
  altitude: number;
  azimuth: number;
  isAboveHorizon: boolean;
  sunRotationDeg: number;
}

//Fases de la luna
export interface MoonPhaseInfo {
  phaseAngle: number;
  phaseName: string;
  illuminationPercent: number;
  assetName: string;
}

//Hora Solar y local
 export interface SolarTimeInfo {
  localTime: string;
  solarTime: string;
  equationOfTimeMinutes: number;
  timeCorrectionMinutes: number;
}

//Posición del zodiaco
export interface ZodiacPositionInfo {
  zodiacSign: string;
  zodiacSymbol: string;
  eclipticLongitude: number;
  zodiacRotationDeg: number;
}