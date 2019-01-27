import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/maps/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/maps/ZmodNMultiplicationMap"
import { FiniteGroup } from "../../../src/algebra/finite/Group"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"
import { Dihedral8Group } from "../../../src/algebra/finite/examples/groups/Dihedral8Group"

describe("FiniteGroup", () => {
  const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))

  test("(Zmod2, +) is a group", () => {
    const Zmod2Group = new FiniteGroup(Zmod2Set, Zmod2Addition)
    expect(Zmod2Group).toBeDefined()
  })

  test("(Zmod2, *) is not a group", () => {
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))
    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new FiniteGroup(Zmod2Set, Zmod2Multiplication)
    }).toThrow()
  })

  describe("given the Dihedral 8 group", () => {
    const dihedral8Group = Dihedral8Group()

    it("has an order of 8", () => {
      expect(dihedral8Group.order).toBe(8)
    })
  })
})
