'use client'
import styles from './JourneyRenderer.module.scss'
import { JourneyType, DestinationLink, TripLeg, ConnectionLink } from '@/redux/features/journeysSlice'

import JourneyFoldout from '../JourneyFoldout/JourneyFoldout'

type Data = {
  data: JourneyType
}

export default function JourneyRenderer(props: React.PropsWithChildren<Data>) {
  if (props.data.destinationLink) {
    console.log('destination Link found', props.data.destinationLink)
    return (
      <JourneyFoldout type='walk' data={props.data.destinationLink} />
    )
  }
  else if (props.data.tripLegs) {
    return (
      <JourneyFoldout type='journey' data={props.data} />
    )
  }
}
