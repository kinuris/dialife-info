export function getAge(millis: number) {
  const today = new Date()
  const birthDate = new Date(millis)
  const m = today.getMonth() - birthDate.getMonth()

  let age = today.getFullYear() - birthDate.getFullYear()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
