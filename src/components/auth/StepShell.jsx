export default function StepShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex flex-col gap-6 w-full py-2">
      <div>
        <h1 className="text-title-1 font-bold text-[#1a1c20]">{title}</h1>
        {subtitle ? <p className="text-footnote text-[#434655] mt-1 leading-relaxed">{subtitle}</p> : null}
      </div>
      {children}
      {footer}
    </div>
  )
}