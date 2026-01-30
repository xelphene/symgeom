
import {FuncPoint, InputPoint, Line} from '../src/factory'

function main ()
{
    var input = new Map<string,any>()
    
    const start = new InputPoint('start')
    const end = new InputPoint('end')
    
    const start_ = start.ymirror()
    console.log( start_.equals( start.ymirror() ) )
    
    input.set('start', [3,10])
    input.set('end',   [5,8])
    console.log( start_.pEval(input) )
    
    console.log('- ymirror line')
    
    const line = new Line(start,end)
    const line_ = line.ymirror()
    console.log( start.ymirror().equals(line_.start) )
    console.log( line_.pEval(input) )
}

/*
function main2 ()
{
    const pt = new InputPoint('pt')
    const dy = new InputNumber('dy')
    const pt2 = pt.ymirror().xlateUp(dy)
}
*/

if( require.main === module )
    main()
