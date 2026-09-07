import usePageTitle from '../hooks/usePageTitle'
import LoginForm from '../components/auth/LoginForm'

export default function SubscriberLogin() {
  usePageTitle('Sign In · Subscriber')
  return <LoginForm role="subscriber" />
}