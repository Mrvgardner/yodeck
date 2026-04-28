import { useEffect, useRef, useState } from 'react'
import Card from '../Card.jsx'

// Hide the brief YouTube play/pause flash by overlaying the video's thumbnail
// poster until the player reports "playing". We use the YouTube IFrame API
// (loaded once, lazily) and listen for state-change events via postMessage.
//
// While the poster is up, the iframe is still mounted and autoplay is firing
// underneath — the moment we hear "playing", we fade the poster out.

const PLAYING = 1
const STATE_FADE_MS = 600

let ytApiPromise = null
function ensureYouTubeApi() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT && window.YT.Player) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise
  ytApiPromise = new Promise(resolve => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => resolve()
  })
  return ytApiPromise
}

export default function YouTubeCard({ data }) {
  const containerRef = useRef(null)
  const playerRef    = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ensureYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return
      // Create the player attached to a child div the API will replace.
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: data.videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay:       1,
          mute:           1,
          controls:       0,
          loop:           1,
          playlist:       data.videoId,
          modestbranding: 1,
          playsinline:    1,
          rel:            0,
          disablekb:      1,
          iv_load_policy: 3,
        },
        events: {
          onStateChange: (e) => {
            if (e.data === PLAYING) setReady(true)
          },
        },
      })
    })
    return () => {
      cancelled = true
      try { playerRef.current?.destroy?.() } catch {}
    }
  }, [data.videoId])

  // Safety net — even if onStateChange never fires (network hiccup), drop the
  // poster after a few seconds so the video isn't permanently obscured.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(id)
  }, [data.videoId])

  return (
    <Card surface="glass" padding="p-0">
      <div className="relative w-full h-full overflow-hidden rounded-[28px] bg-black">
        {/* Player container — IFrame API replaces this div with the iframe */}
        <div className="absolute inset-0">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Poster overlay — covers the brief play/pause flash. Fades out the
            instant the player reports it's playing. */}
        <div
          className="absolute inset-0 transition-opacity ease-out"
          style={{
            opacity: ready ? 0 : 1,
            transitionDuration: `${STATE_FADE_MS}ms`,
            backgroundImage: `url(https://i.ytimg.com/vi/${data.videoId}/maxresdefault.jpg), url(https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: ready ? 'none' : 'auto',
          }}
        >
          {/* Subtle dark gradient so any overlay text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/65" />
        </div>

        {/* Top label bar — always visible */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-black/80 to-transparent z-10">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ▶ NOW PLAYING
          </span>
          <span className="font-mono text-xl text-sc-cream/85 tracking-wider truncate max-w-[60%]">
            {data.title}
          </span>
        </div>

        {/* Bottom branding bar */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 py-4 bg-gradient-to-t from-black/80 to-transparent z-10">
          <span className="status-pip" aria-hidden />
          <span className="font-sc-bold text-xl text-sc-cream/85">SC kitchen feed</span>
        </div>
      </div>
    </Card>
  )
}
