const useTimeperiodData = (timeInterval) => {
  const segment = 24 * 60 / timeInterval
  let pre = 0
  let next = 0
  let periodData = []
  const func = (val) => (val < 10 ? '0' + val : val)
  for (let i = 0; i < segment; i++) {
    next += timeInterval
    const time = func(parseInt(pre / 60)) + ':' + func(pre % 60) + ' ~ ' + func(parseInt(next / 60)) + ':' + func(next % 60)
    periodData.push(time)
    pre = next
  }
  return [periodData]
}

export default useTimeperiodData
