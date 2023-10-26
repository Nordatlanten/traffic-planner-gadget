import styles from './ExchangeTimeDisplay.module.scss'
import { TripLeg } from "@/redux/features/journeysSlice"
import { calcTravelTime, escapeTimeStamp } from "@/utils/string-functions"

type ExchangeTimeDisplayProps = {
  data: {
    connectingTime: number | undefined,
    riskOfMissingConnection: boolean
  }
}

export default function ExchangeTimeDisplay(props: ExchangeTimeDisplayProps) {
  let timeToString
  if (props.data.connectingTime) timeToString = props.data.connectingTime.toString()
  if(timeToString) {
  return (
    <div className={styles.main}>
      <span>
        🔄 {props.data.riskOfMissingConnection ? '⚠️' : ''} Time between stops ({timeToString} min)
      </span>
    </div>
  )
  } 
}
