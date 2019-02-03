import { FiniteBinaryOperation } from "../../../../common/functions"
import { IntegerNumber } from "../../../../common/numbers"
import { FiniteSet } from "../../../../common/sets"
import { FiniteGroup } from "../../structures/Group"
import { ZmodNAdditionMap, ZmodNMultiplicationMap } from "../maps"

/**
 * Returns the ZmodN group of order `n` with addition.
 * @param n The order of the group
 */
export function ZmodNAdditionGroup(n: number): FiniteGroup<IntegerNumber> {
  const rawValues: number[] = Array.from(Array(n).keys())
  const set = new FiniteSet<IntegerNumber>(rawValues.map(x => new IntegerNumber(x)))
  const operation = new FiniteBinaryOperation(set, new ZmodNAdditionMap(new IntegerNumber(n)))

  return new FiniteGroup(set, operation)
}

/**
 * Returns the ZmodN group of order `n` with multiplication.
 * @param n The order of the group
 */
export function ZmodNMultiplicationGroup(n: number): FiniteGroup<IntegerNumber> {
  const rawValues: number[] = Array.from(Array(n).keys())
  const set = new FiniteSet<IntegerNumber>(rawValues.map(x => new IntegerNumber(x)))
  const operation = new FiniteBinaryOperation(set, new ZmodNMultiplicationMap(new IntegerNumber(n)))

  return new FiniteGroup(set, operation)
}
