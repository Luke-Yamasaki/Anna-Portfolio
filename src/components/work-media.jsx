'use client'

import MuxPlayer from '@mux/mux-player-react'

export function WorkMedia({work, preview = false, autoPlay = preview}) {
  if (work.type !== 'video') {
    return <img src={work.src} alt={work.label} />
  }

  if (!work.playbackId) return null

  return (
    <MuxPlayer
      playbackId={work.playbackId}
      poster={work.poster || undefined}
      muted={preview}
      loop={preview}
      autoPlay={Boolean(autoPlay)}
      paused={!autoPlay}
      playsInline
      nohotkeys={preview}
      metadata={work.label ? {video_title: work.label} : undefined}
      accentColor="#6f6a62"
      style={{
        '--controls': preview ? 'none' : undefined,
        '--media-object-fit': preview ? 'cover' : 'contain',
      }}
      aria-hidden={preview || undefined}
      aria-label={preview ? undefined : work.label}
    />
  )
}
