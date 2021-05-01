module.exports = function _entry2Profile (entry) {
  console.log(entry)
  return {
    id: Number(entry.id),
    username: entry.username,
    name: entry.username,
    email: entry.email
  }
}
