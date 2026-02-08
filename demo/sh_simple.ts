
import {Point} from 'octogeom'
import {BaseNode,NumberValueNode, PointValueNode, LineSimpleNode } from '../src/node_g'
import {NodeMap} from '../src/nodemap'
/*

key lessons from 

the fundamental prob I was trying to solve with 52 is: the existence of
implied NodeDefs and their identity...  i.e.  equals() in 52

shoulder.sa.line.start == shoulder.sip.xlateUnitVector(...)_
*/

function shoulder52 ( saEnable:boolean ): Function
{
    if( saEnable )
        return function (
            sip:PointValueNode, sop:PointValueNode, saWidth:NumberValueNode
        ): NodeMap
        {
            const main = new LineSimpleNode(sip,sop)
            const saMain = main.xlateUnitVector(
                main.toUnitVector().rotate90ccw(),
                saWidth
            )
            const saInner = main.start.lineTo(saMain.start)
            const saOuter = main.end.lineTo(saMain.end)
            const o = new NodeMap()
            o.add('main', main)
            o.add('saMain', saMain)
            o.add('saInner', saInner)
            o.add('saOuter', saOuter)
            return o
        }
    else
        return function (
            sip:PointValueNode, sop:PointValueNode
        ): NodeMap
        {
            const main = new LineSimpleNode(sip,sop)
            const o = new NodeMap()
            o.add('main', main)
            return o
        }
}


function unibod52 () 
{
    /*
    // TODO: make this a NodeMap instead
    const T: { [key: string]: any } = {};
    T.f_p_sip = new PointValueNode('sip')
    T.f_p_sop = new PointValueNode('sop')
    T.x_x_saWidth = new NumberValueNode('saWidth')
    //{inner: T.f_p_shoulderInner, outer: T.f_p_shoulderOuter} = 
    //    shoulder52({saEnable:true})({ sip:T.f_p_sip, sop:T.f_p_sop, saWidth:T.x_x_saWidth })
    
    T.f_p_shoulder = shoulder52( true )(
        T.f_p_sip, T.f_p_sop, T.x_x_saWidth
    )
    */

    const T = new NodeMap()
    T.set('f_p_sip', new PointValueNode('sip') )
    T.set('f_p_sop', new PointValueNode('sop') )
    T.set('x_x_saWidth', new NumberValueNode('saWidth') )
    //{inner: T.f_p_shoulderInner, outer: T.f_p_shoulderOuter} = 
    //    shoulder52({saEnable:true})({ sip:T.f_p_sip, sop:T.f_p_sop, saWidth:T.x_x_saWidth })
    
    T.set('f_p_shoulder', shoulder52( true )(
        T.getNode('f_p_sip'), T.getNode('f_p_sop'), T.getNode('x_x_saWidth')
    ))
    
    const input = new Map<BaseNode,any>()
    input.set( T.getNode('f_p_sip'), new Point(5,10) )
    input.set( T.getNode('f_p_sop'), new Point(8,8) )
    input.set( T.getNode('x_x_saWidth'), 0.5 )
    // could also rewrite this with just string keys on T mapping to input values

    //const values = T.get('f_p_shoulder').compute(input)
    const values = T.compute(input)
    console.log(values)
}

function main () {
    unibod52()
}

if( require.main === module )
    main()
