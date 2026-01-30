
import {Point} from 'octogeom'
import {NumberInputNode, PointInputNode} from '../src/node'
import {geomfunc} from '../src/geomfunc'

function main ()
{
    //const p = new Point(3,2)
    //console.log(p)

    const input = new Map<string,any>()
    input.set('p', new Point(10,11))
    input.set('dy', 10)
    
    const dyn = new NumberInputNode('dy')
    const pn = new PointInputNode('p')
    //console.log(  pn.compute(input)  )
    //console.log(  dyn.compute(input)  )

    /*    
    const cn = new PointComputeNode(
        //( pt:Point, dy:number ): Point => pt.xlateUp(dy),
        geom.point.xlateUp,
        [pn,dyn]
    )
    */
    const cn = pn.apply( geomfunc.point.xlateUp, [pn, dyn] )
    console.log(  cn.compute(input)  )
    const cn2 = pn.xlateUp( dyn )
    console.log( cn2.compute(input) )
    
    console.log( cn.equals(cn2) )
}

if( require.main === module )
    main()
