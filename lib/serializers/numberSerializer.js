module.exports = {
  deserialize(bytes) {
    return bytes.readDoubleBE(0)
  },
  serialize(number) {
    const buf = Buffer.alloc(8)
    buf.writeDoubleBE(number, 0)
    return buf
  }
}
