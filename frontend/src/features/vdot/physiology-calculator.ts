import { formatSecondsToHHMMSS, secondsToPace } from "@/lib/calculations";

import {
  getAerobicHeartRace,
  getHeartRateBPM,
  getHeartRateReserve,
  getHrMaxPercentage,
} from "./calculations/heart-rate";
import {
  calculatePace,
  calculatePeriodPace,
  calculateRepetitionPace,
} from "./calculations/pace";
import {
  calculateRacePaceProjection,
  calculateRaceProjection,
} from "./calculations/race-projection";
import { calculateVDOT, calculateVDOTPercentage } from "./calculations/vdot";
import { calculateAerobicZonePaceDifference } from "./calculations/zones";
import {
  HeartRaceZone,
  RACE_DISTANCE_KEYS,
  RaceTime,
  TRAINING_DISTANCES,
  TrainingSegmentPaces,
} from "./types";

export class PhysiologyCalculator {
  // VDOT Calcs
  static calculateVDOT = calculateVDOT;
  static calculateVDOTPercentage = calculateVDOTPercentage;

  // Heart Rate Calcs
  static getAerobicHeartRace = getAerobicHeartRace;
  static getHeartRateBPM = getHeartRateBPM;
  static getHeartRateReserve = getHeartRateReserve;
  static getHrMaxPercentage = getHrMaxPercentage;

  // Aerobic Zones by Riegel
  static calculateAerobicZonePaceDifference =
    calculateAerobicZonePaceDifference;

  // Race Projection
  static calculatePace = calculatePace;
  static calculateRaceProjection = calculateRaceProjection;
  static calculateRacePaceProjection = calculateRacePaceProjection;

  // Pace calcs
  static calculatePeriodPace = calculatePeriodPace;
  static calculateRepetitionPace = calculateRepetitionPace;

  static getRaceProjections({
    durationS,
    distanceMiles,
  }: {
    durationS: number;
    distanceMiles: number;
  }) {
    const raceProjections = RACE_DISTANCE_KEYS.map((key) => ({
      race: key,
      pace: formatSecondsToHHMMSS(
        this.calculateRaceProjection({
          durationS,
          selectedDistance: key,
          distanceMiles,
        }),
      ),
    }));

    return raceProjections;
  }

  static getRacePaceProjections({
    durationS,
    distanceMiles,
  }: {
    durationS: number;
    distanceMiles: number;
  }): RaceTime[] {
    const racePaceProjections = RACE_DISTANCE_KEYS.map((key) => {
      const totalTime = this.calculateRaceProjection({
        durationS,
        selectedDistance: key,
        distanceMiles,
      });

      const racePaceProjection = this.calculateRacePaceProjection({
        selectedDistance: key,
        totalTime: totalTime,
      });

      return {
        race: key,
        pace: secondsToPace(racePaceProjection),
        time: totalTime,
      };
    });

    return racePaceProjections;
  }

  static getTrainingsPace({
    durationS,
    distanceM,
  }: {
    durationS: number;
    distanceM: number;
  }): TrainingSegmentPaces {
    const vdotPercentage = this.calculateVDOTPercentage({
      timeInSeconds: durationS,
    });

    const vdot = this.calculateVDOT({
      distanceM,
      durationS,
      VDOTPercentage: vdotPercentage,
    });

    const intervalPaceInSeconds = this.calculatePeriodPace({
      calcVDOT: vdot,
      vdotIntensity: 0.98,
    });

    const repetitionIntervalPaceInSeconds = this.calculateRepetitionPace({
      intervalPaceInSeconds,
    });

    const thresholdPace = this.calculatePeriodPace({
      calcVDOT: vdot,
      vdotIntensity: 0.88,
    });

    const totalTimeMarathonProjection = this.calculateRaceProjection({
      durationS,
      selectedDistance: HeartRaceZone.Marathon,
      distanceMiles: distanceM / 1609.34,
    });

    const marathonPaceProjection = this.calculateRacePaceProjection({
      selectedDistance: HeartRaceZone.Marathon,
      totalTime: totalTimeMarathonProjection,
    });

    return {
      THRESHOLD: TRAINING_DISTANCES.map(({ distance, multiplier }) => ({
        distance,
        pace: secondsToPace(thresholdPace * multiplier),
      })),
      INTERVAL: TRAINING_DISTANCES.map(({ distance, multiplier }) => ({
        distance,
        pace: secondsToPace(intervalPaceInSeconds * multiplier),
      })),
      REPETITION: TRAINING_DISTANCES.map(({ distance, multiplier }) => ({
        distance,
        pace: secondsToPace(repetitionIntervalPaceInSeconds * multiplier),
      })),
      defaults: {
        "Easy Aerobic Zone": {
          paceKm: `${this.calculatePace({
            calcVDOT: vdot,
            vdotPercentage: 0.7,
            correctionFactor: 0,
          })} - ${this.calculatePace({
            calcVDOT: vdot,
            vdotPercentage: 0.67,
            correctionFactor: 0,
          })}`,
        },
        Marathon: {
          paceKm: secondsToPace(marathonPaceProjection),
        },
        THRESHOLD: {
          paceKm: secondsToPace(thresholdPace),
        },
        INTERVAL: {
          paceKm: secondsToPace(intervalPaceInSeconds),
        },
        REPETITION: {
          paceKm: secondsToPace(repetitionIntervalPaceInSeconds),
        },
      },
    };
  }
}
