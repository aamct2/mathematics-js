import * as _ from "lodash"
import { SquareMatrix } from "../../algebra/SquareMatrix"
import { IEquatable } from "../interfaces"
import { RealNumber } from "../numbers"
import { FiniteSet, Tuple } from "../sets"
import { FiniteFunction, FunctionPropertiesKeys } from "./FiniteFunction"
import { IMap } from "./Map"

export enum FiniteBinaryOperationPropertyKeys {
  Associativity = "associativity",
  CayleyTable = "cayley table",
  Commutivity = "commutivity",
  Idempotent = "idempotent",
  Identity = "identity",
  Inverses = "inverses",
}

export class FiniteBinaryOperation<T extends IEquatable<T>> extends FiniteFunction<Tuple, T> {
  public get identity(): T | undefined {
    // First check to see if there is one and generate it along the way
    this.hasIdentity()

    return this.identityElement
  }

  /**
   * Constructors a new `FiniteBinaryOperation` and injects into it known properties.
   * @param codomain The codomain of the new operation.
   * @param relation The relation of the new operation.
   * @param knownProperties The known properties of the new operation.
   */
  public static KnownFiniteBinaryOperation<G extends IEquatable<G>>(
    codomain: FiniteSet<G>,
    relation: IMap<Tuple, G>,
    knownProperties: { [key: string]: boolean }
  ): FiniteBinaryOperation<G> {
    const newOperation = new FiniteBinaryOperation(codomain, relation)

    newOperation.functionProperties = knownProperties

    return newOperation
  }

  private cayleyTable: number[][] = []
  private identityElement?: T

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
          const tuple = new Tuple([firstElement, secondElement])
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

          const tuple1 = new Tuple([lhs, rhs])
          if (!rhs.isEqualTo(this.applyMap(tuple1))) {
            same = false
            break InnerLoop
          }

          const tuple2 = new Tuple([rhs, lhs])
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
   * Determines if the operation has inverses for all elements in the domain. In other words there exists an `i` such that for all `a`, `a + i = i + a = e`.
   */
  public hasInverses(): boolean {
    if (!(FiniteBinaryOperationPropertyKeys.Inverses in this.functionProperties)) {
      // First check to see if there's an identity element
      if (!this.hasIdentity()) {
        this.functionProperties[FiniteBinaryOperationPropertyKeys.Inverses] = false
        return false
      }

      const testSet = _.cloneDeep(this.codomain)
      const identityElement: T = this.identityElement!

      // The identity element is its own inverse, so we don't need to check it
      testSet.deleteElement(testSet.indexOf(identityElement))

      while (testSet.cardinality() > 0) {
        const firstElement = testSet.element(0)
        let same = true
        let index = 0

        InnerLoop: for (index = 0; index < testSet.cardinality(); index++) {
          const testElement = testSet.element(index)
          same = true

          const tuple1 = new Tuple([firstElement, testElement])
          if (!identityElement.isEqualTo(this.applyMap(tuple1))) {
            same = false
          }

          const tuple2 = new Tuple([testElement, firstElement])
          if (same && !identityElement.isEqualTo(this.applyMap(tuple2))) {
            same = false
          }

          if (same) {
            break InnerLoop
          }
        }

        if (!same) {
          this.functionProperties[FiniteBinaryOperationPropertyKeys.Inverses] = false
          return false
        } else {
          // We found a pair, so remove them and keep on chugging
          if (index === 0) {
            // It is its own inverse
            testSet.deleteElement(0)
          } else {
            testSet.deleteElement(index)
            testSet.deleteElement(0)
          }
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.Inverses] = true
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Inverses]
  }

  /**
   * Returns the inverse of the element. In other words, given `a` this function returns `b` such that `a + b = b + a = e`.
   * @param input The element for which to find its inverse.
   */
  public inverseElement(input: T): T {
    if (!this.hasIdentity()) {
      throw new Error("This operation does not have an identity element.")
    }

    const identityElement: T = this.identityElement!

    for (let index = 0; index < this.codomain.cardinality(); index++) {
      const secondElement = this.codomain.element(index)

      const tuple1 = new Tuple([input, secondElement])
      const tuple2 = new Tuple([secondElement, input])

      if (this.applyMap(tuple1).isEqualTo(identityElement) && this.applyMap(tuple2).isEqualTo(identityElement)) {
        return secondElement
      }
    }

    throw new Error("This element does not have an inverse.")
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

          const tuple1 = new Tuple([element1, element2])
          const tuple2 = new Tuple([element2, element1])

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
        const tuple = new Tuple([element, element])

        if (this.applyMap(tuple).isEqualTo(element) === false) {
          this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent] = false
          return false
        }
      }

      this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent] = true
    }

    return this.functionProperties[FiniteBinaryOperationPropertyKeys.Idempotent]
  }

  /**
   * Returns the restriction of this operation.
   * @param newCodomain The codomain of the new restricted operation. Note that it must be a subset of this operation's codomain.
   */
  public restriction(newCodomain: FiniteSet<T>): FiniteBinaryOperation<T> {
    if (!newCodomain.isSubsetOf(this.codomain)) {
      throw new Error("The `newCodomain` is not a subset of this operation's Codomain.")
    }

    const newOperation = new FiniteBinaryOperation(newCodomain, this.relation)

    function checkAndAddProperty(property: string, containingOperation: FiniteBinaryOperation<T>) {
      if (property in containingOperation.functionProperties) {
        if (containingOperation.functionProperties[property]) {
          newOperation.functionProperties[property] = true
        }
      }
    }

    // Restriction of a injective function is still injective
    checkAndAddProperty(FunctionPropertiesKeys.Injective, this)

    // Restriction of an associative operation is still associative
    checkAndAddProperty(FiniteBinaryOperationPropertyKeys.Associativity, this)

    // Restriction of an commutative operation is still commutative
    checkAndAddProperty(FiniteBinaryOperationPropertyKeys.Commutivity, this)

    // Restriction of an idempotent operation is still idempotent
    checkAndAddProperty(FiniteBinaryOperationPropertyKeys.Idempotent, this)

    // Check to see if it has an identity
    if (FiniteBinaryOperationPropertyKeys.Identity in this.functionProperties) {
      if (this.functionProperties[FiniteBinaryOperationPropertyKeys.Identity]) {
        const identityElement: T = this.identityElement!

        if (newCodomain.contains(identityElement)) {
          newOperation.identityElement = identityElement
          newOperation.functionProperties[FiniteBinaryOperationPropertyKeys.Identity] = true
        } else {
          newOperation.functionProperties[FiniteBinaryOperationPropertyKeys.Identity] = false
        }
      }
    }

    return newOperation
  }
}
