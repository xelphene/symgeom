
import {NodeMap} from './nodemap'
import {BaseNode} from './node_g'

export interface BuildProxyIface {
    [key: string]: (BaseNode | NodeMap)
}

export function makeBuildProxy(nm:NodeMap): BuildProxyIface {
    // re: "nm as unknown as BuildProxyIface":
    // per tsc:
    // > Conversion of type 'NodeMap' to type 'BuildProxyIface' may be a
    // > mistake because neither type sufficiently overlaps with the other. 
    // > If this was intentional, convert the expression to 'unknown' first.
    return new Proxy<BuildProxyIface>(
        nm as unknown as BuildProxyIface,
        BuildProxyHandler
    )
}

const BuildProxyHandler: ProxyHandler<BuildProxyIface> = {
    get: (o: BuildProxyIface, key:(string|symbol), receiver: any): (BaseNode|NodeMap) =>
    {
        if( ! (o instanceof NodeMap) )
            throw new TypeError(`BuildProxyHandler can only proxy for NodeMap`)
        if( typeof(key) == 'symbol' )
            throw new TypeError(`only string keys allowed on NodeMap`)
        
        const nm:NodeMap = (o as NodeMap)

        //console.log(`GET ${String(key)}`)
        
        return nm.get(key)
    },
    set: (o: BuildProxyIface, key:(string|symbol), v: any, receiver: any): boolean =>
    {
        if( ! (o instanceof NodeMap) )
            throw new TypeError(`BuildProxyHandler can only proxy for NodeMap`)
        if( typeof(key) == 'symbol' )
            throw new TypeError(`only string keys allowed on NodeMap`)
        if( ! (v instanceof BaseNode) )
            throw new TypeError(`can only assign BaseNode instances to proxied NodeMaps`)
        
        const nm:NodeMap = (o as NodeMap)
        
        //console.log(`SET ${String(key)}`)
        nm.set(key, v)
        
        return true
    }
}