import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Volume2, VolumeX } from 'lucide-react'

import { featuredAgents } from '../data/agents'
import { DUMMY_REELS } from '../data/reels'

const LOOP_COPIES = 3
const TOP_CREATORS = featuredAgents.slice(0, 5)

function ReelSlide({ reel, active, muted, onToggleMute }) {
  const videoRef = useRef(null)
  const [infoRequested, setInfoRequested] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = true
    video.playsInline = true

    if (!active) {
      video.pause()
      return undefined
    }

    const play = () => {
      const result = video.play()
      if (result?.catch) result.catch(() => {})
    }

    if (video.readyState >= 3) {
      play()
      return undefined
    }

    video.addEventListener('canplay', play, { once: true })
    video.addEventListener('loadeddata', play, { once: true })
    if (video.networkState === HTMLMediaElement.NETWORK_IDLE) video.load()

    return () => {
      video.removeEventListener('canplay', play)
      video.removeEventListener('loadeddata', play)
    }
  }, [active])

  return (
    <article className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={reel.video}
        poster={reel.poster}
        muted
        playsInline
        loop
        preload={active ? 'auto' : 'metadata'}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4 pb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <img
              src={reel.creator.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-white">{reel.creator.name}</p>
              <p className="truncate text-[11px] font-semibold text-white/75">@{reel.creator.username}</p>
            </div>
          </div>

          {infoRequested ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={3} />
              Soon Agent will contact you
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setInfoRequested(true)}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-white"
            >
              Get more info on this
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </article>
  )
}

export default function Reels() {
  const navigate = useNavigate()
  const scrollerRef = useRef(null)
  const audioRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const jumpingRef = useRef(false)

  const feed = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copy) =>
        DUMMY_REELS.map((reel) => ({
          ...reel,
          key: `${reel.id}-${copy}`,
        })),
      ).flat(),
    [],
  )

  const activeReel = feed[activeIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeReel?.audio) return

    const nextSrc = activeReel.audio
    if (audio.getAttribute('data-src') !== nextSrc) {
      audio.src = nextSrc
      audio.setAttribute('data-src', nextSrc)
      audio.loop = true
      audio.load()
    }

    audio.volume = 0.7
    if (muted) {
      audio.pause()
      return
    }

    const playPromise = audio.play()
    if (playPromise?.catch) playPromise.catch(() => {})
  }, [activeReel, muted])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const blockSize = DUMMY_REELS.length
    const startIndex = blockSize // start in middle copy (copy index 1)

    const setStart = () => {
      const slide = scroller.children[startIndex]
      if (!(slide instanceof HTMLElement)) return
      jumpingRef.current = true
      scroller.scrollTop = slide.offsetTop
      setActiveIndex(startIndex)
      requestAnimationFrame(() => {
        jumpingRef.current = false
      })
    }

    setStart()
    // layout may settle after fonts/images
    const t = window.setTimeout(setStart, 50)

    const observer = new IntersectionObserver(
      (entries) => {
        if (jumpingRef.current) return
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible?.target) return
        const index = Number(visible.target.dataset.reelIndex)
        if (!Number.isNaN(index)) setActiveIndex(index)
      },
      { root: scroller, threshold: [0.6, 0.75] },
    )

    ;[...scroller.children].forEach((child) => observer.observe(child))

    function keepLooping() {
      if (jumpingRef.current) return
      const slideHeight = scroller.clientHeight
      if (!slideHeight) return

      const blockHeight = blockSize * slideHeight
      if (scroller.scrollTop < blockHeight * 0.5) {
        jumpingRef.current = true
        scroller.scrollTop += blockHeight
        requestAnimationFrame(() => {
          jumpingRef.current = false
        })
      } else if (scroller.scrollTop > blockHeight * 1.5) {
        jumpingRef.current = true
        scroller.scrollTop -= blockHeight
        requestAnimationFrame(() => {
          jumpingRef.current = false
        })
      }
    }

    scroller.addEventListener('scroll', keepLooping, { passive: true })
    return () => {
      window.clearTimeout(t)
      observer.disconnect()
      scroller.removeEventListener('scroll', keepLooping)
    }
  }, [])

  function goBack() {
    audioRef.current?.pause()
    if (window.history.length > 1) navigate(-1)
    else navigate('/', { replace: true })
  }

  return (
    <section className="fixed inset-0 z-[80] flex flex-col bg-white">
      <audio ref={audioRef} preload="auto" />

      <div className="flex shrink-0 items-center gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-sm font-bold text-slate-500">Reels</p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1 sm:px-6 lg:px-8">
        <aside className="relative z-10 mb-5 w-full max-w-sm lg:absolute lg:top-1 lg:left-4 lg:mb-0 lg:w-60 xl:left-8 xl:w-64">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Creators</p>
          <h2 className="mt-1.5 font-display text-xl font-extrabold text-slate-900">Top Creators</h2>
          <p className="mt-1 text-xs text-slate-500">Agencies leading Makaan Reels this week.</p>

          <ul className="mt-4 space-y-3">
            {TOP_CREATORS.map((creator, index) => (
              <li key={creator.id}>
                <Link
                  to={`/agents/${creator.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition hover:border-brand/25 hover:bg-brand-soft/40"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-soft text-[11px] font-extrabold text-brand">
                    {index + 1}
                  </span>
                  <img
                    src={creator.avatar}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-brand/15"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">{creator.agency}</p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">{creator.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{creator.city}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-h-[min(820px,calc(100dvh-7.5rem))] items-center justify-center">
          <div className="aspect-[9/16] h-[min(820px,calc(100dvh-7.5rem))] w-auto max-w-[min(100%,420px)] overflow-hidden rounded-2xl bg-black shadow-[0_18px_50px_rgb(15_23_42/0.18)] ring-1 ring-slate-200/80">
            <div
              ref={scrollerRef}
              className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {feed.map((reel, index) => (
                <div key={reel.key} data-reel-index={index} className="h-full">
                  <ReelSlide
                    reel={reel}
                    active={activeIndex === index}
                    muted={muted}
                    onToggleMute={() => setMuted((v) => !v)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
