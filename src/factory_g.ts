
const og = require('octogeom')

function xlateUp (pt, len) {  return pt.xlateUp(len) }
function ymirror (pt) { return pt.ymirror() }
function xlateAngular (pt, angle, distance) { return pt.xlateAngular(angle,distance) }
function toUnitVector (line) { return line.toUnitVector() }

export class Point {
    x:number
    y:number
    
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}

function isPoint( v:any ): v is Point {
    return (v as Point) instanceof Point
}

abstract class VNode<T> {
    abstract compute( input:Map<string,any> ): T;
}

abstract class InputNode<T> extends VNode<T> {
    inputKey: string
    
    constructor(inputKey) {
        super()
        this.inputKey = inputKey
    }

    abstract canBeMine( v:any ): boolean;
    
    compute( input:Map<string,any> ): T {
        const v:any = input.get(this.inputKey)
        if( this.canBeMine(v) )
            return v
        else
            throw new Error(`invalid input for ${this.inputKey}`)
    }
}

/////////////////////////////////////////////////

export class PointInput extends InputNode<Point> {
    canBeMine( v:any ): boolean { return v instanceof Point }
}

//export type PointInput = Input<Point>

