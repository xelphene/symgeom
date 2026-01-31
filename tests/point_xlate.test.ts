
import {Point} from 'octogeom'
import {
    NumberValueNode, PointValueNode, LineSimpleNode
} from '../src/node_g'

describe('point xlate', () => {

    const dy = new NumberValueNode('dy')
    const ipt = new PointValueNode('ipt')
    const dpt = ipt.xlateUp(dy)

    var input = new Map<string,any>()
    input.set('dy', 10)
    input.set('ipt', new Point(2,2))
    
    test('stuff is right', () => {

        expect( dy.compute(input) ).toBe( 10 )
        expect( ipt.compute(input).x ).toBe( 2 )
        expect( ipt.compute(input).y ).toBe( 2 )
        expect( dpt.compute(input).x ).toBe( 2 )
        expect( dpt.compute(input).y ).toBe( 12 )
    
        expect( dpt.equals(ipt.xlateUp(dy)) ).toBe( true )
        expect( dpt.equals(dy) ).toBe( false)
        
    })
})
