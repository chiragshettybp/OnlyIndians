import usePageTitle from '../hooks/usePageTitle'
import LoginForm from '../components/auth/LoginForm'

export default function CreatorLogin() {
  usePageTitle('Sign In · Creator')
  return <LoginForm role="creator" />
}