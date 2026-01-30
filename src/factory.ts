
const og = require('octogeom')

function xlateUp (pt, len) {  return pt.xlateUp(len) }
function ymirror (pt) { return pt.ymirror() }
function xlateAngular (pt, angle, distance) { return pt.xlateAngular(angle,distance) }
function toUnitVector (line) { return line.toUnitVector() }

abstract class VNode {
    abstract map    (func:Function, bindings:VNode[]): VNode;
    abstract equals (other:VNode): boolean;
    abstract pEval  (input:Map<string,any>): any;
}

abstract class VNumber extends VNode {
    map( func:Function, bindings:VNode[] ): FuncNumber {
        return new FuncNumber(func, bindings)
    }
}

export class FuncNumber extends VNumber {
    func: Function
    bindings: VNode[]
    
    constructor( func:Function, bindings:VNode[] ) {
        super()
        this.func = func
        this.bindings = bindings
    }
    
    pEval( input:Map<string,any> ): any {
        const args = this.bindings.map( b => b.pEval(input) )
        return this.func.apply(null, args)
    }
    
    equals( other:VNode ): boolean {
        if( ! (other instanceof FuncNumber) ) return false
        return other.func === this.func
            && nodeArraysEqual(this.bindings, other.bindings)
    }
}

abstract class Point extends VNode {
    map( func:Function, bindings:VNode[] ): FuncPoint {
        return new FuncPoint(func, bindings)
    }

    ymirror (): Point {
        return this.map( ymirror, [this] )
    }
    
    xlateUp ( dy:VNumber ): Point {
        return this.map( xlateUp, [this, dy] )
    }
    
}

function nodeArraysEqual( a:VNode[], b:VNode[] )
{
    if( a.length != b.length ) return false
    const indexes = Array.from(a, (v,i) => i)
    for( let i of indexes )
        if( ! a[i].equals(b[i]) )
            return false
    return true
}

export class FuncPoint extends Point
{
    func: Function
    bindings: VNode[]
    
    constructor( func:Function, bindings:VNode[] ) {
        super()
        this.func = func
        this.bindings = bindings
    }
    
    pEval( input:Map<string,any> ): any {
        const args = this.bindings.map( b => b.pEval(input) )
        return this.func.apply(null, args)
    }
    
    equals( other:VNode ): boolean {
        if( ! (other instanceof FuncPoint) ) return false
        //if( ! (other instanceof this.constructor) ) return false
        return other.func === this.func
            && nodeArraysEqual(this.bindings, other.bindings)
    }
}

export class InputPoint extends Point {
    inputKey:string
    
    constructor( inputKey:string ) {
        super()
        this.inputKey = inputKey
    }
    
    pEval( input:Map<string,any> ): any {
        if( ! input.has(this.inputKey) )
            throw new Error(`input ${this.inputKey} missing`)
        return new og.Point( input.get(this.inputKey) )
    }
    
    equals( other:Point ) {
        return (
            other instanceof InputPoint
            && other.inputKey == this.inputKey
        )
    }
}

export class Line {
    start:Point
    end:Point
    
    constructor( start:Point, end:Point ) {
        this.start = start
        this.end = end
    }

    //map( func:Function, bindings:Point[] ): Line {}

    ymirror (): Line {
        return new Line( this.start.ymirror(), this.end.ymirror() )
    }
    
    equals (other:Line): boolean {
        return this.start.equals( other.start )
            && this.end.equals( other.end )
    }
    
    pEval( input:Map<string,any> ): any {
        return new og.Line(this.start.pEval(input), this.end.pEval(input))
    }
}

class FuncLine {
    
}
