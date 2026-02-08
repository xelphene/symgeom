
import {BaseNode} from '../src/node_g'
import {NumberValueNode} from '../src/node_g'
import {NodeMap} from '../src/nodemap'

describe('buildproxy', () => {
    test('ensure x==4 and y==16 from buildproxy remote', () => {

        const nm = new NodeMap();
        const T = nm.getBuildProxy()
        T.x = new NumberValueNode('x')
        T.y = new NumberValueNode( v => v**2, [T.x])

        const result = nm.computeWith({x:4})
        
        expect( result.x ).toBe( 4 )
        expect( result.y ).toBe( 16 )
    })
})
