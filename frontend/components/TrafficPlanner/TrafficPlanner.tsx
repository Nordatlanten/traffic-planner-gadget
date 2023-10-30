'use client'
import styles from './TrafficPlanner.module.scss'
import { useState } from 'react'
import { storeOriginStops, storeDestinationStops } from '@/redux/features/stopsSlice'
import { storeJourneys, resetJourneys, JourneyType } from '@/redux/features/journeysSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'

import { fetchStops, getJourney } from '@/utils/fetch-functions'

const FETCH_WAIT_INTERVAL = 500;

export default function TrafficPlanner(props: React.PropsWithChildren) {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [showOriginStopsList, setShowOriginStopsList] = useState(true)
  const [showDestinationStopsList, setShowDestinationStopsList] = useState(true)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originGid, setOriginGid] = useState("")
  const [destinationGid, setDestinationGid] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  
  const originStops = useAppSelector((state) => state.stopsReducer.value.originStops)
  const destinationStops = useAppSelector((state) => state.stopsReducer.value.destinationStops)

  //A cleaner way to do this would be to utilize react-query
  const [isLoading, setIsLoading] = useState(false)

  const onChangeLoadStops = async (value: string, type: string) => {
    //Only fetch stops if query is 3 characters or longer. Only fetch stops if function hasn't been called within FETCH_WAIT_INTERVAL amount of ms
    if (value.length > 2) {
      clearTimeout(timer)
      setTimer(setTimeout(async () => {
        let data = await fetchStops(value)
        if (data) {
        if (type === 'origin') {
          setOriginGid("")
          dispatch(storeOriginStops(data))
          setShowOriginStopsList(true)
        }
        if (type === 'destination') {
          setDestinationGid("")
          dispatch(storeDestinationStops(data))
          setShowDestinationStopsList(true)
        }
      }
      }, FETCH_WAIT_INTERVAL))

    } else {
      if (type === 'origin') {
        setShowOriginStopsList(false)
        dispatch(storeDestinationStops([]))
      }
      if (type === 'destination') {
        setShowDestinationStopsList(false)
        dispatch(storeDestinationStops([]))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    let data = await getJourney(originGid, destinationGid)
    setIsLoading(false)
    dispatch(resetJourneys())

    if (data) dispatch(storeJourneys(data))
  }

  const setInputValueToStopName = (e: React.MouseEvent, type: string) => {
    let target = e.target as HTMLElement
    if (type === 'origin') {
      setOrigin(target.innerHTML)
      setShowOriginStopsList(false)
    }
    if (type === 'destination') {
      setDestination(target.innerHTML)
      setShowDestinationStopsList(false)
    }
  }

  const switchGids = () => {
    setOrigin(destination)
    setDestination(origin)
    if(destinationGid) setOriginGid(destinationGid)
    if(originGid) setDestinationGid(originGid)
  }

  return (
    <div className={styles.main}> 
      <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formPanel}>
        <div className={styles.inputContainer}>
          <div className={styles.inputBlock}>
            <label htmlFor="origin" className={styles.inputTitle}>From</label>
            <input type="text" id="origin" placeholder='Stop or station' value={origin} onClick={() => setShowOriginStopsList(true)} onChange={(e) => {
              setOrigin(e.target.value)
              setShowOriginStopsList(false)
              onChangeLoadStops(e.target.value, 'origin')
            }} />
            <ul tabIndex={-1} className={[styles.stopsList, !showOriginStopsList ? styles.hideStopsList : ""].join(" ")}>
              {originStops && originStops.map((stop, i) =>
                <li onClick={(e) => {
                  setInputValueToStopName(e, 'origin')
                  setOriginGid(stop.gid)
                }} key={i}>
                  {stop.name}
                </li>
              )}
            </ul>
          </div>
          <div className={styles.horizontalLine}>
            <hr />
          </div>
          <div className={styles.inputBlock}>
            <label htmlFor="destination" className={styles.inputTitle}>To</label>
            <input id="destination" type="text" placeholder='Stop or station' value={destination} onClick={() => setShowDestinationStopsList(true)} onChange={(e) => {
              setDestination(e.target.value)
              setShowDestinationStopsList(false)
              onChangeLoadStops(e.target.value, 'destination')
            }} />
            <ul tabIndex={-1} className={[styles.stopsList, !showDestinationStopsList ? styles.hideStopsList : ""].join(" ")}>
              {destinationStops && destinationStops.map((stop, i) =>
                <li onClick={(e) => {
                  setInputValueToStopName(e, 'destination')
                  setDestinationGid(stop.gid)
                }} key={i}>
                  {stop.name}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.gidSwitcherSlot}>
            <span className={styles.gidSwitcher} onClick={switchGids}>
              🔃
            </span>
          </div>
        </div>
        <div className={styles.submitField}>
          <button className={styles.submitButton} disabled={originGid == destinationGid || !originGid || !destinationGid} type="submit">Search journey</button>
        </div>
      </form>
      { origin !== "" && origin == destination && <p className={styles.errorField}><i>Origin and destination can't be the same.</i></p> }
      {isLoading && <p>Loading ...</p>}
    </div>
  )
}
