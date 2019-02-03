import { AlternatingGroup } from "../../../src/algebra/finite/examples/groups/AlternatingGroup"
import { Dihedral8Group } from "../../../src/algebra/finite/examples/groups/Dihedral8Group"
import { QuaternionGroup } from "../../../src/algebra/finite/examples/groups/QuaternionGroup"
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
    // Order: 3
    // Simple, Abelian, Nilpotent, Solvable
    const Alt3Group = AlternatingGroup(3)

    // Order: 60
    // Perfect (actually, it's the smallest non-trivial perfect group)
    // const Alt5Group = AlternatingGroup(5)

    // Order: 8
    // non-Abelian, Nilpotent, Solvable, non-T-Group
    const dihedral8Group = Dihedral8Group()

    // Order: 8
    // non-Abelian, Nilpotent, Solvable, Dedekind, T-Group, Special
    const QuatGroup = QuaternionGroup()

    // Order: 6
    // non-Abelian, non-Nilpotent, Solvable
    // (Not sure, but the system claims Sym3Group is metanilpotent. Need to verify)
    const Sym3Group = SymmetricGroup(3)

    // Order: 24
    const Sym4Group = SymmetricGroup(4)

    // Order: 2
    const Zmod2Group = ZmodNAdditionGroup(2)

    // Order: 4
    const Zmod4Group = ZmodNAdditionGroup(4)

    test("abelian", () => {
      expect(Alt3Group.isAbelian()).toBeTruthy()
      expect(dihedral8Group.isAbelian()).toBeFalsy()
      expect(QuatGroup.isAbelian()).toBeFalsy()
      expect(Sym3Group.isAbelian()).toBeFalsy()
      expect(Zmod2Group.isAbelian()).toBeTruthy()
    })

    test("center", () => {
      expect(Sym4Group.centerGroup().isEqualTo(Sym4Group.trivialSubgroup())).toBeTruthy()
    })

    test("conjugacy classes", () => {
      expect(dihedral8Group.setOfAllConjugacyClasses().cardinality()).toBe(5)
      expect(Sym3Group.setOfAllConjugacyClasses().cardinality()).toBe(3)
      expect(Sym4Group.setOfAllConjugacyClasses().cardinality()).toBe(5)
    })

    test("cyclic", () => {
      expect(Alt3Group.isCyclic()).toBeTruthy()
      expect(dihedral8Group.isCyclic()).toBeFalsy()
      expect(Sym3Group.isCyclic()).toBeFalsy()
      expect(Zmod2Group.isCyclic()).toBeTruthy()
    })

    test("dedekind", () => {
      expect(QuatGroup.isDedekind()).toBeTruthy()
      expect(dihedral8Group.isDedekind()).toBeFalsy()
      expect(Zmod4Group.isDedekind()).toBeTruthy()
    })

    test("derived subgroup", () => {
      expect(Zmod2Group.derivedSubgroup().isEqualTo(Zmod2Group.trivialSubgroup())).toBeTruthy()
      expect(Sym3Group.derivedSubgroup().isEqualTo(Alt3Group)).toBeTruthy()
    })

    test("hamiltonian", () => {
      expect(QuatGroup.isHamiltonian()).toBeTruthy()
      expect(Zmod4Group.isHamiltonian()).toBeFalsy()
    })

    test("normal subgroup", () => {
      expect(Zmod4Group.trivialSubgroup().isNormalSubgroupOf(Zmod4Group)).toBeTruthy()
      expect(Zmod4Group.isNormalSubgroupOf(Zmod4Group)).toBeTruthy()
      expect(dihedral8Group.centerGroup().isNormalSubgroupOf(dihedral8Group)).toBeTruthy()
      expect(dihedral8Group.derivedSubgroup().isNormalSubgroupOf(dihedral8Group)).toBeTruthy()
    })

    test("order", () => {
      expect(Alt3Group.order).toBe(3)
      expect(dihedral8Group.order).toBe(8)
      expect(Sym3Group.order).toBe(6)
      expect(Sym4Group.order).toBe(24)
      expect(Zmod2Group.order).toBe(2)
      expect(Zmod4Group.order).toBe(4)
    })

    test("order of an element", () => {
      expect(dihedral8Group.orderOf(dihedral8Group.identity)).toBe(1)
      expect(Zmod4Group.orderOf(new IntegerNumber(3))).toBe(4)
    })

    test("perfect", () => {
      expect(Zmod2Group.isPerfect()).toBeFalsy()
      expect(Zmod2Group.trivialSubgroup().isPerfect()).toBeTruthy()
      // expect(Alt5Group.isPerfect()).toBeTruthy()
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

      const subSet = new FiniteSet<IntegerNumber>([0, 2].map(x => new IntegerNumber(x)))
      const restriction = Zmod4Group.operation.restriction(subSet)
      const subgroup = new FiniteGroup(subSet, restriction)

      test("({0, 2}, +) is a subgroup of (Zmod4, +)", () => {
        expect(subgroup.isSubgroupOf(Zmod4Group)).toBeTruthy()
      })

      describe("cosets in (Zmod4, +) with respect to ({0, 2}, +)", () => {
        test("the left coset of {0} is {0, 2}", () => {
          const leftCoset = Zmod4Group.leftCoset(subgroup, new IntegerNumber(0))

          expect(leftCoset.isEqualTo(subSet)).toBeTruthy()
        })

        test("the left coset of {1} is {1, 3}", () => {
          const leftCoset = Zmod4Group.leftCoset(subgroup, new IntegerNumber(1))
          const expected = new FiniteSet<IntegerNumber>([1, 3].map(x => new IntegerNumber(x)))

          expect(leftCoset.isEqualTo(expected)).toBeTruthy()
        })

        test("the left coset of {2} is {0, 2}", () => {
          const leftCoset = Zmod4Group.leftCoset(subgroup, new IntegerNumber(2))

          expect(leftCoset.isEqualTo(subSet)).toBeTruthy()
        })

        test("the left coset of {3} is {1, 3}", () => {
          const leftCoset = Zmod4Group.leftCoset(subgroup, new IntegerNumber(3))
          const expected = new FiniteSet<IntegerNumber>([1, 3].map(x => new IntegerNumber(x)))

          expect(leftCoset.isEqualTo(expected)).toBeTruthy()
        })

        test("the right coset of {0} is {0, 2}", () => {
          const rightCoset = Zmod4Group.rightCoset(subgroup, new IntegerNumber(0))

          expect(rightCoset.isEqualTo(subSet)).toBeTruthy()
        })

        test("the right coset of {1} is {1, 3}", () => {
          const rightCoset = Zmod4Group.rightCoset(subgroup, new IntegerNumber(1))
          const expected = new FiniteSet<IntegerNumber>([1, 3].map(x => new IntegerNumber(x)))

          expect(rightCoset.isEqualTo(expected)).toBeTruthy()
        })
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

    test("the order of the elements in a conjugacy class are the same", () => {
      const conjugacyClasses = dihedral8Group.setOfAllConjugacyClasses()

      for (let classIndex = 0; classIndex < conjugacyClasses.cardinality(); classIndex++) {
        const conjugacyClass = conjugacyClasses.element(classIndex)

        const orderSet = new FiniteSet<IntegerNumber>([])
        for (let elementIndex = 0; elementIndex < conjugacyClass.cardinality(); elementIndex++) {
          const element = conjugacyClass.element(elementIndex)

          orderSet.addElement(new IntegerNumber(dihedral8Group.orderOf(element)))
        }

        expect(orderSet.cardinality()).toBe(1)
      }
    })
  })

  test("the quotient of Zmod6 and {0, 3} is as expected", () => {
    const Zmod6Group = ZmodNAdditionGroup(6)
    const subset = new FiniteSet<IntegerNumber>([0, 3].map(x => new IntegerNumber(x)))
    const restriction = Zmod6Group.operation.restriction(subset)
    const subgroup = new FiniteGroup(subset, restriction)

    const secondElement = new FiniteSet<IntegerNumber>([1, 4].map(x => new IntegerNumber(x)))
    const thirdElement = new FiniteSet<IntegerNumber>([2, 5].map(x => new IntegerNumber(x)))
    const expected = new FiniteSet([subset, secondElement, thirdElement])

    expect(Zmod6Group.quotientGroup(subgroup).set.isEqualTo(expected)).toBeTruthy()
  })

  test("the trivial subgroup of a known abelian group is abelian", () => {
    const Zmod2Group = ZmodNAdditionGroup(2)

    expect(Zmod2Group.isAbelian()).toBeTruthy()
    expect(Zmod2Group.trivialSubgroup().isAbelian()).toBeTruthy()
  })

  test("the only subgroups of Zmod3 are Zmod1 and Zmod3", () => {
    const Zmod1Group = ZmodNAdditionGroup(1)
    const Zmod3Group = ZmodNAdditionGroup(3)
    const expected = new FiniteSet([Zmod1Group, Zmod3Group])

    expect(Zmod3Group.setOfAllSubgroups().isEqualTo(expected)).toBeTruthy()
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

    test("the left coset of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.leftCoset(Zmod2Group, new IntegerNumber(3))
      }).toThrow()
    })

    test("the left coset with respect to a group that is not a subgroup throws an error", () => {
      const Zmod4Group = ZmodNAdditionGroup(4)

      expect(() => {
        Zmod4Group.leftCoset(Zmod2Group, new IntegerNumber(1))
      }).toThrow()
    })

    test("the right coset of an element not in the group throws an error", () => {
      expect(() => {
        Zmod2Group.rightCoset(Zmod2Group, new IntegerNumber(3))
      }).toThrow()
    })

    test("the right coset with respect to a group that is not a subgroup throws an error", () => {
      const Zmod4Group = ZmodNAdditionGroup(4)

      expect(() => {
        Zmod4Group.rightCoset(Zmod2Group, new IntegerNumber(1))
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
