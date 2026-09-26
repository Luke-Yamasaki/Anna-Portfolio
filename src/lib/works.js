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
