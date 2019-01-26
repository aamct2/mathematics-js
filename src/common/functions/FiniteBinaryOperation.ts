import { SquareMatrix } from "../../algebra/SquareMatrix"
import { RealNumber } from "../RealNumber"
import { FiniteSet } from "../sets/FiniteSet"
import { Tuple } from "../sets/Tuple"
import { FiniteFunction } from "./FiniteFunction"

enum FiniteBinaryOperationPropertyKeys {
  Associativity = "associativity",
  CayleyTable = "cayley table",
  Commutivity = "commutivity",
  Idempotent = "idempotent",
  Identity = "identity",
}

export class FiniteBinaryOperation<T extends IEquatable<T>> extends FiniteFunction<Tuple, T> {
  private cayleyTable: number[][] = []
  private identityElement?: T

  public get identity(): T | undefined {
    // First check to see if there is one and generate it along the way
    this.hasIdentity()

    return this.identityElement
  }

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

  public hasIdentity(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Idempotent in this.functionProperties)) {
      const domainSize = this.codomain.cardinality()

      for (let lhsIndex = 0; lhsIndex < domainSize; lhsIndex++) {
        const lhs = this.codomain.element(lhsIndex)

        let same = true

        InnerLoop: for (let rhsIndex = 0; rhsIndex < domainSize; rhsIndex++) {
          const rhs = this.codomain.element(rhsIndex)

          const tuple1 = new Tuple(2, [lhs, rhs])
          if (!rhs.isEqualTo(this.applyMap(tuple1))) {
            same = false
            break InnerLoop
          }

          const tuple2 = new Tuple(2, [rhs, lhs])
          if (!rhs.isEqualTo(this.applyMap(tuple2))) {
            same = false
            break InnerLoop
          }
        }

        if (same) {
          // We found the identity element!

          this.functionProperties[FiniteBinaryOperationPropertyKeys.Identity] = true
          this.identityElement = lhs

          return true
        }
      }

      // There is no identity element for this operation
      this.functionProperties[FiniteBinaryOperationPropertyKeys.Identity] = false
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Identity]
  }

  /**
   * Determines if the operation is associative. In other words, `(a + b) + c = a + (b + c)` for all `a`, `b`, and `c`. Uses Light's algorithm for testing associativity.
   */
  public isAssociative(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Associativity in this.functionProperties)) {
      const domainSize = this.codomain.cardinality()

      const lightTable = new SquareMatrix(domainSize + 1, RealNumber)

      const originalTable = this.cayleyTableGeneric()
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

  /**
   * Determines if the operation is commutative. In other words, `a + b = b + a` for all `a` and `b`.
   */
  public isCommutative(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Commutivity in this.functionProperties)) {
      const domainSize = this.codomain.cardinality()

      for (let index1 = 0; index1 < domainSize; index1++) {
        const element1 = this.codomain.element(index1)

        for (let index2 = 0; index2 < domainSize; index2++) {
          const element2 = this.codomain.element(index2)

          const tuple1 = new Tuple(2, [element1, element2])
          const tuple2 = new Tuple(2, [element2, element1])

          const lhs = this.applyMap(tuple1)
          const rhs = this.applyMap(tuple2)

          if (lhs.isEqualTo(rhs) === false) {
            this.functionProperties[FiniteBinaryOperationPropertyKeys.Commutivity] = false
            return false
          }
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.Commutivity] = true
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Commutivity]
  }

  /**
   * Determines if the operation is idempotent. In other words `a + a = a` for all `a`.
   */
  public isIdempotent(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Idempotent in this.functionProperties)) {
      for (let index = 0; index < this.codomain.cardinality(); index++) {
        const element = this.codomain.element(index)
        const tuple = new Tuple(2, [element, element])

        if (this.applyMap(tuple).isEqualTo(element) === false) {
          this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent] = false
          return false
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent] = true
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent]
  }
}
