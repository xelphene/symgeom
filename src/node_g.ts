
import {
    Point, Line, UnitVector
} from 'octogeom'
import {
    PointReturningFunction, NumberReturningFunction,
    XNode, PointNode, NumberNode
} from './iface'
import {geomfunc} from './geomfunc'

//function nodeArraysEqual( a:BaseNode[], b:BaseNode[] ): boolean
function nodeArraysEqual( a:BaseNode[], b:BaseNode[] ): boolean
{
    if( a.length != b.length ) return false
    const indexes = Array.from(a, (v,i) => i)
    for( let i of indexes )
        if( ! a[i].equals(b[i]) )
            return false
    return true
}

///////////////////////////////////////////

export function isNumber( v: number | Point ): v is number {
    return typeof v == 'number'
}

export function isPoint( v: number | Point ): v is Point {
    return v instanceof Point
}

export function isUnitVector( v: number | UnitVector ): v is UnitVector {
    return v instanceof UnitVector
}

export function isBaseNodeArray( v: any | BaseNode[] ): v is BaseNode[] {
    return Array.isArray(v)
        && v.map( v => v instanceof BaseNode).reduce( (a,b) => a && b )
}

///////////////////////////////

abstract class ValueGetter<T> {
    abstract compute( input:Map<string,any> ): T;
    abstract equals(  other:ValueGetter<T> ): boolean;
}

class InputValueGetter<T> extends ValueGetter<T> {
    inputKey:string
    node:ValueNode<T>

    constructor( node: ValueNode<T>, inputKey: string ) {
        super()
        this.node = node
        this.inputKey = inputKey
    }
    
    compute( input:Map<string,any> ): T {
        const v = input.get(this.inputKey)
        if( v !== undefined ) {
            if(this. node.isMyType(v) )
                return v
            else
                throw new Error(`input ${this.inputKey} has incorrect type`)
        } else
            throw new Error(`no input with key ${this.inputKey}`)
    }

    equals( other:ValueGetter<T> ): boolean {
        if( other instanceof InputValueGetter )
            return this.inputKey == other.inputKey
        return false
    }
}

class FuncValueGetter<T> extends ValueGetter<T> {
    bindings: (BaseNode)[]
    func: (...args: any[]) => T
    node:ValueNode<T>
    
    constructor( node: ValueNode<T>, func:(...args: any[]) => T, bindings:BaseNode[] ) {
        super()
        this.node = node
        this.func = func
        this.bindings = bindings
    }
    
    compute( input:Map<string,any> ): T {
        const args = this.bindings.map( n => n.compute(input) )
        const rv = this.func.apply(null, args)
        return rv
    }
    
    equals( other:ValueGetter<T> ): boolean {
        if( other instanceof FuncValueGetter )
            return other.func === this.func
                && nodeArraysEqual(this.bindings, other.bindings)
        return false
    }
}

////////////////////////////////////////////////

export abstract class BaseNode
{
    abstract compute( input:Map<string,any> ): any
    abstract equals(  other:BaseNode ): boolean
}

abstract class ValueNode<T> extends BaseNode {
    vg: ValueGetter<T>

    abstract isMyType: ( v: any ) => v is T

    constructor(
        keyOrFunc: string | ((...args: any[]) => T),
        bindings?: BaseNode[]
    ) {
        super()

        if( typeof keyOrFunc=='string' ) {
            this.vg = new InputValueGetter<T>( this, keyOrFunc )
        } else {
            if( bindings===undefined )
                bindings = []
            this.vg = new FuncValueGetter<T>( this, keyOrFunc, bindings )
        }
    }
    
    compute( input:Map<string,any> ): T {
        return this.vg.compute(input)
    }

    equals( other:BaseNode ): boolean {
        if( other instanceof ValueNode )
            return this.vg.equals( other.vg )
        else
            return false
    }
    
    abstract remake(
        keyOrFunc: string | ((...args: any[]) => T),
        bindings?: BaseNode[]
    ): ValueNode<T>
    
    map(  func:(...args: any[]) => T ): ValueNode<T> {
        if( 'bindings' in func && isBaseNodeArray(func.bindings) ) {
            return this.remake( func, func.bindings.concat([this]) )
        } else
            return this.remake( func, [this] )
    }
    
}

export class NumberValueNode extends ValueNode<number> implements NumberNode
{
    isMyType: ( v: number | Point ) => v is number = isNumber

    remake(
        keyOrFunc: string | ((...args: any[]) => number),
        bindings?: BaseNode[]
    ): NumberValueNode {
        return new NumberValueNode(keyOrFunc, bindings)
    }

    //apply(  func:(...args: any[]) => number, bindings:BaseNode[] ): NumberValueNode {
    //    return new NumberValueNode( func, args )
    //}

    guard(  func:Function, bindings:BaseNode[] ): NumberValueNode {
        const guardedFunc = (...args: any[]): number => {
            const rv = func.apply(null, args)
            if( this.isMyType(rv) )
                return rv
            else
                throw new TypeError(`compute function returned incorrect type`)
        }
        return new NumberValueNode( guardedFunc, bindings )
    }
}

export class UnitVectorValueNode extends ValueNode<UnitVector>
{
    isMyType: ( v: number | UnitVector ) => v is UnitVector = isUnitVector

    remake(
        keyOrFunc: string | ((...args: any[]) => UnitVector),
        bindings?: BaseNode[]
    ): UnitVectorValueNode {
        return new UnitVectorValueNode(keyOrFunc, bindings)
    }

    //apply(  func:(...args: any[]) => UnitVector, bindings:BaseNode[] ): UnitVectorValueNode {
    //    return new UnitVectorValueNode( func, bindings )
    //}
    
    rotate90ccw(): UnitVectorValueNode {
        return new UnitVectorValueNode( geomfunc.unitVector.rotate90ccw, [this] )
    }
}

export class PointValueNode extends ValueNode<Point> implements PointNode
{
    isMyType: ( v: number | Point ) => v is Point = isPoint

    remake(
        keyOrFunc: string | ((...args: any[]) => Point),
        bindings?: BaseNode[]
    ): PointValueNode {
        return new PointValueNode(keyOrFunc, bindings)
    }
    
    //apply(  func:(...args: any[]) => Point, bindings:BaseNode[] ): PointValueNode {
    //    return new PointValueNode( func, bindings )
    //}
    
    xlateUp( n:NumberValueNode ): PointValueNode {
        return new PointValueNode( geomfunc.point.xlateUp, [this, n] )
    }
    
    ymirror(): PointValueNode {
        return new PointValueNode( geomfunc.point.ymirror, [this] )
    }
    
    xlateUnitVector( dir:UnitVectorValueNode, dist:NumberValueNode ): PointValueNode {
        return new PointValueNode( geomfunc.point.xlateUnitVector, [this, dir, dist])
    }
}

/*
export class LineValueNode extends ValueNode<Line> implements LineNode
{
    isMyType: ( v: number | Line ) => v is Line = isLine
    
    apply(  func:(...args: any[]) => Line, bindings:BaseNode[] ): LineValueNode {
        return new LineValueNode( func, bindings )
    }
}
*/

export class LineSimpleNode extends BaseNode {
    start:PointValueNode
    end:PointValueNode
    constructor( start:PointValueNode, end:PointValueNode ) {
        super()
        this.start = start
        this.end = end
    }

    compute( input:Map<string,any> ): Line {
        return new Line( this.start.compute(input), this.end.compute(input) )
    }
    
    equals(  other:BaseNode ): boolean {
        if( other instanceof LineSimpleNode )
            return this.start.equals(other.start)
                && this.end.equals(other.end)
        else
            return false
    }
    
    ymirror(): LineSimpleNode {
        return new LineSimpleNode(
            this.start.ymirror(),
            this.end.ymirror()
        )
    }
    
    toUnitVector(): UnitVectorValueNode {
        return new UnitVectorValueNode(
            geomfunc.line.toUnitVector,
            [this]
        )
    }

    xlateUnitVector( dir:UnitVectorValueNode, dist:NumberValueNode ): LineSimpleNode {
        return new LineSimpleNode(
            this.start.xlateUnitVector(dir,dist),
            this.end.xlateUnitVector(dir,dist)
        )
    }
}

