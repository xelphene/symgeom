
import {Point} from 'octogeom'
import {
    NumberValueNode, PointValueNode
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
}

if( require.main === module )
    main()
