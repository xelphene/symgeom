
import {Point} from 'octogeom'
import {
    NumberValueNode, PointValueNode, LineSimpleNode
} from '../src/node_g'

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
    
    console.log( dpt.equals(ipt.xlateUp(dy)) ) // true
    console.log( dpt.equals(dy) ) // false 
}

function main2 ()
{
    const start = new PointValueNode('start')
    const end = new PointValueNode('end')
    const saWidth = new NumberValueNode('saWidth')
    const end_ = end.ymirror()
    const line = new LineSimpleNode(start, end)
    const line_ = line.ymirror()
    const saLine = line.xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )

    var input = new Map<string,any>()
    input.set('start', new Point(3, 20))
    input.set('end',   new Point(5, 17))
    input.set('saWidth', 0.5)

    console.log( '== line:')
    console.log( end_.compute(input) )
    console.log( line.compute(input) )
    console.log( line_.compute(input) )
    
    console.log( line_.end.equals(end_) ) // true

    console.log('== UV')
    
    const uv = line.toUnitVector()
    console.log( uv.compute(input) )
    console.log( uv.compute(input).unicodeArrow )
    console.log( uv.compute(input).directionAngle )
    console.log( uv.rotate90ccw().compute(input).unicodeArrow )
    console.log( uv.rotate90ccw().compute(input).directionAngle )
    
    console.log('== sa')
    
    console.log(saLine.compute(input))
    console.log(
        saLine.start.equals(
            start.xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
        )
    )
    const _saStart = saLine.start.compute(input)
    const _start = start
        .xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
        .compute(input)
    console.log(_saStart)
    console.log(_start)
}

if( require.main === module )
    main2()
