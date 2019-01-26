import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/ZmodNAdditionMap"
import { FiniteMagma } from "../../../src/algebra/finite/Magma"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"
import { Tuple } from "../../../src/common/sets/Tuple"

describe("FiniteMagma", () => {
  const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))

  test("{0, 1, 2} does not form a magma with Zmod2 addition", () => {
    const testSet = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))

    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new FiniteMagma(testSet, Zmod2Addition)
    }).toThrow()
  })

  test("Zmod2 is a magma", () => {
    const Zmod2Magma = new FiniteMagma(Zmod2Set, Zmod2Addition)
    expect(Zmod2Magma).toBeDefined()
  })

  describe("given Zmod2", () => {
    const Zmod2Magma = new FiniteMagma(Zmod2Set, Zmod2Addition)

    test("using the convenience `applyOperation` passes through", () => {
      const pair = new Tuple([new IntegerNumber(1), new IntegerNumber(1)])

      expect(Zmod2Magma.applyOperation(pair).isEqualTo(new IntegerNumber(0))).toBeTruthy()
    })

    test("the set of square elements is the only the identity", () => {
      const testSet = new FiniteSet<IntegerNumber>([new IntegerNumber(0)])

      expect(Zmod2Magma.setOfSquareElements().isEqualTo(testSet))
    })
  })
})
