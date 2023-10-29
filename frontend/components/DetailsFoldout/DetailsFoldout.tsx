import styles from './DetailsFoldout.module.scss'
import { useState } from 'react'
import { CallOnTripLeg, ServiceJourney, TripLeg, Note } from "@/redux/features/journeysSlice"
import { calcTravelTime, escapeTimeStamp } from "@/utils/string-functions"

type DetailsFoldoutProps = {
  data: {
    serviceJourney: ServiceJourney,
    callsOnTripLeg: CallOnTripLeg[],
    notes: Note[]
  }
}

export default function DetailsFoldout(props: DetailsFoldoutProps) {
  let notes = props.data.notes
  let firstAndLastStops = []
  let stopsInBetween = props.data.callsOnTripLeg.slice(1, -1)
  const [displayStopsInBetween, setDisplayStopsInBetween] = useState(false)
  let serviceJourney = props.data.serviceJourney
  firstAndLastStops.push(props.data.callsOnTripLeg[0])
  firstAndLastStops.push(props.data.callsOnTripLeg[props.data.callsOnTripLeg.length - 1])
  let sortedNotes = notes.toSorted((a, b) => {
    const severities = ['high', 'normal', 'low']
    if (severities.indexOf(a.severity) < severities.indexOf(b.severity)) {return -1} 
    else if (severities.indexOf(a.severity) > severities.indexOf(b.severity)){ return 1} 
    else return 0 
  })



  return (
    <div className={styles.main}>
      {serviceJourney &&
        <p className={styles.lineIconDisplay}> <span className={styles.lineIcon} style={{ borderColor: serviceJourney.line.borderColor, backgroundColor: serviceJourney.line.backgroundColor, color: serviceJourney.line.foregroundColor }}> {serviceJourney.line.transportMode && serviceJourney.line.transportMode == 'train' ? serviceJourney.line.name + ' ' + serviceJourney.line.designation : serviceJourney.line.shortName}
        </span>
          <span className={styles.transportModeIcon}>
            {serviceJourney.line.transportMode === 'train' && '🚂'}
            {serviceJourney.line.transportMode === 'bus' && '🚌'}
            {serviceJourney.line.transportMode === 'tram' && '🚋'}
          </span>
          <b className={styles.lineDirection}>Towards {serviceJourney.direction}</b>
          <span className={styles.wheelchairIndicator}>{serviceJourney.line.isWheelchairAccessible ? '♿' : ''}</span>
        </p>}

      {sortedNotes &&
        <ul className={styles.notesDisplay}>
          {sortedNotes.map((note, i) =>
            <li key={note.severity + i} className={styles.note} style={{
              backgroundColor:
                note.severity === 'high' || note.severity == 'normal' ? '#fff8c8'
                  : '#f0f9fc'
            }}>
              <span className={styles.noteIcon}>
                {note.severity === 'normal' ? '⚠️' : ''}
                {note.severity === 'low' ? 'ℹ️' : ''}
                {note.severity === 'high' ? '❗' : ''}
              </span>
              <span>{note.text}</span>
            </li>
          )}
        </ul>
      }
      <div className={styles.detailsItem}>
        <div className={styles.timeDisplay}>
          <b className={firstAndLastStops[0].isCancelled ? styles.cancelledTimeStamp : ""} style={firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime && firstAndLastStops[0].plannedDepartureTime !== firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime ? { background: '#fff8c8' } : {}}>{escapeTimeStamp(firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime ? firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime : firstAndLastStops[0].plannedDepartureTime)}</b>
          {
            firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime && firstAndLastStops[0].plannedDepartureTime !== firstAndLastStops[0].estimatedOtherwisePlannedDepartureTime ?
              <span className={[styles.obsoleteTimeStamp, firstAndLastStops[0].isCancelled ? styles.cancelledTimeStamp : ""].join(" ")}>
                {escapeTimeStamp(firstAndLastStops[0].plannedDepartureTime)}
              </span> : ""
          }
        </div>
        <div>
          {firstAndLastStops[0].isCancelled ? <span className={styles.cancelledIndicator}>Cancelled&nbsp;</span> : ""}{firstAndLastStops[0].stopPoint.name}
        </div>
      </div>
      <div className={styles.stopsInBetweenDisplay} onClick={() => setDisplayStopsInBetween(!displayStopsInBetween)} >
        {stopsInBetween.length > 0 &&
          <span>
            {
              calcTravelTime(firstAndLastStops[0].estimatedDepartureTime ? firstAndLastStops[0].estimatedDepartureTime : firstAndLastStops[0].plannedDepartureTime, firstAndLastStops[1].estimatedDepartureTime ? firstAndLastStops[1].estimatedDepartureTime : firstAndLastStops[1].plannedDepartureTime)
            } - {stopsInBetween.length} stops {displayStopsInBetween ? '▲' : '▼'}
          </span>
        }
        {stopsInBetween.length === 0 &&
          <span>
            Travel time {
              calcTravelTime(firstAndLastStops[0].estimatedDepartureTime ? firstAndLastStops[0].estimatedDepartureTime : firstAndLastStops[0].plannedDepartureTime, firstAndLastStops[1].estimatedDepartureTime ? firstAndLastStops[1].estimatedDepartureTime : firstAndLastStops[1].plannedDepartureTime)
            }
          </span>
        }
        <ul className={styles.stopsInBetween}>
          {displayStopsInBetween && stopsInBetween.map((step, _i) =>
            <li className={styles.detailsItem} key={step.index}>
              <div className={styles.timeDisplay}>
                <b style={step.estimatedDepartureTime && step.estimatedDepartureTime !== step.plannedDepartureTime ? { background: '#fff8c8' } : {}}>
                  {
                    step.estimatedDepartureTime && step.estimatedDepartureTime !== step.plannedDepartureTime ? escapeTimeStamp(step.estimatedDepartureTime) : <span>{escapeTimeStamp(step.plannedDepartureTime)}</span>
                  }
                </b>
                {
                  step.estimatedDepartureTime && step.estimatedDepartureTime !== step.plannedDepartureTime ?
                    <span className={styles.obsoleteTimeStamp}>
                      {escapeTimeStamp(step.plannedDepartureTime)}
                    </span> : ""
                }

              </div>
              <div>{step.isCancelled ? <span className={styles.cancelledIndicator}>Cancelled&nbsp;</span> : ""}{step.stopPoint.name}</div>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.detailsItem} >
        <div className={styles.timeDisplay}>
          <b className={firstAndLastStops[1].isCancelled ? styles.cancelledTimeStamp : ""} style={firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime && firstAndLastStops[1].plannedArrivalTime !== firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime ? { background: '#fff8c8' } : {}}>{escapeTimeStamp(firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime ? firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime : firstAndLastStops[1].plannedArrivalTime)}</b>
          {
            firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime && firstAndLastStops[1].plannedArrivalTime !== firstAndLastStops[1].estimatedOtherwisePlannedArrivalTime ?
              <span className={[styles.obsoleteTimeStamp, firstAndLastStops[1].isCancelled ? styles.cancelledTimeStamp : ""].join(" ")}>
                {escapeTimeStamp(firstAndLastStops[1].plannedArrivalTime)}
              </span> : ""
          }
        </div>
        <div>
          {firstAndLastStops[1].isCancelled ? <span className={styles.cancelledIndicator}>Cancelled&nbsp;</span> : ""}{firstAndLastStops[1].stopPoint.name}
        </div>
      </div>
    </div>
  )
}
