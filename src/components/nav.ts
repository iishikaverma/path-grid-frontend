import type { ComponentType, SVGProps } from 'react'
import {
  AboutIcon,
  HomeIcon,
  LocationsIcon,
  NearbyIcon,
  RouteIcon,
  VisualizerIcon,
} from './icons'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/find-route', label: 'Find Route', icon: RouteIcon },
  { to: '/visualizer', label: 'Visualizer', icon: VisualizerIcon },
  { to: '/nearby', label: 'Nearby Places', icon: NearbyIcon },
  { to: '/locations', label: 'All Locations', icon: LocationsIcon },
  { to: '/about', label: 'About', icon: AboutIcon },
]
