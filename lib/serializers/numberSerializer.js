module.exports = {
  deserialize(bytes) {
    return bytes.readDoubleBE()
  },
  serialize(number) {
    const buf = Buffer.allocUnsafe(8)
    buf.writeDoubleBE(number, 0)
    return buf
  }
}
