import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  value: StopsState
}

type StopsState = {
  originStops: StopType[],
  destinationStops: StopType[],
  originGid: string,
  destinationGid: string
}

export type StopType = {
  gid: string,
  hasLocalService: boolean,
  latitude: number,
  locationType: string,
  longitude: number,
  name: string
}


const initialState = {
  value: {
    originStops: [],
    destinationStops: [],
    originGid: "",
    destinationGid: ""
  } as StopsState
} as InitialState

export const stops = createSlice({
  name: 'stops',
  initialState,
  reducers: {
    storeOriginStops: (state, action: PayloadAction<StopType[]>) => {
      return {
        value: {
          originStops: action.payload,
          destinationStops: state.value.destinationStops,
          originGid: state.value.originGid,
          destinationGid: state.value.destinationGid
        }
      }
    },
    storeDestinationStops: (state, action: PayloadAction<StopType[]>) => {
      return {
        value: {
          originStops: state.value.originStops,
          destinationStops: action.payload,
          originGid: state.value.originGid,
          destinationGid: state.value.destinationGid
        }
      }
    }
  }
})

export const { storeOriginStops, storeDestinationStops } = stops.actions
export default stops.reducer
