
import {Point} from 'octogeom'
import {NumberValueNode, PointValueNode} from '../src/node_g'
import {bindPoint, bindNumber} from '../src/bind'

describe('map number exponent', () => {
    test('exponentiate a number via a node bound func', () => {
        // Arrange
        
        //const num1 = 5;
        //const num2 = 10;
        //const expected = 15;
        
        const i = new NumberValueNode('i')
        const e = new NumberValueNode('e')
        const exp = bindNumber( [e], (e,i) => i**e )
        const out = i.map( exp )
            
        const input = new Map<string,any>()

        ////////////////////

        // Act
        //const result = sum(num1, num2);
        input.set('i', 2 )
        input.set('e', 3 )
        const result3 = out.compute(input)
        input.set('e', 4 )
        const result4 = out.compute(input)
        
        // Assert
        expect(result3).toBe( 8 );
        expect(result4).toBe( 16 );
    })
})

describe('map point xlate', () => {
    test('xlate a Point via a node bound func', () => {

        const dx = new NumberValueNode('dx')
        const dy = new NumberValueNode('dy')
        const xlate = bindPoint(
            [dx,dy],
            (dx,dy,pt) => pt.xlate(dx,dy)
        )
        const ptA = new PointValueNode('opt')
        const ptB = ptA.map(xlate)
        
        const input = new Map<string,any>()
        input.set('opt', new Point(5,1) )
        input.set('dx', 10)
        input.set('dy', 1)
        expect( ptB.compute(input).x ).toBe( 15 )
        expect( ptB.compute(input).y ).toBe( 2 )
        //console.log(`15,2: ${ptB.compute(input)}` )
        input.set('dx', 11)
        expect( ptB.compute(input).x ).toBe( 16 )
        expect( ptB.compute(input).y ).toBe( 2 )
        //console.log(`16,2: ${ptB.compute(input)}` )
  })
})
