/**
 * Stores multiple blocks of the user's availability, such as times when they are
 * unable to attend classes
 */
import Availability, { AvailabilityArgs, argsToAvailability } from '../../types/Availability';

// action type strings
export const ADD_AVAILABILITY = 'ADD_AVAILABILITY';
export const DELETE_AVAILABILITY = 'DELETE_AVAILABILITY';
export const UPDATE_AVAILABILITY = 'UPDATE_AVAILABILITY';
export const MERGE_AVAILABILITY = 'MERGE_AVAILABILITY';

// action type interfaces
export interface AddAvailabilityAction {
    type: 'ADD_AVAILABILITY';
    availability: AvailabilityArgs;
}
export interface DeleteAvailabilityAction {
    type: 'DELETE_AVAILABILITY';
    availability: AvailabilityArgs;
}
export interface UpdateAvailabilityAction {
    type: 'UPDATE_AVAILABILITY';
    availability: AvailabilityArgs;
}
export interface MergeAvailabilityAction {
    type: 'MERGE_AVAILABILITY';
}
export type AvailabilityAction =
    AddAvailabilityAction | DeleteAvailabilityAction |
    UpdateAvailabilityAction | MergeAvailabilityAction;

// helper functions for reducer
/**
 * Returns the start time of an availability, in minutes past midnight
 * @param av
 */
const getStart = (av: Availability): number => av.startTimeHours * 60 + av.startTimeMinutes;
/**
 * Returns the end time of an availability, in minutes past midnight
 * @param av
 */
const getEnd = (av: Availability): number => av.endTimeHours * 60 + av.endTimeMinutes;
/**
 * Returns true if the given availability `av` disagrees from the given availability args
 * `avArgs`. If the availability types and day of weeks match, then a mismatch occurs when
 * start mismatches time1 or end mismatches time2
 * @param av
 * @param avArgs
 */
export const time1And2Mismatch = (av: Availability, avArgs: AvailabilityArgs): boolean => (
  av.available !== avArgs.available
  || av.dayOfWeek !== avArgs.dayOfWeek
  || getStart(av) !== avArgs.time1
  || getEnd(av) !== avArgs.time2
);
/**
 * Returns true if the given availability `av` disagrees from the given availability args
 * `avArgs`. If the availability types and day of weeks match, then a mismatch occurs when
 * start mismatches time1 and end also mismatches time1
 * @param av
 * @param avArgs
 */
export const time1OnlyMismatch = (av: Availability, avArgs: AvailabilityArgs): boolean => (
  av.available !== avArgs.available
  || av.dayOfWeek !== avArgs.dayOfWeek
  || (getStart(av) !== avArgs.time1 && getEnd(av) !== avArgs.time1)
);

// reducer
export default function availability(
  state: Availability[] = [], action: AvailabilityAction,
): Availability[] {
  switch (action.type) {
    case ADD_AVAILABILITY:
    case MERGE_AVAILABILITY: {
      // check for overlaps between the availability to be added and pre-existing ones
      let newAv = action.type === ADD_AVAILABILITY
        ? argsToAvailability(action.availability)
        : state[state.length - 1];
      const newState = state.reduce<Availability[]>((avsList, oldAv): Availability[] => {
        // only counts as an overlap if they're on the same day of the week
        if (oldAv.dayOfWeek === newAv.dayOfWeek) {
          const avWithEarlierStart = getStart(oldAv) < getStart(newAv) ? oldAv : newAv;
          const avWithLaterStart = avWithEarlierStart === oldAv ? newAv : oldAv;
          // overlap detected
          if (getEnd(avWithEarlierStart) >= getStart(avWithLaterStart)) {
            // if they're the same type, merge them
            if (oldAv.available === newAv.available) {
              const newEnd = Math.max(getEnd(oldAv), getEnd(newAv));
              const newEndHrs = Math.floor(newEnd / 60);
              const newEndMins = newEnd % 60;
              newAv = {
                available: oldAv.available,
                dayOfWeek: oldAv.dayOfWeek,
                startTimeHours: avWithEarlierStart.startTimeHours,
                startTimeMinutes: avWithEarlierStart.startTimeMinutes,
                endTimeHours: newEndHrs,
                endTimeMinutes: newEndMins,
              };
              return avsList;
            }
            // if they're different types, then set the new one to the old one's borders
          }
        }
        // if no overlap
        avsList.push(oldAv);
        return avsList;
      }, []);
      newState.push(newAv);
      return newState;
    }
    case DELETE_AVAILABILITY:
      // filters the availability list for the availability matching the action args
      return state.filter((av) => time1And2Mismatch(av, action.availability));
    case UPDATE_AVAILABILITY: {
      const { time1, time2 } = action.availability;
      let updatedAv: Availability = null;
      const newState = state.reduce<Availability[]>((avsList, av): Availability[] => {
        // if av doesn't match the args, then leave the availability as is
        if (time1OnlyMismatch(av, action.availability)) {
          avsList.push(av);
          return avsList;
        }

        // if av does match args, save updated av to append to end of list
        const startTime = Math.min(time1, time2);
        const endTime = Math.max(time1, time2);
        updatedAv = {
          ...av,
          startTimeHours: Math.floor(startTime / 60),
          startTimeMinutes: startTime % 60,
          endTimeHours: Math.floor(endTime / 60),
          endTimeMinutes: endTime % 60,
        };
        return avsList;
      }, []);
      newState.push(updatedAv);
      return newState;
    }
    default:
      return state;
  }
}
