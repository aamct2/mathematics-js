import { FiniteBinaryOperation } from "../../../../common/functions"
import { IntegerNumber, RealNumber } from "../../../../common/numbers"
import { FiniteSet } from "../../../../common/sets"
import { SquareMatrix } from "../../../SquareMatrix"
import { FiniteGroup } from "../../structures/Group"
import { SquareMatrixNMultiplicationMap } from "../maps"

/**
 * Returns the symmetric group of order `n!`, as represented by permutation matrices.
 * @param n Dimension of the matrix.
 */
export function SymmetricGroup(n: number): FiniteGroup<SquareMatrix<RealNumber>> {
  const matrixSet = new FiniteSet<SquareMatrix<RealNumber>>()
  let level = -1
  const values = new Array(n).fill(0)
  const size = n

  function addItem() {
    const matrix = new SquareMatrix(size, RealNumber)

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let columnIndex = 0; columnIndex < size; columnIndex++) {
        if (values[rowIndex] - 1 === columnIndex) {
          matrix.setItem(rowIndex, columnIndex, new RealNumber(1))
        } else {
          matrix.setItem(rowIndex, columnIndex, new RealNumber(0))
        }
      }
    }

    matrixSet.addElement(matrix)
  }

  function visit(k: number) {
    level++
    values[k] = level

    if (level === size) {
      addItem()
    } else {
      for (let index = 0; index < size; index++) {
        if (values[index] === 0) {
          visit(index)
        }
      }
    }

    level--
    values[k] = 0
  }

  visit(0)

  const newMap = new SquareMatrixNMultiplicationMap<RealNumber>(new IntegerNumber(n))
  const newOperation = new FiniteBinaryOperation(matrixSet, newMap)

  // Cheat here since we know it is associative and it has inverses for all elements
  // TODO: FINISH!!!

  return new FiniteGroup(matrixSet, newOperation)
}
