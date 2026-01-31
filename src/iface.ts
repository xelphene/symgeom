
import {Point} from 'octogeom'
import {BoundPointFunc, BoundNumberFunc} from './bind'
/*
interface Line {
    start: Point
    end: Point
}

interface UnitVector {
    x: number
    y: number
}
*/

///////////

export type XNode = (NumberNode | PointNode)

export type PointReturningFunction = (...args: any[]) => Point
export type NumberReturningFunction = (...args: any[]) => number

export interface NumberNode {
    map( BoundNumberFunc ): NumberNode
    compute( input:Map<string,any> ): number
    equals( node:XNode ): boolean
}

type PointMapFunction = (Point) => Point

export interface PointNode {
    // a PointInputNode won't have these
    // but it could create them on demand...
    //x: NumberNode
    //y: NumberNode
    
    //map( BoundPointFunc ): PointNode
    //equals( node:XNode ): boolean
    //compute( input:Map<string,any> ): Point

    // once I moved map() into ValueNode<T>, these broke. I don't
    // really understand why. 
    // exception is something to do with the return type on map being ValueNode<T>
    //ymirror(): PointNode
    //xlateUp( n:NumberNode ): PointNode
    //xlateUnitVector( dir:UnitVectorNode, dist:NumberNode ): PointNode
    //lineTo( end:PointNode ): LineNode
}

/*
interface UnitVectorNode extends XNode {
    x: NumberNode
    y: NumberNode

    compute( input:Map<string,any> ): UnitVector
    equals( node:XNode ): boolean

    rotate90ccw(): UnitVectorNode
}

interface LineNode extends XNode {
    start: PointNode
    end: PointNode

    compute( input:Map<string,any> ): Line
    equals( node:XNode ): boolean
    
    ymirror(): LineNode
    xlateUp( n:NumberNode ): LineNode
    toUnitVector(): UnitVectorNode
    xlateUnitVector( dir:UnitVectorNode, dist:NumberNode ): LineNode
}
*/
