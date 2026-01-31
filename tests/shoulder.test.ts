
import {Point} from 'octogeom'
import {
    NumberValueNode, PointValueNode, LineSimpleNode
} from '../src/node_g'

describe('shoulder', () => {
    
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
    
    test('ymirrored end Point is ok', () => {

        //console.log( '== line:')
        //console.log( end_.compute(input) ) // Point -5, 17
        expect( end_.compute(input).x ).toBe( -5 )
        expect( end_.compute(input).y ).toBe( 17 )
    })
    
    test('line is 3,20 -> 5,17', () => {
        //console.log( line.compute(input) ) // Line { start: Point { x: 3, y: 20 }, end: Point { x: 5, y: 17 } }
        expect( line.compute(input).start.x ).toBe( 3 )
        expect( line.compute(input).start.y ).toBe( 20 )
        expect( line.compute(input).end.x ).toBe( 5 )
        expect( line.compute(input).end.y ).toBe( 17 )
    })
    
    test('line_ is line ymirrored', () => {
        //console.log( line_.compute(input) ) // Line { start: Point { x: -3, y: 20 }, end: Point { x: -5, y: 17 } }
        expect( line_.compute(input).start.x ).toBe( -3 )
        expect( line_.compute(input).start.y ).toBe( 20 )
        expect( line_.compute(input).end.x ).toBe( -5 )
        expect( line_.compute(input).end.y ).toBe( 17 )
    })
    
    test('line_ end equals ymirrored end point end_', () => {
        //console.log( line_.end.equals(end_) ) // true
        expect( line_.end.equals(end_) ).toBe( true )
    })

    const uv = line.toUnitVector()
    
    test('uv directionAngle is around 303', () => {
        expect( uv.compute(input).directionAngle ).toBeCloseTo( 303.69, 2 )
    })

    test('uv rotated dir angle is around 33', () => {
        expect( uv.rotate90ccw().compute(input).directionAngle ).toBeCloseTo( 33.69, 2 )
    })

    test('saLine is 3.416, 20.277  ->  5.416, y: 17.277', () => {
        expect( saLine.compute(input).start.x ).toBeCloseTo( 3.416, 2 )
        expect( saLine.compute(input).start.y ).toBeCloseTo( 20.277, 2 )
        expect( saLine.compute(input).end.x ).toBeCloseTo( 5.416, 2 )
        expect( saLine.compute(input).end.y ).toBeCloseTo( 17.277, 2 )
    })
        
    test('saLine start equals xlated start', () => {
        expect(
            saLine.start.equals(
                start.xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
            )
        ).toBe( true )
    })

    const _saStart = saLine.start.compute(input)
    const _start = start
        .xlateUnitVector( line.toUnitVector().rotate90ccw(), saWidth )
        .compute(input)
    
    test('saLine start and manually computed start have the same value', () => {
        expect( _saStart.x ).toBeCloseTo( 3.416, 2 )
        expect( _saStart.y ).toBeCloseTo( 20.277, 2 )
        expect( _start.x ).toBeCloseTo( 3.416, 2 )
        expect( _start.y ).toBeCloseTo( 20.277, 2 )
    })
})
