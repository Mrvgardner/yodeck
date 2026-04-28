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

export default function HolidayCard({ data }) {
  return (
    <Card surface="cream">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-orange">
            ☼ HOLIDAY
          </span>
          <span className="font-mono text-xl tracking-widest text-sc-navy/60">
            {daysUntil(data.date)}
          </span>
        </div>

        <div>
          <div className="font-display text-7xl leading-[0.9] text-sc-navy">
            {data.name.toUpperCase()}
          </div>
          <div className="font-mono text-2xl text-sc-navy/70 mt-4">
            {formatDate(data.date)}
          </div>
        </div>

        <div className="font-body text-3xl text-sc-navy/80 border-t border-sc-navy/15 pt-6">
          {data.blurb}
        </div>
      </div>
    </Card>
  )
}
