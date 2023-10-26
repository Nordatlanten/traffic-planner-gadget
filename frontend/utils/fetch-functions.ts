import axios from "axios"
import { JourneyType, storeJourneys } from '@/redux/features/journeysSlice'
import { StopType } from "@/redux/features/stopsSlice"

type StopsData = {
  data: Array<StopType>
}
export const fetchStops = async function (value: string) {
  const response = await axios.post('http://localhost:3000/vasttrafik/sevenStops', { query: value }).catch(err => console.error(err)) as StopsData
  if (response) return response.data 
}

export const getJourney = async function (origin: string, destination: string) {
  let response = await axios.post<JourneyType[]>('http://localhost:3000/vasttrafik/journey', {originGid: origin, destinationGid: destination}).catch((err) => console.error(err))

  if (response) return response.data
}
