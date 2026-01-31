
import {BaseNode} from './node_g'
import {InputMap} from './node_g'

type NodeMapInputMap = Map<string,any>

type MappedInput = Map<(BaseNode|NodeMap),any>
function isMappedInput( v: MappedInput | any ): v is MappedInput {
    if( v instanceof Map )
        return [...v.keys()]
            .map( k => k instanceof BaseNode || k instanceof NodeMap )
            .reduce( (a,b) => a && b )
    else
        return false
}

export class NodeMap
{
    _map: Map<string,(BaseNode|NodeMap)>
    
    constructor() {
        this._map = new Map<string,(BaseNode|NodeMap)>()
    }
    
    // requires abstraction of the bind stuff (XLateable)
    // or just create a new binding and re-use the same
    // compute func
    //map( BoundFunc ): NodeMap {}

    mapInputs( input:Map<string,any> ): Map<BaseNode,any>
    {
        const downInput = new Map<BaseNode,any>()

        for( let [iKey,iValue] of input.entries() ) {
            const member = this._map.get(iKey)

            if( member===undefined )
                throw new Error(`no node for input ${iKey}`)

            if( member instanceof BaseNode )
                downInput.set(member, iValue)
            else if( member instanceof NodeMap ) {
                const subInput = member.mapInputs(iValue)
                for( let [sKey,sValue] of subInput.entries() )
                    downInput.set(sKey, sValue)
            }
            else
                throw new Error('wtf')
        }
        return downInput
    }

    compute( input:Map<BaseNode,any> ): Map<string,any>
    {
        const values = new Map<string,any>()
        for( let [key,member] of this._map.entries() ) 
        {
            if( member instanceof BaseNode ) {
                values.set(key, member.compute(input))
            
            } else if( member instanceof NodeMap ) {
                values.set(key, member.compute(input))
            } else
                throw new Error('wtf')
        }
        return values
    }

    add( key:string, member:(BaseNode|NodeMap) ) {
        this._map.set(key, member)
    }
    
    expnInput( path?:string[] ): Map<BaseNode,string[][]> {
        if( path===undefined )
            path=[]
        
        const inputMap = new Map<BaseNode,string[][]>()
        for( let [key,member] of this._map.entries() )
        {
            if( member instanceof BaseNode && member.takesInput ) 
            {
                console.log('found input:')
                console.log(member)
                const ev = inputMap.get(member)
                if( ev===undefined )
                    inputMap.set(member, [ path.concat([key]) ])
                else
                    inputMap.set(member, 
                        ev.concat( path.concat([key]) )
                    )
            } else if( member instanceof NodeMap ) {
                const subExpns = member.expnInput( path.concat([key]) )
                for( let [node,expns] of subExpns.entries() ) {
                    const ev = inputMap.get(node)
                    if( ev===undefined )
                        inputMap.set(node, expns)
                    else
                        inputMap.set(node, 
                            ev.concat(expns)
                        )
                }
                    
            }
        }
        return inputMap
    }
}
