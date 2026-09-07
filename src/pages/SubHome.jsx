import usePageTitle from '../hooks/usePageTitle'
import PlaceholderPage from './PlaceholderPage'

export default function SubHome() {
  usePageTitle('Home · Subscriber')
  return <PlaceholderPage name="SubHome" />
}