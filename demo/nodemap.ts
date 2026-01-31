
import {Point} from 'octogeom'
import {NodeMap} from '../src/nodemap'
import {NumberValueNode, PointValueNode} from '../src/node_g'

function main () {
    const dy = new NumberValueNode('dy')
    const ptA = new PointValueNode('ptA')
    const ptAx = ptA.xlateUp(dy)
    const dstPt = new PointValueNode('dstPt')
    const l = ptAx.lineTo(dstPt)
        
    const nm = new NodeMap()
    nm.add('dy', dy)
    nm.add('dstPt', dstPt)
    nm.add('ptA', ptA)
    nm.add('ptAx', ptAx)
    nm.add('l', l)
    
    const W = new NumberValueNode('W')
    nm.add('W', W)
    nm.add('dyW', new NumberValueNode( (dy,w) => dy+w, [dy,W] ) )

    const sub = new NodeMap()
    const e = new NumberValueNode('e')
    sub.add('e', e)
    sub.add('f', e.computeWith( v => v**2 ) )
    sub.add('W', W)
    nm.add('sub',sub)
    
    const input = new Map<string,any>()
    input.set('dy', 10)
    input.set('ptA', new Point(5,2))
    input.set('dstPt', new Point(99,99))
    input.set('sub', new Map<string,any>())
    input.get('sub').set('e',20)
    // these two W sets do the same thing
    //input.set('W', 0.1)
    input.get('sub').set('W', 0.1)
    
    const inputMapped = nm.mapInputs(input)
    console.log( inputMapped )
    //console.log( inputMapped.get(sub) )
    //console.log( inputMapped.get(ptA) )
    //console.log( ptAx.compute(inputMapped) )

    console.log('========')
    const result = nm.compute(inputMapped)
    console.log( result )
}

if( require.main === module )
    main()
