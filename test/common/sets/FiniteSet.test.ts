import { IntegerNumber, RealNumber } from "../../../src/common/numbers"
import { FiniteSet } from "../../../src/common/sets"

describe("FiniteSets", () => {
  const numberSet = new FiniteSet<RealNumber>([1, 2, 3].map(x => new RealNumber(x)))

  test("Adding the element 2 to the set {1} results in {1, 2}", () => {
    const one = new RealNumber(1)
    const set = new FiniteSet<RealNumber>([one])

    expect(set.cardinality()).toBe(1)
    expect(set.contains(one))

    const two = new RealNumber(2)
    set.addElement(two)
    expect(set.cardinality()).toBe(2)
    expect(set.contains(two))
  })

  test("Adding the element 1 to the set {1} results in {1}", () => {
    const one = new RealNumber(1)
    const set = new FiniteSet<RealNumber>([one])

    expect(set.cardinality()).toBe(1)
    expect(set.contains(one))

    const anotherOne = new RealNumber(1)
    set.addElement(anotherOne)
    expect(set.cardinality()).toBe(1)
    expect(set.contains(one))
  })

  test("The cardinality of a set is the number of elements", () => {
    expect(numberSet.cardinality()).toBe(3)
  })

  test("The cardinality of the null set is 0", () => {
    expect(numberSet.NullSet().cardinality()).toBe(0)
  })

  test("The direct product of {0, 1, 2} with itself is as expected", () => {
    const firstSet = new FiniteSet<RealNumber>([0, 1, 2].map(x => new RealNumber(x)))
    const secondSet = new FiniteSet<RealNumber>([0, 1, 2].map(x => new RealNumber(x)))

    const productSet = firstSet.directProduct(secondSet)

    expect(productSet.toString()).toBe("{(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)}")
  })

  describe("given the set {1, 2, 3}", () => {
    test("the direct product with the null set is the null set", () => {
      const secondSet = new FiniteSet<RealNumber>([0, 1, 2].map(x => new RealNumber(x)))

      const nullSetFirst = numberSet.NullSet().directProduct(secondSet)
      const nullSetSecond = numberSet.directProduct(secondSet.NullSet())

      expect(nullSetFirst.toString()).toBe("{}")
      expect(nullSetSecond.toString()).toBe("{}")
    })

    test("it is equal to itself", () => {
      expect(numberSet.isEqualTo(numberSet)).toBeTruthy()
    })

    test("it is equal to {1, 2, 3} (not itself or a clone)", () => {
      const secondSet = new FiniteSet<RealNumber>([1, 2, 3].map(x => new RealNumber(x)))

      expect(numberSet.isEqualTo(secondSet)).toBeTruthy()
    })

    test("it is not equal to {1, 2}", () => {
      const secondSet = new FiniteSet<RealNumber>([1, 2].map(x => new RealNumber(x)))

      expect(numberSet.isEqualTo(secondSet)).toBeFalsy()
    })

    test("it is not equal to {2, 3, 4}", () => {
      const secondSet = new FiniteSet<RealNumber>([2, 3, 4].map(x => new RealNumber(x)))

      expect(numberSet.isEqualTo(secondSet)).toBeFalsy()
    })

    test("contains the element 1", () => {
      expect(numberSet.contains(new RealNumber(1))).toBeTruthy()
    })

    test("does not contain the element 4", () => {
      expect(numberSet.contains(new RealNumber(4))).toBeFalsy()
    })

    test("can be written as {1, 2, 3} [toString]", () => {
      expect(numberSet.toString()).toBe("{1, 2, 3}")
    })

    test("the intersection with {2, 4} is {2}", () => {
      const rhs = new FiniteSet<RealNumber>([2, 4].map(x => new RealNumber(x)))
      const expectedSet = new FiniteSet([new RealNumber(2)])

      expect(numberSet.intersection(rhs).isEqualTo(expectedSet)).toBeTruthy()
    })

    test("the intersection with the empty set is the empty set", () => {
      const rhs = numberSet.NullSet()

      expect(numberSet.intersection(rhs).isEqualTo(rhs)).toBeTruthy()
    })

    it("is a subset of {0, 1, 2, 3, 5}", () => {
      const rhs = new FiniteSet<RealNumber>([0, 1, 2, 3, 5].map(x => new RealNumber(x)))

      expect(numberSet.isSubsetOf(rhs)).toBeTruthy()
    })
  })

  describe("given the set {0, 1, 2}", () => {
    const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))

    it("has a power set as expected", () => {
      const expectedString = "{{}, {2}, {1}, {2, 1}, {0}, {2, 0}, {1, 0}, {2, 1, 0}}"

      expect(Zmod3Set.PowerSet().toString()).toBe(expectedString)
    })

    test("the power set of the null set is the set of the null set", () => {
      const nullSet = Zmod3Set.NullSet()

      expect(nullSet.PowerSet().isEqualTo(new FiniteSet([nullSet]))).toBeTruthy()
    })
  })
})
