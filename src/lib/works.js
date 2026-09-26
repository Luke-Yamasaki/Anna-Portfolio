export function packWorksForMobile(items) {
  const packed = []
  const pendingImages = []

  const flushImages = () => {
    packed.push(...pendingImages)
    pendingImages.length = 0
  }

  items.forEach((item) => {
    if (item.type === 'image') {
      pendingImages.push(item)
      return
    }

    if (pendingImages.length % 2 === 1) {
      const orphan = pendingImages.pop()
      flushImages()
      packed.push(item)
      pendingImages.push(orphan)
      return
    }

    flushImages()
    packed.push(item)
  })

  flushImages()
  return packed
}

export function decorateWorksForGrid(works) {
  const mobileOrderByIndex = new Map(
    packWorksForMobile(works).map((work, order) => [work.index, order]),
  )
  let videoCount = 0

  return works.map((work) => {
    const videoSide =
      work.type === 'video' ? (videoCount++ % 2 === 0 ? 'Left' : 'Right') : null
    return {
      ...work,
      mobileOrder: mobileOrderByIndex.get(work.index),
      videoSide,
    }
  })
}

export function stepIndex(index, direction, length) {
  if (!length) return 0
  return (index + direction + length) % length
}

export function workItemClassName(work, styles) {
  const names = [styles.item]
  if (work.videoSide) {
    names.push(styles.itemVideo, styles[`itemVideo${work.videoSide}`])
  } else {
    names.push(styles.itemImage)
  }
  return names.join(' ')
}
