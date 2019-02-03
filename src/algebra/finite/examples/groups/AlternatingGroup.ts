import { FiniteBinaryOperation, FiniteBinaryOperationPropertyKeys } from "../../../../common/functions"
import { RealNumber } from "../../../../common/numbers"
import { FiniteSet } from "../../../../common/sets"
import { SquareMatrix } from "../../../SquareMatrix"
import { FiniteGroup } from "../../structures/Group"
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

  // Cheat here since we know the operation has a number of properties
  const properties: { [key: string]: boolean } = {}
  properties[FiniteBinaryOperationPropertyKeys.Associativity] = true
  properties[FiniteBinaryOperationPropertyKeys.Inverses] = true
  if (n === 3) {
    properties[FiniteBinaryOperationPropertyKeys.Commutivity] = true
  }

  const newOperation = FiniteBinaryOperation.KnownFiniteBinaryOperation(
    newSet,
    SymmetricNGroup.operation.relation,
    properties
  )

  return new FiniteGroup(newSet, newOperation)
}
