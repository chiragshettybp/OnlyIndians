import usePageTitle from '../hooks/usePageTitle'
import PlaceholderPage from './PlaceholderPage'

export default function CrStudio() {
  usePageTitle('Creator Studio')
  return <PlaceholderPage name="CrStudio" />
}