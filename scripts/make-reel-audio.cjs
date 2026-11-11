const fs = require('fs')
const path = require('path')

const dir = path.join('public', 'reels', 'audio')
fs.mkdirSync(dir, { recursive: true })

function writeTone(file, freq, seconds = 14) {
  const sampleRate = 44100
  const num = sampleRate * seconds
  const dataSize = num * 2
  const buf = Buffer.alloc(44 + dataSize)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(1, 22)
  buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(sampleRate * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < num; i += 1) {
    const t = i / sampleRate
    const env = Math.min(1, t * 2) * Math.min(1, (seconds - t) * 2)
    const a = Math.sin(2 * Math.PI * freq * t) * 0.16
    const b = Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.07
    const c = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.05
    const s = Math.max(-1, Math.min(1, (a + b + c) * env))
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2)
  }

  fs.writeFileSync(path.join(dir, file), buf)
  console.log('wrote', file, buf.length)
}

writeTone('soft1.wav', 220)
writeTone('soft2.wav', 196)
writeTone('soft3.wav', 246.94)
writeTone('soft4.wav', 174.61)
writeTone('soft5.wav', 261.63)
