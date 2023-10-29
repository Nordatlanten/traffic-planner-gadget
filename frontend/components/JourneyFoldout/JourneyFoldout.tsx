'use client'
import styles from './JourneyFoldout.module.scss'
import axios from 'axios'
import { calcTravelTime, escapeTimeStamp } from '@/utils/string-functions'
import DetailsFoldout from '../DetailsFoldout/DetailsFoldout'
import ExchangeTimeDisplay from '../ExchangeTimeDisplay/ExchangeTimeDisplay'
import { useState, useEffect } from 'react'
import { DestinationLink, TripLeg, ConnectionLink, JourneyType } from '@/redux/features/journeysSlice'

type Data = {
  type: string,
  data: DestinationLink | JourneyType
}

export default function JourneyFoldout(props: React.PropsWithChildren<Data>) {
  const [showFoldout, setShowFoldout] = useState(false)
  const [journeyDetails, setJourneyDetails] = useState<JourneyType>()
  const [sortedJourney, setSortedJourney] = useState<Array<TripLeg | ConnectionLink>>([])

  let uuid = self.crypto.randomUUID()

  const getDetailedJourney = (ref: string, connectionLinks: ConnectionLink[] | undefined) => {
    if (showFoldout && journeyDetails) {
      setShowFoldout(false)
    } else if (!showFoldout && journeyDetails) {
      setShowFoldout(true)
    } else {
      //I may want to re-fetch data if a certain amount of time has passed since the first fetch.
      //In any case if data has already been fetched once, this function should never reach this point.
      axios.post('http://localhost:3000/vasttrafik/journey/detailed', {
        detailsReference: ref
      })
        .then((response) => {
          setJourneyDetails(response.data)
          //Appending tripLegs, connectionLinks and serviceJourney for data that can be presented in a list.
          concatenateAndSortByLegIndex(response.data.tripLegs, connectionLinks)
          setShowFoldout(!showFoldout)
        })
        .catch((error) => console.error(error))
    }
  }

  const concatenateAndSortByLegIndex = (tlegs: TripLeg[], clinks: ConnectionLink[] | undefined) => {
    let list: Array<TripLeg | ConnectionLink> = tlegs
    if (Array.isArray(list) && Array.isArray(clinks)) {
      let concatenatedList = list.concat(clinks)
      concatenatedList.sort((a, b) => {
        if (a.journeyLegIndex < b.journeyLegIndex) {
          return -1;
        } else if (a.journeyLegIndex > b.journeyLegIndex) {
          return 1;
        }
        return 0;
      })
      //Sorted list now ready to be displayed in foldout container
      setSortedJourney(concatenatedList)
    }
  }


  switch (props.type) {
    case 'walk':
      let walkData = props.data as DestinationLink
      return (
        <div className={[styles.main, styles.mainWalk].join(" ")}>
          <div className={styles.leftSection}>
            <span><b className={styles.journeyOrigin}>{walkData.origin.name}</b></span>
            <div><span>🚶&nbsp;</span>Walk&nbsp;
              <span>{walkData.estimatedNumberOfSteps} steps</span>, <span>{walkData.distanceInMeters} meters</span>
            </div>
          </div>
          <div className={styles.rightSection}>
          <div className={styles.walkTimeDisplay}>
              <div className={styles.walkTimeData}>
                <b>{escapeTimeStamp(walkData.plannedDepartureTime)}</b> - {escapeTimeStamp(walkData.plannedArrivalTime)}
              </div>
              <div>Travel time {walkData.plannedDurationInMinutes} min
              </div>
            </div>
          </div>
        </div>
      )
    case 'journey':
      let journeyData: JourneyType = props.data as JourneyType
      let tripLegs = journeyData.tripLegs
  
      let increment = 0;
      let hasDisruption: boolean = false
      let isPartCancelled: boolean = false
      let infoExists: boolean = false
      let isFullyWheelchairAccessible: boolean = true
      let riskOfMissingConnection: boolean = false

      if (tripLegs?.find(a => a.notes.find(b => b.type == 'disruption-message'))) hasDisruption = true;
      if (tripLegs?.find(a => a.isPartCancelled)) isPartCancelled = true;
      if (tripLegs?.find(a => a.notes.find(b => b.severity === 'low'))) infoExists = true;
      if (tripLegs?.find((a => a.serviceJourney.line.isWheelchairAccessible == false))) isFullyWheelchairAccessible = false;
      if (tripLegs?.find((a => a.isRiskOfMissingConnection))) riskOfMissingConnection = true
      
      let indicatorExists: boolean = false
      if (hasDisruption || infoExists || isPartCancelled) indicatorExists = true;

      return (
        <div className={styles.main}>
          <div className={styles.journeySummary} onClick={() => getDetailedJourney(journeyData.detailsReference, journeyData.connectionLinks)}>
            {tripLegs && <>
              <div className={styles.leftSection}>
                <div className={styles.foldoutTitle}>
                  <b className={styles.journeyOrigin}>{tripLegs[0].origin.stopPoint.stopArea.name}</b>
                  {isFullyWheelchairAccessible && <span className={styles.wheelchairIcon}>♿</span>}
                </div>
                <ul className={styles.lineIconDisplay}>
                {indicatorExists &&
                  <li className={styles.journeyInfoIndicatorDisplay}>
                    {isPartCancelled && <span className={styles.noteIcon}>❗</span>}
                    {hasDisruption && <span className={styles.noteIcon}>⚠️</span>}
                    {infoExists && <span className={styles.noteIcon}>ℹ️</span>}
                  </li>
                }
                  {tripLegs.map((item, i) => {
                    return (
                      <li key={item.serviceJourney.line.shortName + i} className={styles.lineIcon} style={{ borderColor: item.serviceJourney.line.borderColor, backgroundColor: item.serviceJourney.line.backgroundColor, color: item.serviceJourney.line.foregroundColor }}>
                        {item.serviceJourney.line.transportMode &&  item.serviceJourney.line.transportMode == 'train' ? item.serviceJourney.line.name + ' ' + item.serviceJourney.line.designation : item.serviceJourney.line.shortName}
                      </li>
                    )
                  }
                  )}
                </ul>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.rightSectionLeftColumn}>
                <div className={styles.timeStampDisplays}>
                  <div className={styles.departureTimeStampDisplay}>
                    <b style={tripLegs[0].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[0].estimatedOtherwisePlannedDepartureTime !== tripLegs[0].plannedDepartureTime && tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedDepartureTime ? { background: '#fff8c8' } : {}}>
                      {
                        tripLegs[0].estimatedOtherwisePlannedDepartureTime && tripLegs[0].estimatedOtherwisePlannedDepartureTime ?
                          escapeTimeStamp(tripLegs[0].estimatedOtherwisePlannedDepartureTime) :
                          escapeTimeStamp(tripLegs[0].plannedDepartureTime)
                      }
                    </b>
                    {tripLegs[0].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[0].estimatedOtherwisePlannedDepartureTime !== tripLegs[0].plannedDepartureTime &&
                      <span className={styles.obsoleteTimeStampDeparture}>
                        {escapeTimeStamp(tripLegs[0].plannedDepartureTime)}
                        { }
                      </span>
                    }
                  
                  </div>
                  <div className={styles.hyphenDisplay}>
                    <span>&nbsp;-&nbsp;</span>
                    {/* This looks terrible but it's just to make sure the hyphen doesn't display when it shouldn't */}
                    {tripLegs[0].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[0].estimatedOtherwisePlannedDepartureTime !== tripLegs[0].plannedDepartureTime && tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime !== tripLegs[tripLegs.length - 1].plannedArrivalTime ?
                      <span>&nbsp;-&nbsp;</span> : <span></span>
                    }
                  </div>
                  <div className={styles.arrivalTimeStampDisplay}>
                  <b style={tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime !== tripLegs[tripLegs.length - 1].plannedArrivalTime ? { background: '#fff8c8' } : {}}>
                      {tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime ?
                        escapeTimeStamp(tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime) :
                        escapeTimeStamp(tripLegs[tripLegs.length - 1].plannedArrivalTime)
                      }
                    </b>
                    {tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedDepartureTime &&
                      tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime !== tripLegs[tripLegs.length - 1].plannedArrivalTime ?
                      <span className={styles.obsoleteTimeStampArrival}>
                        {escapeTimeStamp(tripLegs[tripLegs.length - 1].plannedArrivalTime)}
                      </span> : <span></span>
                    }
                  </div>
                </div>
                <p>Travel time {calcTravelTime(tripLegs[0].estimatedOtherwisePlannedDepartureTime ? tripLegs[0].estimatedOtherwisePlannedDepartureTime : tripLegs[0].plannedDepartureTime, tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime ? tripLegs[tripLegs.length - 1].estimatedOtherwisePlannedArrivalTime : tripLegs[tripLegs.length - 1].plannedArrivalTime)}</p>
                </div>
                <div className={styles.rightSectionRightColumn}>
                <p>{showFoldout ? '➖' : '➕' }</p>
                </div>
              </div>
            
            </>}
            
          </div>

          <div className={[styles.foldout, showFoldout ? styles.showFoldout : ""].join(" ")}>
            <ul className={styles.journeyListDisplay}>
              {sortedJourney && sortedJourney.map((a: TripLeg | ConnectionLink, i) =>
                <li key={uuid + i}>
                  {'transportMode' in a &&                    
                    <div className={styles.walkDirectionsDisplay}>
                      <span> 🚶 Walk {calcTravelTime(a.origin.estimatedTime ? a.origin.estimatedTime : a.origin.plannedTime, a.destination.estimatedTime ? a.destination.estimatedTime : a.destination.plannedTime)} &gt; {a.destination.stopPoint.stopArea.name} <span className={styles.trackDisplay}>Track {a.destination.stopPoint.platform}</span></span>
                    </div>                  
                  }
                  {'serviceJourneys' in a && a.callsOnTripLeg && a.serviceJourneys && tripLegs && tripLegs[increment] &&

                    <>
                      <ExchangeTimeDisplay data={tripLegs[increment].estimatedConnectingTimeInMinutes ? { connectingTime: tripLegs[increment].estimatedConnectingTimeInMinutes, riskOfMissingConnection: riskOfMissingConnection } : { connectingTime: tripLegs[increment].plannedConnectingTimeInMinutes, riskOfMissingConnection: riskOfMissingConnection }} />     
                      <DetailsFoldout data={{ callsOnTripLeg: a.callsOnTripLeg, serviceJourney: tripLegs[increment].serviceJourney, notes: tripLegs[increment].notes}} />
                      {(() => {
                        //only increment if item is tripLeg
                        increment++
                      })()}
                    </>
                  }
                </li>
              )}
            </ul>
          </div>
        </div>
      )
  }
}
