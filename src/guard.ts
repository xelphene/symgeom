
import {
    Point, Line, UnitVector
} from 'octogeom'

export function isNumber( v: number | any ): v is number {
    return typeof v == 'number'
}

export function isPoint( v: Point | any ): v is Point {
    return v instanceof Point
}

export function isUnitVector( v: UnitVector | any ): v is UnitVector {
    return v instanceof UnitVector
}

export function guardPoint( func:Function ): (...args: any[]) => Point
{
    function guardedFunc (...args: any[]): Point {
        const rv = func.apply(null, args)
        if( isPoint(rv) )
            return rv
        else
            throw new TypeError(`map function returned incorrect type`)
    }
    return guardedFunc
}

export function guardNumber( func:Function ): (...args: any[]) => number
{
    function guardedFunc (...args: any[]): number {
        const rv = func.apply(null, args)
        if( isNumber(rv) )
            return rv
        else
            throw new TypeError(`map function returned incorrect type`)
    }
    return guardedFunc
}
