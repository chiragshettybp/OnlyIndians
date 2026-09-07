export default function AuthAlert({ error, children }) {
  if (!error && !children) return null
  return (
    <div role="alert" className="bg-[#ffedec] border border-[#f6c1bd] text-[#ba1a1a] text-footnote font-medium rounded-xl px-4 py-3">
      {error ? <span>{error}</span> : children}
    </div>
  )
}