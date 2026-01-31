
import {Point} from 'octogeom'
import {NumberValueNode, PointValueNode} from '../src/node_g'
import {bindPoint, bindNumber} from '../src/bind'

function main_map_pt() {
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
    
    console.log(`15,2: ${ptB.compute(input)}` )
    input.set('dx', 11)
    console.log(`16,2: ${ptB.compute(input)}` )
}

function main_map_num() {
    const i = new NumberValueNode('i')
    const e = new NumberValueNode('e')
    const exp = bindNumber( [e], (e,i) => i**e )
    const out = i.map( exp )
        
    const input = new Map<string,any>()
    input.set('i', 2 )
    input.set('e', 3 )
    
    console.log( `8: ${out.compute(input)}` ) // 8
    input.set('e', 4 )
    console.log( `16: ${out.compute(input)}` ) // 16
}

function main_map_all() {
    main_map_num()
    main_map_pt()
}

if( require.main === module )
    main_map_pt()
    main_map_num()
