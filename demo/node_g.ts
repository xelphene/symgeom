
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

    console.log('lineTo')
    const toPt = new PointValueNode('toPt')
    input.set('toPt', new Point(99,99) )
    const line = dpt.lineTo(toPt)
    console.log( line.compute( input ) )
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
    console.log( end_.compute(input) ) // Point -5, 17
    console.log( line.compute(input) ) // Line { start: Point { x: 3, y: 20 }, end: Point { x: 5, y: 17 } }
    console.log( line_.compute(input) ) // Line { start: Point { x: -3, y: 20 }, end: Point { x: -5, y: 17 } }
    
    console.log( line_.end.equals(end_) ) // true

    console.log('== UV')
    
    const uv = line.toUnitVector()
    console.log( uv.compute(input) )
    console.log( uv.compute(input).unicodeArrow )
    console.log( uv.compute(input).directionAngle ) // 303.69
    console.log( uv.rotate90ccw().compute(input).unicodeArrow )
    console.log( uv.rotate90ccw().compute(input).directionAngle ) // 33.69
    
    console.log('== sa')
    
    console.log(saLine.compute(input)) // Line { start: Point { x: 3.416, y: 20.277 }, end: Point { x: 5.416, y: 17.277 } }
    console.log(
        saLine.start.equals(
            start.xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
        )
    ) // true
    const _saStart = saLine.start.compute(input)
    const _start = start
        .xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
        .compute(input)
    console.log(_saStart) // Point { x: 3.416, y: 20.277 }
    console.log(_start)   // Point { x: 3.416, y: 20.277 }
}

function main_guard() {
    const i = new NumberValueNode('i')
    const j = i.computeWith( v => v**2 )
    const x = i.computeWith( v => 'x' ) // compute should fail
    
    var input = new Map<string,any>()
    input.set('i', 10)
    
    console.log( i.compute(input) ) // 10
    console.log( j.compute(input) ) // 100
    try {
        console.log( x.compute(input) )
    } catch(e) {
        if( e instanceof TypeError )
            console.log(`threw expected TypeError: ${e}`)
        else
            throw e
    }
}

if( require.main === module )
    main()
    //main2()
    //main_guard()
