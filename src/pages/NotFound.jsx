import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f9f9fe] flex flex-col items-center justify-center text-center gap-4 px-6">
      <Logo size={44} />
      <h1 className="text-large-title text-[#1a1c20]">404</h1>
      <p className="text-body text-[#434655]">This page wandered off the Stage.</p>
      <Link to="/">
        <Button size="md" iconName="home">Back to Home</Button>
      </Link>
    </div>
  )
}