
export function isNumber( v: number | any ): v is number {
    return typeof v == 'number'
}

export function isPoint( v: Point | any ): v is Point {
    return v instanceof Point
}

export function isUnitVector( v: UnitVector | any ): v is UnitVector {
    return v instanceof UnitVector
}

export function isBaseNodeArray( v: BaseNode[] | any ): v is BaseNode[] {
    return Array.isArray(v)
        && v.map( v => v instanceof BaseNode).reduce( (a,b) => a && b )
}
