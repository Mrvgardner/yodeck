import Card from '../Card.jsx'

export default function YouTubeCard({ data }) {
  // Mute & autoplay required for unattended kitchen display.
  const src = `https://www.youtube-nocookie.com/embed/${data.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${data.videoId}&modestbranding=1&playsinline=1&rel=0`
  return (
    <Card surface="glass" padding="p-0">
      <div className="relative w-full h-full overflow-hidden rounded-[28px]">
        <iframe
          src={src}
          title={data.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          frameBorder="0"
          className="absolute inset-0 h-full w-full"
        />
        {/* Top label bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-black/80 to-transparent">
          <span className="font-mono text-xl tracking-widest text-sc-amber">
            ▶ NOW PLAYING
          </span>
          <span className="font-mono text-xl text-sc-cream/80 tracking-wider truncate max-w-[60%]">
            {data.title}
          </span>
        </div>
        {/* Bottom branding bar */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 py-4 bg-gradient-to-t from-black/80 to-transparent">
          <span className="status-pip" aria-hidden />
          <span className="font-sc-bold text-xl text-sc-cream/80">SC kitchen feed</span>
        </div>
      </div>
    </Card>
  )
}
