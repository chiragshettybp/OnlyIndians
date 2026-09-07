import usePageTitle from '../hooks/usePageTitle'
import RegisterForm from '../components/auth/RegisterForm'

export default function CreatorRegister() {
  usePageTitle('Create Creator Account')
  return <RegisterForm role="creator" />
}