import Card from '../Card.jsx'

export default function WeatherCard({ data }) {
  if (!data) return null
  const funny = data.funnyCondition
  const conditionText = funny || data.condition
  return (
    <Card surface="glass">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ◐ WEATHER
          </span>
          <span className="font-mono text-xl text-sc-cream/60 tracking-wider">
            {data.location?.toUpperCase?.() || data.location}
          </span>
        </div>

        <div className="flex items-end gap-4">
          <div className="font-display text-[16rem] leading-[0.8] text-sc-cream">
            {data.tempF}
          </div>
          <div className="font-display text-7xl text-sc-orange pb-6">°F</div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-sc-cream/10 pt-5">
          <div>
            <div className="font-mono text-base text-sc-cream/50 tracking-widest">CONDITION</div>
            <div className={`font-display text-3xl mt-1 leading-tight ${funny ? 'text-sc-amber italic' : 'text-sc-cream'}`}>
              {conditionText}
            </div>
          </div>
          <div>
            <div className="font-mono text-base text-sc-cream/50 tracking-widest">HI / LO</div>
            <div className="font-display text-3xl text-sc-cream mt-1">
              {data.highF}° / {data.lowF}°
            </div>
          </div>
          <div>
            <div className="font-mono text-base text-sc-cream/50 tracking-widest">WIND</div>
            <div className="font-display text-3xl text-sc-cream mt-1">
              {data.windMph} <span className="text-xl text-sc-cream/60">mph</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
