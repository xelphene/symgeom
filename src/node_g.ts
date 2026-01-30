
import {Point} from 'octogeom'
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

function isNumber( v: number | Point ): v is number {
    return typeof v == 'number'
}

function isPoint( v: number | Point ): v is Point {
    return v instanceof Point
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

abstract class BaseNode
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
                throw new Error('wtf')
            else
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
}

export class NumberValueNode extends ValueNode<number> implements NumberNode
{
    isMyType: ( v: number | Point ) => v is number = isNumber

    apply(  func:(...args: any[]) => number, bindings:BaseNode[] ): NumberValueNode {
        return new NumberValueNode( func, bindings )
    }
}

export class PointValueNode extends ValueNode<Point> implements PointNode
{
    isMyType: ( v: number | Point ) => v is Point = isPoint
    
    apply(  func:(...args: any[]) => Point, bindings:BaseNode[] ): PointValueNode {
        return new PointValueNode( func, bindings )
    }

    xlateUp( n:NumberValueNode ): PointValueNode {
        return this.apply( geomfunc.point.xlateUp, [this, n] )
    }
}

