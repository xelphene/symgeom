
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

    mapInputs( input:Map<string,any> ): Map<(BaseNode|NodeMap),any>
    {
        const downInput = new Map<(BaseNode|NodeMap),any>()

        for( let [iKey,iValue] of input.entries() ) {
            const member = this._map.get(iKey)

            if( member===undefined )
                throw new Error(`no node for input ${iKey}`)

            if( member instanceof BaseNode )
                downInput.set(member, iValue)
            else if( member instanceof NodeMap )
                downInput.set(member, member.mapInputs(iValue))
            else
                throw new Error('wtf')
        }
        return downInput
    }

    compute( input:Map<(BaseNode|NodeMap),any> ): Map<string,any>
    {
        const values = new Map<string,any>()
        for( let [key,member] of this._map.entries() ) 
        {
            const inputValue = input.get(member)
            //if( inputValue===undefined )
            //    throw new Error(`missing input`)
            
            if( member instanceof BaseNode ) {
                values.set(key, member.compute(input))
            } else if( member instanceof NodeMap ) {
                //const input2 = input.get(key)
                //if( input2
                const input2 = input.get(member)
                if( isMappedInput(input2) ) {
                    values.set(key, member.compute(input2) )
                } else
                    throw new Error('incorrect type for sub input')
            } else
                throw new Error('wtf')
        }
        return values
    }

    /*
    // output will be actual values
    compute( input:Map<string,any> ): Map<string,any>
    {
        const downInput = new Map<(BaseNode|NodeMap),any>()
        for( let [iKey,iValue] of input.entries() ) {
            const member = this._map.get(iKey)
            if( member===undefined )
                throw new Error(`no node for input ${iKey}`)
            downInput.set(member, iValue)
        }
        
        const values = new Map<string,any>()
        
        for( let [key,member] of this._map.entries() ) 
        {
            if( member instanceof BaseNode ) {
                //let di = downInput.get(member)
                //if( di instanceof InputMap )
                //    let value = member.compute(di)
                //else
                //    throw new Error('node input type error')
                let value = member.compute(downInput)
                values.set(key,value)
            } else if( member instanceof NodeMap ) {
                let di = downInput.get(member)
                if( di instanceof Map<string,any> )
                    let value = member.compute(di)
                else
                    throw new Error('down input error')
                values.set(key,value)
            } else throw
                new Error('wtf')
        }

        return values
    }
    */
    
    add( key:string, member:(BaseNode|NodeMap) ) {
        this._map.set(key, member)
    }
}
