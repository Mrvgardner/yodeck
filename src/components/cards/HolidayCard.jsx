import Card from '../Card.jsx'

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}

function daysUntil(iso) {
  const target = new Date(iso + 'T00:00:00')
  const today  = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'TODAY'
  if (diff === 1) return 'TOMORROW'
  return `IN ${diff} DAYS`
}

function nameSize(name) {
  const len = name?.length || 0
  if (len <= 14)  return 'text-6xl leading-[0.9]'
  if (len <= 22)  return 'text-5xl leading-[0.95]'
  if (len <= 32)  return 'text-4xl leading-[1.0]'
  return 'text-3xl leading-[1.05]'
}

export default function HolidayCard({ data }) {
  const nCls = nameSize(data.name)
  return (
    <Card surface="cream">
      <div className="flex flex-col h-full gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-orange">
            ☼ HOLIDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-sc-navy/60">
            {daysUntil(data.date)}
          </span>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <div className={`font-display break-words text-sc-navy ${nCls}`}>
            {data.name.toUpperCase()}
          </div>
          <div className="font-mono text-xl text-sc-navy/70 mt-3">
            {formatDate(data.date)}
          </div>
        </main>

        <footer className="flex-shrink-0 font-body text-2xl text-sc-navy/80 border-t border-sc-navy/15 pt-4">
          {data.blurb}
        </footer>
      </div>
    </Card>
  )
}
