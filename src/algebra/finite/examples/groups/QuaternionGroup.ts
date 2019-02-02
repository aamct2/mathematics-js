import { FiniteBinaryOperation } from "../../../../common/functions/FiniteBinaryOperation"
import { ComplexNumber } from "../../../../common/numbers/ComplexNumber"
import { IntegerNumber } from "../../../../common/numbers/IntegerNumber"
import { FiniteSet } from "../../../../common/sets/FiniteSet"
import { SquareMatrix } from "../../../SquareMatrix"
import { FiniteGroup } from "../../Group"
import { SquareMatrixNMultiplicationMap } from "../maps/SquareMatrixNMultiplicationMap"

/**
 * Returns the quaternion group of order 8, as represented by matrices.
 */
export function QuaternionGroup(): FiniteGroup<SquareMatrix<ComplexNumber>> {
  const set = new FiniteSet<SquareMatrix<ComplexNumber>>([])
  const negative1 = new ComplexNumber(-1, 0)

  // Identity
  const identity = new SquareMatrix<ComplexNumber>(2, ComplexNumber)
  identity.setItem(0, 0, new ComplexNumber(1, 0))
  identity.setItem(1, 0, new ComplexNumber(0, 0))
  identity.setItem(0, 1, new ComplexNumber(0, 0))
  identity.setItem(1, 1, new ComplexNumber(1, 0))

  // i
  const iMatrix = new SquareMatrix<ComplexNumber>(2, ComplexNumber)
  iMatrix.setItem(0, 0, new ComplexNumber(0, 1))
  iMatrix.setItem(1, 0, new ComplexNumber(0, 0))
  iMatrix.setItem(0, 1, new ComplexNumber(0, 0))
  iMatrix.setItem(1, 1, new ComplexNumber(0, -1))

  // j
  const jMatrix = new SquareMatrix<ComplexNumber>(2, ComplexNumber)
  jMatrix.setItem(0, 0, new ComplexNumber(0, 0))
  jMatrix.setItem(1, 0, new ComplexNumber(1, 0))
  jMatrix.setItem(0, 1, new ComplexNumber(-1, 0))
  jMatrix.setItem(1, 1, new ComplexNumber(0, 0))

  // k
  const kMatrix = new SquareMatrix<ComplexNumber>(2, ComplexNumber)
  kMatrix.setItem(0, 0, new ComplexNumber(0, 0))
  kMatrix.setItem(1, 0, new ComplexNumber(0, 1))
  kMatrix.setItem(0, 1, new ComplexNumber(0, 1))
  kMatrix.setItem(1, 1, new ComplexNumber(0, 0))

  set.addElement(identity)
  set.addElement(identity.multiplyByScalar(negative1))
  set.addElement(iMatrix)
  set.addElement(iMatrix.multiplyByScalar(negative1))
  set.addElement(jMatrix)
  set.addElement(jMatrix.multiplyByScalar(negative1))
  set.addElement(kMatrix)
  set.addElement(kMatrix.multiplyByScalar(negative1))

  const map = new SquareMatrixNMultiplicationMap<ComplexNumber>(new IntegerNumber(2))
  const operation = new FiniteBinaryOperation(set, map)

  return new FiniteGroup(set, operation)
}
