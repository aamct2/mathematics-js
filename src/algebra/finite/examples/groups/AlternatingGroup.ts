import { IntegerNumber } from "../../../../common/IntegerNumber"
import { RealNumber } from "../../../../common/RealNumber"
import { FiniteSet } from "../../../../common/sets/FiniteSet"
import { SquareMatrix } from "../../../SquareMatrix"
import { FiniteGroup } from "../../Group"
import { SquareMatrixNMultiplicationMap } from "../maps/SquareMatrixNMultiplicationMap"
import { SymmetricGroup } from "./SymmetricGroup"

/**
 * Returns the alternating group of order `n!/2`, as represented by permutation matrices.
 * @param n Dimension of the matrix.
 */
export function AlternatingGroup(n: number): FiniteGroup<SquareMatrix<RealNumber>> {
  // First get the symmetric group of order n!
  const SymmetricNGroup = SymmetricGroup(n)

  // Then pick out the even permutations (the ones with determinant -1)
  const newSet = new FiniteSet<SquareMatrix<RealNumber>>()
  const int1 = new RealNumber(1)

  for (let index = 0; index < SymmetricNGroup.order; index++) {
    const element = SymmetricNGroup.set.element(index)
    if (element.determinant().isEqualTo(int1)) {
      newSet.addElement(element)
    }
  }

  const newOperation = SymmetricNGroup.operation.restriction(newSet)

  // Cheat here since we know it has inverses for all elements
  // TODO: FINISH!!!

  return new FiniteGroup(newSet, newOperation)
}
