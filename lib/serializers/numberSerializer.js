module.exports = {
  deserialize(bytes) {
    return bytes.readDoubleBE()
  },
  serialize(number) {
    const buf = Buffer.alloc(8)
    buf.writeDoubleBE(number, 0)
    return buf
  }
}
