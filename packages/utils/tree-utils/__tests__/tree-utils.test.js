import { fFindNestedChildNodesById, flattenTree, getNodeAncestors } from '../src'

describe('utils', () => {
  describe('flatten treeNode', () => {
    function gNode(id, children) {
      return {
        id,
        children,
      }
    }

    it('order should be pre-order', () => {
      const flattedData = flattenTree([
        gNode('0', [
          gNode('0-0'),
          gNode('0-1'),
          gNode('0-2', [
            gNode('0-2-0'),
            gNode('0-2-1'),
            gNode('0-2-2'),
            gNode('0-2-3', [
              // break line
              gNode('0-2-3-0'),
            ]),
            gNode('0-2-4'),
          ]),
        ]),
        gNode('1'),
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
      const flattedData = flattenTree([
        gNode('0', [
          gNode('0-0'),
          gNode('0-1', [
            gNode('0-1-0'),
            gNode('0-1-1'),
            gNode('0-1-2'),
            gNode('0-1-3', [
              // break line
              gNode('0-1-3-0'),
            ]),
            gNode('0-1-4'),
          ]),
          gNode('0-2'),
        ]),
        gNode('1'),
      ])

      expect(flattedData.map(({ depth }) => depth)).toEqual(
        ['0', '0-0', '0-1', '0-1-0', '0-1-1', '0-1-2', '0-1-3', '0-1-3-0', '0-1-4', '0-2', '1'].map(
          (id) => id.split('-').length - 1
        )
      )
    })

    it('ancestors should be from bottom to up', () => {
      const flattedData = flattenTree([
        gNode('0', [
          gNode('0-0'),
          gNode('0-1', [
            // break line
            gNode('0-1-0'),
          ]),
        ]),
        gNode('1', [
          // break line
          gNode('1-0'),
          gNode('1-1'),
        ]),
      ])

      expect(flattedData.map((node) => getNodeAncestors(node).map(({ id }) => id))).toEqual([
        [],
        ['0'],
        ['0'],
        ['0-1', '0'],
        [],
        ['1'],
        ['1'],
      ])
    })

    it('raw should be original node data', () => {
      const rawTreeData = [
        gNode('0', [
          gNode('0-0'),
          gNode('0-1', [
            // break line
            gNode('0-1-0'),
          ]),
        ]),
        gNode('1', [
          // break line
          gNode('1-0'),
          gNode('1-1'),
        ]),
      ]

      const flattedData = flattenTree(rawTreeData)

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

  describe('find all nested child by id in flatten data', () => {
    function gNode(id, children) {
      return {
        id,
        children,
      }
    }

    it('order should be pre-order', () => {
      const flattedData = flattenTree([
        gNode('0', [
          gNode('0-0'),
          gNode('0-1'),
          gNode('0-2', [
            gNode('0-2-0'),
            gNode('0-2-1'),
            gNode('0-2-2'),
            gNode('0-2-3', [
              // break line
              gNode('0-2-3-0'),
            ]),
            gNode('0-2-4'),
          ]),
        ]),
        gNode('1'),
      ])

      const [childNodes, nodeIndex] = fFindNestedChildNodesById(flattedData, flattedData[3].id)

      expect(childNodes.map(({ id }) => id)).toEqual([
        '0-2-0',
        '0-2-1',
        '0-2-2',
        '0-2-3',
        '0-2-3-0',
        '0-2-4',
      ])

      expect(nodeIndex).toEqual(3)
    })

    it('find empty', () => {
      const flattedData = flattenTree([
        gNode('0', [
          gNode('0-0'),
          gNode('0-1'),
          gNode('0-2', [
            gNode('0-2-0'),
            gNode('0-2-1'),
            gNode('0-2-2'),
            gNode('0-2-3', [
              // break line
              gNode('0-2-3-0'),
            ]),
            gNode('0-2-4'),
          ]),
        ]),
        gNode('1'),
      ])

      const [childNodes, nodeIndex] = fFindNestedChildNodesById(
        flattedData,
        flattedData[flattedData.length - 1].id
      )

      expect(childNodes.map(({ id }) => id)).toEqual([])

      expect(nodeIndex).toEqual(flattedData.length - 1)
    })
  })
})
