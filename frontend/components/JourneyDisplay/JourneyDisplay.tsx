'use client'
import styles from './JourneyDisplay.module.scss'
import JourneyRenderer from '../JourneyRenderer/JourneyRenderer'

import { AppDispatch, useAppSelector } from '@/redux/store'
import { JourneyType } from '@/redux/features/journeysSlice'

export default function JourneyDisplay() {
  const journeys = useAppSelector((state) => state.journeysReducer.value.journeys)
  return (
    <div className={styles.main}>
      <div className={styles.journeyList}>
        {journeys && journeys.map((journey: JourneyType, i) => 
            <JourneyRenderer key={i} data={journey} />
        )}
      </div>
    </div>
  )
}
