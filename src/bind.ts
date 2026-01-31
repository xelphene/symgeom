
import {PointReturningFunction, NumberReturningFunction} from '../src/iface'
import {
    Point, Line, UnitVector
} from 'octogeom'
import {BaseNode} from './node_g'
import {isPoint, isNumber, guardPoint, guardNumber} from './guard'

export type BoundPointFunc = {
    bindings: BaseNode[],
    func: (...args: any[]) => Point
}

export type BoundNumberFunc = {
    bindings: BaseNode[],
    func: (...args: any[]) => number
}

type BoundFunc = (BoundPointFunc | BoundNumberFunc)

export function bindPoint( bindings:BaseNode[], func:Function ):
    BoundPointFunc
{
    return {func:guardPoint(func), bindings}
}

export function bindNumber( bindings:BaseNode[], func:Function ):
    BoundNumberFunc
{
    return {func:guardNumber(func), bindings}
}
