import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  value: JourneyState
}

type JourneyState = {
  journeys: JourneyType[] | null
}

export type JourneyType = {
  reconstructionReference: string,
  detailsReference: string,
  isDeparted: boolean,
  tripLegs?: TripLeg[],
  connectionLinks?: ConnectionLink[],
  arrivalAccessLink: ArrivalAccessLink,
  destinationLink?: DestinationLink
}

export type ConnectionLink = {
  journeyLegIndex: number,
  transportMode: string,
  transportSubMode: string,
  origin: Origin,
  destination: Destination,
  notes: Note[],
  distanceInMeters: number,
  plannedDepartureTime: string,
  plannedArrivalTime: string,
  plannedDurationInMinutes: number,
  estimatedDepartureTime: string,
  estimatedArrivalTime: string,
  estimatedDurationInMinutes: number,
  estimatedNumberOfSteps: number,
  linkCoordinates: Coordinates[]
}

export type DestinationLink = {
  transportMode: string,
  transportSubMode: string,
  origin: {
    gid: string,
    name: string,
    locationType: string,
    latitude: number,
    longitude: number,
    plannedTime: string,
    estimatedOtherwisePlannedTime: string,
    notes: Note[]
  },
  destination: Destination,
  notes: Note[],
  distanceInMeters: number,
  plannedDepartureTime: string,
  plannedArrivalTime: string,
  plannedDurationInMinutes: number,
  estimatedNumberOfSteps: number,
  linkCoordinates: Coordinates,
  segments: Segment[]

}

type Segment = {
  distanceInMeters: number,
  maneuver: string,
  maneuverDescription: string,
  name: string,
  orientation: string
}

export type TripLeg = {
  origin: Origin,
  destination: Destination,
  isCancelled: boolean,
  isPartCancelled: boolean,
  serviceJourney: ServiceJourney,
  serviceJourneys?: ServiceJourney[]
  notes: Note[],
  plannedDepartureTime: string,
  plannedArrivalTime: string,
  plannedDurationInMinutes: number,
  estimatedArrivalTime: string,
  estimatedDurationInMinutes: number,
  estimatedOtherwisePlannedArrivalTime: string,
  estimatedOtherwisePlannedDepartureTime: string,
  journeyLegIndex: number,
  callsOnTripLeg?: CallOnTripLeg[],
  plannedConnectingTimeInMinutes?: number,
  estimatedConnectingTimeInMinutes?: number,
  isRiskOfMissingConnection?: boolean
}

export type Note = {
  type: string,
  severity: string,
  text: string
}

//This looks like it could be picked or omitted from TripLeg, but honestly it functions in a very different way so I'm keeping it legible.
export type CallOnTripLeg = {
  estimatedDepartureTime: string,
  estimatedOtherwisePlannedDepartureTime: string,
  estimatedOtherwisePlannedArrivalTime: string,
  index: string,
  isCancelled: boolean,
  isOnTripLeg: boolean,
  isTripLegStart: boolean,
  latitude: number,
  longitude: number,
  plannedDepartureTime: string,
  plannedPlatform: string,
  stopPoint: StopPoint,
  plannedArrivalTime: string,
  estimatedArrivalTime: string,
  tariffZones: TariffZone[],
}


type Origin = {
  stopPoint: StopPoint,
  plannedTime: string,
  estimatedTime: string,
  estimatedOtherwisePlannedTime: string,
  notes: Note[]
}

type Destination = {
  stopPoint: StopPoint,
  plannedTime: string,
  estimatedTime: string,
  estimatedOtherwisePlannedTime: string,
  notes: Note[]
}

type StopPoint = {
  gid: string,
  name: string,
  platform: string,
  stopArea: StopArea,
}

type StopArea = {
  gid: string,
  name: string,
  latitude: number,
  longitude: number,
  tariffZone1: TariffZone
}

type TariffZone = {
  gid: string,
  name: string,
  number: number,
  shortName: string
}

export type ServiceJourney = {
  gid: string,
  direction: string,
  number: string,
  line: Line
}

type Line = {
  shortName: string,
  designation: string,
  isWheelchairAccessible: boolean,
  name: string,
  backgroundColor: string,
  foregroundColor: string,
  borderColor: string,
  transportMode: string,
  transportSubMode: string
}

type ArrivalAccessLink = {
  transportMode: string,
  transportSubMode: string,
  origin: Origin,
  destination: Destination,
  notes: Note[],
  distanceInMeters: number,
  plannedDepartureTime: string,
  plannedArrivalTime: string,
  plannedDurationInMinutes: number,
  estimatedDepartureTime: string,
  estimatedArrivalTime: string,
  estimatedDurationInMinutes: number,
  estimatedNumberOfSteps: number,
  linkCoordinates: Coordinates[]
}

type Coordinates = {
  latitude: number,
  longitude: number
}


const initialState = {
  value: {
    journeys: [],
  } as JourneyState
} as InitialState

export const journeys = createSlice({
  name: 'journeys',
  initialState,
  reducers: {
    storeJourneys: (_state, action: PayloadAction<JourneyType[]>) => {
      return {
        value: {
          journeys: action.payload
        }
      }
    },
    resetJourneys: (_state, _action: PayloadAction) => {
      return {
        value: {
          journeys: null
        }
      }
    }
  }
})

export const { storeJourneys, resetJourneys  } = journeys.actions
export default journeys.reducer
