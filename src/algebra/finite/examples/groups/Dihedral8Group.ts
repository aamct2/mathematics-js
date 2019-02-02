import { FiniteBinaryOperation } from "../../../../common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../../common/numbers/IntegerNumber"
import { RealNumber } from "../../../../common/numbers/RealNumber"
import { FiniteSet } from "../../../../common/sets/FiniteSet"
import { SquareMatrix } from "../../../SquareMatrix"
import { FiniteGroup } from "../../Group"
import { SquareMatrixNMultiplicationMap } from "../maps/SquareMatrixNMultiplicationMap"

/**
 * Returns the dihedral group of order 8, as represented by matrices.
 */
export function Dihedral8Group(): FiniteGroup<SquareMatrix<RealNumber>> {
  // Generate the group's set
  const set = new FiniteSet<SquareMatrix<RealNumber>>()

  const N = 4

  for (let K = 0; K < N + 1; K++) {
    const intermediary = (2 * Math.PI * K) / N

    // Add the rotation matrix
    const rotationMatrix = new SquareMatrix(2, RealNumber)
    rotationMatrix.setItem(0, 0, new RealNumber(Math.round(Math.cos(intermediary))))
    rotationMatrix.setItem(0, 1, new RealNumber(Math.round(Math.sin(intermediary))))
    rotationMatrix.setItem(1, 0, new RealNumber(Math.round(-1 * Math.sin(intermediary))))
    rotationMatrix.setItem(1, 1, new RealNumber(Math.round(Math.cos(intermediary))))
    set.addElement(rotationMatrix)

    // Add the reflection matrix
    const reflectionMatrix = new SquareMatrix(2, RealNumber)
    reflectionMatrix.setItem(0, 0, new RealNumber(Math.round(Math.cos(intermediary))))
    reflectionMatrix.setItem(0, 1, new RealNumber(Math.round(Math.sin(intermediary))))
    reflectionMatrix.setItem(1, 0, new RealNumber(Math.round(Math.sin(intermediary))))
    reflectionMatrix.setItem(1, 1, new RealNumber(Math.round(-1 * Math.cos(intermediary))))
    set.addElement(reflectionMatrix)
  }

  // Create the operation
  const operation = new FiniteBinaryOperation(set, new SquareMatrixNMultiplicationMap(new IntegerNumber(2)))

  // Create the group
  const group = new FiniteGroup(set, operation)
  return group
}
