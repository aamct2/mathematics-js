import { Tuple } from "../../../src/common/sets"

describe("Tuple", () => {
  test("(0, 1) is not eqaul to (0, 1, 2)", () => {
    const lhs = new Tuple([0, 1])
    const rhs = new Tuple([0, 1, 2])

    expect(lhs.isEqualTo(rhs)).toBeFalsy()
  })

  test("(0, 1) is not eqaul to (a, b)", () => {
    const lhs = new Tuple([0, 1])
    const rhs = new Tuple(["a", "b"])

    expect(lhs.isEqualTo(rhs)).toBeFalsy()
  })
})
