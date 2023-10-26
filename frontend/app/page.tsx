'use client'
import styles from './page.module.scss'
import TrafficPlanner from '@/components/TrafficPlanner/TrafficPlanner'
import JourneyDisplay from '@/components/JourneyDisplay/JourneyDisplay'


export default function Home() {
  return (
    <main className={styles.main}>
      <TrafficPlanner/>
      <JourneyDisplay/>
    </main>
  )
}
