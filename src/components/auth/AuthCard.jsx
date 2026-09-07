import Logo from '../Logo'

export default function AuthCard({ title, subtitle, children, footer, logo = false }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {logo ? <div className="mx-auto"><Logo size={48} /></div> : null}
      <div>
        <h1 className="text-title-1 font-bold text-[#1a1c20]">{title}</h1>
        {subtitle ? <p className="text-footnote text-[#434655] mt-1.5 leading-relaxed">{subtitle}</p> : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
      {footer ? <div className="text-caption-1 text-[#737686]">{footer}</div> : null}
    </div>
  )
}