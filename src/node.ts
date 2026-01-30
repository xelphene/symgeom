
import {Point} from 'octogeom'
import {
    PointReturningFunction, NumberReturningFunction,
    XNode, PointNode, NumberNode
} from './iface'
import {geomfunc} from './geomfunc'

abstract class BaseNumberNode implements NumberNode {
    abstract compute( input:Map<string,any> ): number
    
    apply( func:NumberReturningFunction, bindings:XNode[] ): NumberNode {
        return new NumberComputeNode( func, bindings )
    }
    
    // TODO
    equals( node:XNode ): boolean { return false }    
}

export class NumberInputNode extends BaseNumberNode {
    inputKey:string
    
    constructor( inputKey:string ) {
        super()
        this.inputKey = inputKey
    }

    compute( input:Map<string,any> ): number {
        const v = input.get(this.inputKey)
        if( v !== undefined ) {
            if( typeof v == "number" )
                return v
            else
                throw new Error(`input ${this.inputKey} has incorrect type`)
        } else
            throw new Error(`no input with key ${this.inputKey}`)
    }

    equals( node:XNode ): boolean {
        return node instanceof NumberInputNode
            && node.inputKey == this.inputKey
    }

}

export class NumberComputeNode extends BaseNumberNode {
    func: NumberReturningFunction
    bindings: XNode[]
    
    constructor( func:NumberReturningFunction, bindings:XNode[] ) {
        super()
        this.func = func
        this.bindings = bindings
    }
    
    compute( input:Map<string,any> ): number {
        const args = this.bindings.map( xn => xn.compute(input) )
        const rv = this.func.apply(null, args)
        return rv
    }
    
    // TODO
    equals( node:XNode ): boolean { return false }
}

function nodeArraysEqual( a:XNode[], b:XNode[] ): boolean
{
    if( a.length != b.length ) return false
    const indexes = Array.from(a, (v,i) => i)
    for( let i of indexes )
        if( ! a[i].equals(b[i]) )
            return false
    return true
}

abstract class BasePointNode implements PointNode 
{
    abstract compute( input:Map<string,any> ): Point

    apply(  func:PointReturningFunction, bindings:XNode[] ): PointNode {
        return new PointComputeNode( func, bindings )
    }
    
    xlateUp( n:NumberNode ): PointNode {
        return this.apply( geomfunc.point.xlateUp, [this, n] )
    }

    abstract equals( node:XNode )
}

export class PointInputNode extends BasePointNode {
    inputKey:string
    
    constructor( inputKey:string ) {
        super()
        this.inputKey = inputKey
    }
    
    compute( input:Map<string,any> ): Point {
        const v = input.get(this.inputKey)
        if( v !== undefined ) {
            if( v instanceof Point )
                return v
            else
                throw new Error(`input ${this.inputKey} has incorrect type`)
        } else
            throw new Error(`no input with key ${this.inputKey}`)
    }

    equals( node:XNode ): boolean {
        return node instanceof PointInputNode
            && node.inputKey == this.inputKey
    }
    //ymirror(): PointNode
}

export class PointComputeNode extends BasePointNode {
    func: PointReturningFunction
    bindings: XNode[]
    
    constructor( func:PointReturningFunction, bindings:XNode[] ) {
        super()
        this.func = func
        this.bindings = bindings
    }
    
    compute( input:Map<string,any> ): Point {
        const args = this.bindings.map( xn => xn.compute(input) )
        const rv = this.func.apply(null, args)
        return rv
    }

    equals( other:XNode ): boolean {
        if( other instanceof PointComputeNode ) {
            return other.func === this.func
                && nodeArraysEqual(this.bindings, other.bindings)
        } else
            return false
    }
}
