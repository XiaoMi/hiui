import { flattenTreeData } from '../src/utils'

describe('utils', () => {
  describe('flatten treeNode', () => {
    function getNode(id, children) {
      return {
        id,
        title: id,
        children,
      }
    }

    it('order should pre-order', () => {
      const flattedData = flattenTreeData([
        getNode('0', [
          getNode('0-0'),
          getNode('0-1'),
          getNode('0-2', [
            getNode('0-2-0'),
            getNode('0-2-1'),
            getNode('0-2-2'),
            getNode('0-2-3', [
              // break line
              getNode('0-2-3-0'),
            ]),
            getNode('0-2-4'),
          ]),
        ]),
        getNode('1'),
      ])

      expect(flattedData.map(({ id }) => id)).toEqual([
        '0',
        '0-0',
        '0-1',
        '0-2',
        '0-2-0',
        '0-2-1',
        '0-2-2',
        '0-2-3',
        '0-2-3-0',
        '0-2-4',
        '1',
      ])
    })

    it('depth should be correct number', () => {
      const flattedData = flattenTreeData([
        getNode('0', [
          getNode('0-0'),
          getNode('0-1', [
            getNode('0-1-0'),
            getNode('0-1-1'),
            getNode('0-1-2'),
            getNode('0-1-3', [
              // break line
              getNode('0-1-3-0'),
            ]),
            getNode('0-1-4'),
          ]),
          getNode('0-2'),
        ]),
        getNode('1'),
      ])

      expect(flattedData.map(({ depth }) => depth)).toEqual(
        ['0', '0-0', '0-1', '0-1-0', '0-1-1', '0-1-2', '0-1-3', '0-1-3-0', '0-1-4', '0-2', '1'].map(
          (id) => id.split('-').length - 1
        )
      )
    })

    it('ancestors should be from bottom to up', () => {
      const flattedData = flattenTreeData([
        getNode('0', [
          getNode('0-0'),
          getNode('0-1', [
            // break line
            getNode('0-1-0'),
          ]),
        ]),
        getNode('1', [
          // break line
          getNode('1-0'),
          getNode('1-1'),
        ]),
      ])

      expect(flattedData.map(({ ancestors }) => ancestors?.map(({ id }) => id))).toEqual([
        undefined,
        ['0'],
        ['0'],
        ['0-1', '0'],
        undefined,
        ['1'],
        ['1'],
      ])
    })

    it('raw should be original node data', () => {
      const rawTreeData = [
        getNode('0', [
          getNode('0-0'),
          getNode('0-1', [
            // break line
            getNode('0-1-0'),
          ]),
        ]),
        getNode('1', [
          // break line
          getNode('1-0'),
          getNode('1-1'),
        ]),
      ]

      const flattedData = flattenTreeData(rawTreeData)

      expect(flattedData.map(({ raw }) => raw)).toEqual([
        rawTreeData[0],
        rawTreeData[0].children[0],
        rawTreeData[0].children[1],
        rawTreeData[0].children[1].children[0],
        rawTreeData[1],
        rawTreeData[1].children[0],
        rawTreeData[1].children[1],
      ])
    })
  })
})
