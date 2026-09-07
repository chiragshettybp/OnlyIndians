import usePageTitle from '../hooks/usePageTitle'
import RegisterForm from '../components/auth/RegisterForm'

export default function SubscriberRegister() {
  usePageTitle('Create Subscriber Account')
  return <RegisterForm role="subscriber" />
}