import { AlternatingGroup } from "../../../src/algebra/finite/examples/groups/AlternatingGroup"
import { Dihedral8Group } from "../../../src/algebra/finite/examples/groups/Dihedral8Group"
import { SymmetricGroup } from "../../../src/algebra/finite/examples/groups/SymmetricGroup"
import { ZmodNAdditionGroup } from "../../../src/algebra/finite/examples/groups/ZmodNGroup"
import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/maps/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/maps/ZmodNMultiplicationMap"
import { FiniteGroup } from "../../../src/algebra/finite/Group"
import { SquareMatrix } from "../../../src/algebra/SquareMatrix"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/numbers/IntegerNumber"
import { RealNumber } from "../../../src/common/numbers/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteGroup", () => {
  test("(Zmod2, +) is a group", () => {
    const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
    const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))
    const Zmod2Group = new FiniteGroup(Zmod2Set, Zmod2Addition)
    expect(Zmod2Group).toBeDefined()
  })

  test("(Zmod2, *) is not a group", () => {
    const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))
    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new FiniteGroup(Zmod2Set, Zmod2Multiplication)
    }).toThrow()
  })

  describe("given common groups", () => {
    const Alt3Group = AlternatingGroup(3)
    const dihedral8Group = Dihedral8Group()
    const Sym3Group = SymmetricGroup(3)
    const Sym4Group = SymmetricGroup(4)
    const Zmod2Group = ZmodNAdditionGroup(2)
    const Zmod4Group = ZmodNAdditionGroup(4)

    test("abelian", () => {
      expect(Alt3Group.isAbelian()).toBeTruthy()
      expect(dihedral8Group.isAbelian()).toBeFalsy()
      expect(Sym3Group.isAbelian()).toBeFalsy()
      expect(Zmod2Group.isAbelian()).toBeTruthy()
    })

    test("center", () => {
      expect(Sym4Group.centerGroup().isEqualTo(Sym4Group.trivialSubgroup())).toBeTruthy()
    })

    test("cyclic", () => {
      expect(Alt3Group.isCyclic()).toBeTruthy()
      expect(dihedral8Group.isCyclic()).toBeFalsy()
      expect(Sym3Group.isCyclic()).toBeFalsy()
      expect(Zmod2Group.isCyclic()).toBeTruthy()
    })

    test("order", () => {
      expect(dihedral8Group.order).toBe(8)
      expect(Sym4Group.order).toBe(24)
    })

    test("order of an element", () => {
      expect(dihedral8Group.orderOf(dihedral8Group.identity)).toBe(1)
      expect(Zmod4Group.orderOf(new IntegerNumber(3))).toBe(4)
    })

    test("subgroup", () => {
      expect(Alt3Group.isSubgroupOf(Sym3Group)).toBeTruthy()
    })
  })

  describe("given the group (Zmod2, +)", () => {
    const Zmod2Group = ZmodNAdditionGroup(2)

    it("has a center that is the same as the whole group", () => {
      expect(Zmod2Group.center().isEqualTo(Zmod2Group.set)).toBeTruthy()
      expect(Zmod2Group.centerGroup().isEqualTo(Zmod2Group)).toBeTruthy()
    })

    it("has a trivial subgroup of ({0}, +)", () => {
      const trivialSubgroup = Zmod2Group.trivialSubgroup()

      expect(trivialSubgroup.order).toBe(1)
      expect(trivialSubgroup.set.element(0).isEqualTo(new IntegerNumber(0))).toBeTruthy()
    })

    describe("given (Zmod4, +)", () => {
      const Zmod4Group = ZmodNAdditionGroup(4)

      test("(Zmod2, +) is not a subgroup of (Zmod4, +)", () => {
        expect(Zmod2Group.isSubgroupOf(Zmod4Group)).toBeFalsy()
      })

      test("(Zmod4, +) is not a subgroup of (Zmod2, +)", () => {
        expect(Zmod4Group.isSubgroupOf(Zmod2Group)).toBeFalsy()
      })

      test("({0, 2}, +) is a subgroup of (Zmod4, +)", () => {
        const subSet = new FiniteSet<IntegerNumber>([0, 2].map(x => new IntegerNumber(x)))
        const restriction = Zmod4Group.operation.restriction(subSet)
        const subgroup = new FiniteGroup(subSet, restriction)

        expect(subgroup.isSubgroupOf(Zmod4Group)).toBeTruthy()
      })
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

    test("the center is {identity, 180º rotation}", () => {
      const expected = new FiniteSet([0, 0.5].map(angle => rotationMatrix(angle * 2 * Math.PI)))

      expect(dihedral8Group.center().isEqualTo(expected)).toBeTruthy()
    })

    test("the center is the same as the centralizer of the whole group", () => {
      const center = dihedral8Group.center()
      const centralizer = dihedral8Group.centralizer(dihedral8Group.set)

      expect(center.isEqualTo(centralizer)).toBeTruthy()
    })
  })

  test("the trivial subgroup of a known abelian group is abelian", () => {
    const Zmod2Group = ZmodNAdditionGroup(2)

    expect(Zmod2Group.isAbelian()).toBeTruthy()
    expect(Zmod2Group.trivialSubgroup().isAbelian()).toBeTruthy()
  })

  describe("group errors", () => {
    const Zmod2Group = ZmodNAdditionGroup(2)
    const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))

    test("the centralizer of a set that is not a subset throws an error", () => {
      expect(() => {
        Zmod2Group.centralizer(Zmod3Set)
      }).toThrow()
    })

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

    test("attempting to generating the group using an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.generatesGroup(new IntegerNumber(3))
      }).toThrow()
    })

    test("the order of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.orderOf(new IntegerNumber(4))
      }).toThrow()
    })

    test("the power of an element to a negative exponent throws an error", () => {
      expect(() => {
        Zmod2Group.power(new IntegerNumber(1), -1)
      }).toThrow()
    })

    test("the power of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.power(new IntegerNumber(4), 3)
      }).toThrow()
    })
  })
})
