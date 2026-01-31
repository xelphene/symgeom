
import {PointReturningFunction, NumberReturningFunction} from '../src/iface'
import {
    Point, Line, UnitVector
} from 'octogeom'
import {BaseNode} from './node_g'
import {isPoint, isNumber, guardPoint, guardNumber} from './guard'

export function bindPoint( bindings:BaseNode[], func:Function ):
    PointReturningFunction
{
    const guardedFunc = (...args: any[]): Point => 
    {
        const rv = func.apply(null, args)
        if( isPoint(rv) )
            return rv
        else
            throw new TypeError(`map function returned incorrect type`)
    }
    guardedFunc.bindings = bindings
    return guardedFunc
}

export function bindNumber( bindings:BaseNode[], func:Function ):
    NumberReturningFunction
{
    const guardedFunc = (...args: any[]): number => 
    {
        const rv = func.apply(null, args)
        if( isNumber(rv) )
            return rv
        else
            throw new TypeError(`map function returned incorrect type`)
    }
    guardedFunc.bindings = bindings
    return guardedFunc
}
