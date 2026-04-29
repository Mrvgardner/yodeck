import { useEffect, useState } from 'react'
import { pickFunny } from '../data/funnyWeather.js'

// Open-Meteo — no API key required. Default = Irving, TX 75039 (Las Colinas).
// Override with VITE_WEATHER_LAT / VITE_WEATHER_LON / VITE_WEATHER_LABEL.
const LAT   = import.meta.env.VITE_WEATHER_LAT   || '32.8730'
const LON   = import.meta.env.VITE_WEATHER_LON   || '-96.9469'
const LABEL = import.meta.env.VITE_WEATHER_LABEL || 'Irving, TX'

const CODE_MAP = {
  0:  'Clear',           1: 'Mostly clear',     2: 'Partly cloudy',  3: 'Overcast',
  45: 'Fog',            48: 'Rime fog',
  51: 'Drizzle',        53: 'Drizzle',         55: 'Drizzle',
  61: 'Light rain',     63: 'Rain',            65: 'Heavy rain',
  71: 'Light snow',     73: 'Snow',            75: 'Heavy snow',
  80: 'Showers',        81: 'Showers',         82: 'Heavy showers',
  95: 'Thunderstorm',   96: 'Storms + hail',   99: 'Storms + hail',
}

export function useWeather(refreshMs = 15 * 60 * 1000) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=2`
      try {
        const res  = await fetch(url)
        const json = await res.json()
        if (cancelled) return
        const cur  = json.current
        const day  = json.daily
        const tempF = Math.round(cur.temperature_2m)

        // Build the next 6 hourly slots starting from the current hour + 1.
        // Open-Meteo returns parallel arrays of times + temps + codes.
        const hourly = []
        const times = json.hourly?.time || []
        const temps = json.hourly?.temperature_2m || []
        const codes = json.hourly?.weather_code   || []
        const nowIdx = times.findIndex(t => new Date(t).getTime() > Date.now())
        if (nowIdx > -1) {
          for (let i = 0; i < 6 && nowIdx + i < times.length; i++) {
            const idx = nowIdx + i
            hourly.push({
              time:      times[idx],            // ISO local
              tempF:     Math.round(temps[idx]),
              code:      codes[idx],
              condition: CODE_MAP[codes[idx]] || '—',
            })
          }
        }

        setWeather({
          location:       LABEL,
          tempF,
          condition:      CODE_MAP[cur.weather_code] || '—',
          // Pick funny once per refresh (~15 min) so header + card stay in sync.
          funnyCondition: pickFunny(tempF, `${tempF}|${Date.now()}`),
          windMph:        Math.round(cur.wind_speed_10m),
          highF:          Math.round(day.temperature_2m_max?.[0] ?? tempF),
          lowF:           Math.round(day.temperature_2m_min?.[0] ?? tempF),
          hourly,
        })
      } catch {
        if (!cancelled) setWeather({
          location: LABEL, tempF: '—', condition: 'Offline',
          windMph: 0, highF: '—', lowF: '—', hourly: [],
        })
      }
    }
    load()
    const id = setInterval(load, refreshMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [refreshMs])

  return weather
}
