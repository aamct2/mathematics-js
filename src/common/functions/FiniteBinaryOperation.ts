import { SquareMatrix } from "../../algebra/SquareMatrix"
import { RealNumber } from "../RealNumber"
import { FiniteSet } from "../sets/FiniteSet"
import { Tuple } from "../sets/Tuple"
import { FiniteFunction } from "./FiniteFunction"

enum FiniteBinaryOperationPropertyKeys {
  Associativity = "associativity",
  CayleyTable = "cayley table",
}

export class FiniteBinaryOperation<T extends IEquatable<T>> extends FiniteFunction<Tuple, T> {
  private cayleyTable: number[][] = []

  public constructor(codomain: FiniteSet<T>, relation: IMap<Tuple, T>) {
    super(codomain.directProduct(codomain), codomain, relation)
  }

  public cayleyTableGeneric(): number[][] {
    if (!(FiniteBinaryOperationPropertyKeys.CayleyTable in this.functionProperties)) {
      const domainSize = this.codomain.cardinality()

      const cayleyTable: number[][] = []

      for (let rowIndex = 0; rowIndex < domainSize; rowIndex++) {
        const firstElement = this.codomain.element(rowIndex)

        cayleyTable.push([])
        cayleyTable[rowIndex][0] = rowIndex + 1

        for (let columnIndex = 1; columnIndex < domainSize + 1; columnIndex++) {
          const secondElement = this.codomain.element(columnIndex - 1)
          const tuple = new Tuple(2, [firstElement, secondElement])
          const cayleyElement = this.applyMap(tuple)

          cayleyTable[rowIndex][columnIndex] = this.codomain.indexOf(cayleyElement) + 1
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.CayleyTable] = true
      this.cayleyTable = cayleyTable
    }

    return this.cayleyTable
  }

  /**
   * Determines if the operation is associative. In other words, `(a + b) + c = a + (b + c)` for all `a`, `b`, and `c`. Uses Light's algorithm for testing associativity.
   */
  public isAssociative(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Associativity in this.functionProperties)) {
      const domainSize = this.codomain.cardinality()

      const lightTable = new SquareMatrix(domainSize + 1, RealNumber)

      const originalTable = this.cayleyTable
      const cayleyMatrix = new SquareMatrix(domainSize + 1, RealNumber)

      // Turn the Cayley table into a `SquareMatrix` for easier processing
      for (let columnIndex = 0; columnIndex < domainSize + 1; columnIndex++) {
        cayleyMatrix.setItem(0, columnIndex, new RealNumber(columnIndex))
      }
      for (let rowIndex = 0; rowIndex < domainSize; rowIndex++) {
        for (let columnIndex = 0; columnIndex < domainSize + 1; columnIndex++) {
          cayleyMatrix.setItem(rowIndex + 1, columnIndex, new RealNumber(originalTable[rowIndex][columnIndex]))
        }
      }

      for (let keyElementIndex = 1; keyElementIndex < domainSize + 1; keyElementIndex++) {
        // Build header for `lightTable`
        for (let columnIndex = 1; columnIndex < domainSize + 1; columnIndex++) {
          lightTable.setItem(0, columnIndex, cayleyMatrix.item(keyElementIndex, columnIndex))
        }

        // Fill in `lightTable`
        for (let columnIndex = 1; columnIndex < domainSize + 1; columnIndex++) {
          const cayleyIndex = lightTable.item(0, columnIndex).value

          for (let rowIndex = 1; rowIndex < domainSize + 1; rowIndex++) {
            const cayleyElement = cayleyMatrix.item(rowIndex, cayleyIndex)

            lightTable.setItem(rowIndex, columnIndex, cayleyElement)
          }
        }

        // Copy the `keyElement` column into the first column of `lightTable`
        for (let rowIndex = 1; rowIndex < domainSize + 1; rowIndex++) {
          const keyElement = cayleyMatrix.item(rowIndex, keyElementIndex)

          lightTable.setItem(rowIndex, 0, keyElement)
        }

        // Compare the rows of `lightTable` to the appropriate rows from `cayleyMatrix`
        for (let rowIndex = 1; rowIndex < domainSize + 1; rowIndex++) {
          const cayleyIndex = lightTable.item(rowIndex, 0).value

          for (let columnIndex = 1; columnIndex < domainSize + 1; columnIndex++) {
            const value1 = lightTable.item(rowIndex, columnIndex).value
            const value2 = cayleyMatrix.item(cayleyIndex, columnIndex).value

            if (value1 !== value2) {
              this.functionProperties[FiniteBinaryOperationPropertyKeys.Associativity] = false
              return false
            }
          }
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.Associativity] = true
      return true
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Associativity]
  }
}
