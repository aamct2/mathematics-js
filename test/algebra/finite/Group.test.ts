import { Dihedral8Group } from "../../../src/algebra/finite/examples/groups/Dihedral8Group"
import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/maps/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/maps/ZmodNMultiplicationMap"
import { FiniteGroup } from "../../../src/algebra/finite/Group"
import { SquareMatrix } from "../../../src/algebra/SquareMatrix"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { RealNumber } from "../../../src/common/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

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

  describe("given the group (Zmod2, +)", () => {
    const Zmod2Group = new FiniteGroup(Zmod2Set, Zmod2Addition)

    it("has a center that is the same as the whole group", () => {
      expect(Zmod2Group.center().isEqualTo(Zmod2Group.set)).toBeTruthy()
    })
  })

  describe("given the Dihedral 8 group", () => {
    const dihedral8Group = Dihedral8Group()

    function rotationMatrix(angle: number): SquareMatrix<RealNumber> {
      const matrix = new SquareMatrix(2, RealNumber)
      matrix.setItem(0, 0, new RealNumber(Math.round(Math.cos(angle))))
      matrix.setItem(0, 1, new RealNumber(Math.round(Math.sin(angle))))
      matrix.setItem(1, 0, new RealNumber(Math.round(-1 * Math.sin(angle))))
      matrix.setItem(1, 1, new RealNumber(Math.round(Math.cos(angle))))

      return matrix
    }

    it("has an order of 8", () => {
      expect(dihedral8Group.order).toBe(8)
    })

    test("the centralizer of the identity is the whole group", () => {
      expect(dihedral8Group.centralizerOfElement(dihedral8Group.identity).isEqualTo(dihedral8Group.set)).toBeTruthy()
    })

    test("the centralizer of a 180º rotation is the whole group", () => {
      const matrix = rotationMatrix(Math.PI)

      expect(dihedral8Group.centralizerOfElement(matrix).isEqualTo(dihedral8Group.set)).toBeTruthy()
    })

    test("the centralizer of a 90º rotation is the set of all rotations", () => {
      const matrix = rotationMatrix(Math.PI / 2)
      const expected = new FiniteSet([0, 0.25, 0.5, 0.75].map(angle => rotationMatrix(angle * 2 * Math.PI)))

      expect(dihedral8Group.centralizerOfElement(matrix).isEqualTo(expected)).toBeTruthy()
    })
  })

  describe("group errors", () => {
    const Zmod2Group = new FiniteGroup(Zmod2Set, Zmod2Addition)

    test("the centralizer of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.centralizerOfElement(new IntegerNumber(3))
      }).toThrow()
    })

    test("the commutator of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.commutator(new IntegerNumber(0), new IntegerNumber(3))
      }).toThrow()
    })
  })
})
