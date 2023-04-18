const fs = require('fs')
const axios = require('axios')

/**
 * 获取日历元数据
 * @param {*} year
 * @param {*} month
 * @returns
 */
const getCalendarData = (year, month) => {
  return new Promise((resolve, reject) => {
    const api = `https://sp1.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?tn=wisetpl&format=json&resource_id=39043&query=${year}年${month}月&t=${Date.now()}}`

    axios({
      url: api,
      // 解决中文乱码
      responseType: 'arraybuffer',
      responseEncoding: 'utf8',
    })
      .then((res) => {
        const { data } = res
        // 解决中文乱码
        const utf8decoder = new TextDecoder('GBK')
        const dataString = utf8decoder.decode(data)
        resolve(JSON.parse(dataString))
      })
      .catch((err) => {
        console.log('Error: ', err.message)
        reject(err)
      })
  })
}

/**
 * 获取节假日数据
 * @param {*} year
 * @returns
 */
const getPRCData = async (year) => {
  return Promise.all([
    getCalendarData(year, 2),
    getCalendarData(year, 5),
    getCalendarData(year, 8),
    getCalendarData(year, 11),
  ]).then((res) => {
    const PRCLunar = []
    const PRCHoliday = {}

    res.forEach((item) => {
      const { almanac } = item.data[0]

      almanac.forEach((item) => {
        const { year, month, day, term, desc, status } = item
        const holiday = term || desc
        const key = `${year}-${month}-${day}`

        if (holiday) {
          PRCLunar.push({
            date: key,
            name: holiday,
          })
        }

        if (status) {
          PRCHoliday[key] = status
        }
      })
    })

    return {
      PRCLunar,
      PRCHoliday,
    }
  })
}

/**
 * 生成 json 文件
 * @param {*} yearList
 */
const generateDataJson = async (yearList) => {
  Promise.all(yearList.map((year) => getPRCData(year))).then((res) => {
    const PRCLunar = {}
    const PRCHoliday = {}

    res.forEach((item, index) => {
      PRCLunar[yearList[index]] = { PRCLunar: item.PRCLunar }
      PRCHoliday[yearList[index]] = { PRCHoliday: item.PRCHoliday }
    })

    fs.writeFileSync('./PRCLunar.json', JSON.stringify(PRCLunar))
    fs.writeFileSync('./PRCHoliday.json', JSON.stringify(PRCHoliday))
  })
}

// 生成 2015-今年 共 length 个年头的数据
generateDataJson(Array.from({ length: 9 }, (v, k) => k + 2015))
