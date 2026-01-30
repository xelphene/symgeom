
import {Point} from 'octogeom'
import {
    PointReturningFunction, NumberReturningFunction,
    XNode, PointNode, NumberNode
} from './iface'
import {geomfunc} from './geomfunc'

function nodeArraysEqual( a:XNode[], b:XNode[] ): boolean
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

function makeInputCompute (key) {
    return 
}

abstract class BaseNode
{
    abstract compute( input:Map<string,any> ): any
}

const INPUT = Symbol('INPUT')

abstract class ValueGetter<T> {
    abstract compute( input:Map<string,any> ): T;
}

///////////////////////////////

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
}

////////////////////////////////////////////////

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
}

/*
//////////////////////////////////////////////
// combination of old Compute and InputNode
abstract class ValueNode_OLD<T> extends BaseNode
{
    bindings: (BaseNode | typeof INPUT)[]
    func: (...args: any[]) => T
    _inputKey: string
    // a constructor
    //static input( key:string ): ValueNode<T> {
    //    const cf = (input:Map<string,any>): T => {
    //        
    //    }
    //}
    
    abstract isMyType: ( v: any ) => v is T
    
    constructor( func:(...args: any[]) => T, bindings:BaseNode[] ) {
        super()
        this.func = func
        this.bindings = bindings
        this._inputKey = 'dy'
    }

    _computeFromInput( input:Map<string,any> ): T {
        const v = input.get(this._inputKey)
        if( v !== undefined ) {
            if( this.isMyType(v) )
                return v
            else
                throw new Error(`input ${this._inputKey} has incorrect type`)
        } else
            throw new Error(`no input with key ${this._inputKey}`)
    }
    
    compute( input:Map<string,any> ): T {
        const args = this.bindings.map( n => n===INPUT ? input : n.compute(input) )
        const rv = this.func.apply(null, [])
        return rv
    }
    
    wtf () {
        console.log( this.constructor )
        const C = this.constructor
        console.log( this.constructor === PointValueNode )
    }
    
    abstract apply(  func:(...args: any[]) => T, bindings:BaseNode[] ): ValueNode<T>;
}
*/

class NumberValueNode extends ValueNode<number> 
{
    isMyType: ( v: number | Point ) => v is number = isNumber
/*    
    static makeInput( inputKey:string ): NumberValueNode {
        function computeFromInput( input:Map<string,any> ): number {
            console.log('num')
            console.log(input)
            const v = input.get(inputKey)
            if( v !== undefined ) {
                if( typeof v == 'number' )
                    return v
                else
                    throw new Error(`input ${this.inputKey} has incorrect type`)
            } else
                throw new Error(`no input with key ${this.inputKey}`)
        }
        return new NumberValueNode( computeFromInput, [] )
    }

*/
    apply(  func:(...args: any[]) => number, bindings:BaseNode[] ): NumberValueNode {
        return new NumberValueNode( func, bindings )
    }
}

class PointValueNode extends ValueNode<Point>
{
    isMyType: ( v: number | Point ) => v is Point = isPoint
    
    apply(  func:(...args: any[]) => Point, bindings:BaseNode[] ): PointValueNode {
        return new PointValueNode( func, bindings )
    }

    xlateUp( n:NumberValueNode ): PointValueNode {
        return this.apply( geomfunc.point.xlateUp, [this, n] )
    }
}

/*
function makePointInput( inputKey:string): PointValueNode {
    function computeFromInput( input:Map<string,any> ): Point {
        console.log('point')
        console.log( input )
        const v = input.get(inputKey)
        console.log(v)
        if( v !== undefined ) {
            if( v instanceof Point )
                return v
            else
                throw new Error(`input ${this.inputKey} has incorrect type`)
        } else
            throw new Error(`no input with key ${this.inputKey}`)
    }
    return new PointValueNode( computeFromInput, [] )
}
*/

function main () 
{
    const dy = new NumberValueNode('dy')
    const ipt = new PointValueNode('ipt')
    const dpt = ipt.xlateUp(dy)
    
    var input = new Map<string,any>()
    input.set('dy', 10)
    input.set('ipt', new Point(2,2))

    console.log( dy.compute(input) )
    console.log( ipt.compute(input) )
    console.log( dpt.compute(input) )
}

if( require.main === module )
    main()
