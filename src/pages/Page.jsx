import { Component, Suspense } from 'react'
import { pages } from '../router/registry'
import PlaceholderPage from './PlaceholderPage'
import Spinner from '../components/ui/Spinner'

class Boundary extends Component {
  state = { broke: false }
  static getDerivedStateFromError() {
    return { broke: true }
  }
  render() {
    return this.state.broke ? <PlaceholderPage name={this.props.name} /> : this.props.children
  }
}

// Lazy-loads a page from the registry; falls back to a placeholder shell for screens not built yet.
export default function Page({ name }) {
  const Comp = pages[name]
  if (!Comp) return <PlaceholderPage name={name} />
  return (
    <Boundary name={name}>
      <Suspense fallback={<Spinner label="Loading screen…" />}>
        <Comp />
      </Suspense>
    </Boundary>
  )
}