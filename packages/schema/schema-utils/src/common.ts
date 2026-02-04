type RawItem<T> = {
  id: T
  title: T
}

export type RawItemType<T> = RawItem<T>

export function rawToItem<T extends string | number>(raw: T) {
  if (['string', 'number'].includes(typeof raw)) {
    return { id: raw, title: raw } as RawItem<T>
  }
  return null
}

export function rawToItems<T extends string | number>(raws: T[]) {
  return raws.map(rawToItem).filter(Boolean) as RawItem<T>[]
}

/**
 * 将字符串转换为选项
 * @param str 字符串 形如 title1:id1;title2:id2;
 * @returns 数组
 */
export function stringToOpts<T = RawItem<string>>(
  str: string,
  extra: {
    titleName?: string
    idName?: string
  } = {}
): T[] {
  const { titleName = 'title', idName = 'id' } = extra

  return str
    .split(';')
    .map((item) => {
      const [title, id] = item.split(':')

      const idStr = id.trim()
      const idNum = Number(idStr)
      const finalId = isNaN(idNum) ? idStr : idNum

      return { [idName]: finalId, [titleName]: title.trim() } as T
    })
    .filter(
      (item) =>
        (item as Record<string, string>)[idName] !== '' &&
        (item as Record<string, string>)[titleName]
    )
}
