
import {Point} from 'octogeom'
import {
    NumberValueNode, PointValueNode, LineSimpleNode
} from '../src/node_g'

describe('computeWith', () => {
    test('simple computeWith funcs work', () => {

        const i = new NumberValueNode('i')
        const j = i.computeWith( v => v**2 )
        const x = i.computeWith( v => 'x' ) // compute should fail

        var input = new Map<string,any>()
        input.set('i', 10)

        //console.log( i.compute(input) ) // 10
        expect( i.compute(input) ).toBe( 10 )
        //console.log( j.compute(input) ) // 100
        expect( j.compute(input) ).toBe( 100 )
        
        expect( () => x.compute(input) ).toThrow( TypeError )
    })
})
