
import {BaseNode} from '../src/node_g'
import {NumberValueNode} from '../src/node_g'
import {NodeMap} from '../src/nodemap'

function main () {
    const nm = new NodeMap();
    const T = nm.getBuildProxy()
    T.x = new NumberValueNode('x')
    T.y = new NumberValueNode( v => v**2, [T.x])
    
    console.log( nm.computeWith({x:4}) )
}

if( require.main === module )
    main()
