/* eslint-disable sort-keys */

const size = 200

const mapPin = {
  context: document.createElement('canvas').getContext('2d'),
  data: new Uint8ClampedArray(size * size * 4),
  height: size,
  width: size,

  onAdd: function() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.context = canvas.getContext('2d')
  },

  render: function() {
    const duration = 1000
    const t = (performance.now() % duration) / duration

    const radius = (size / 2) * 0.3
    const outerRadius = (size / 2) * 0.7 * t + radius
    const context = this.context

    if (context) {
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height)
      context.beginPath()
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)

      context.fillStyle = 'rgba(191, 178, 255,' + (1 - t) + ')'
      context.fill()

      // draw inner circle
      context.beginPath()
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)

      context.fillStyle = 'rgba(108, 67, 224, 1)'
      context.strokeStyle = 'white'
      context.lineWidth = 2 + 4 * (1 - t)
      context.fill()
      context.stroke()

      // update this image's data with data from the canvas
      this.data = context.getImageData(0, 0, this.width, this.height).data
    }
    // return `true` to let the map know that the image was updated
    return true
  },
}

export default mapPin
