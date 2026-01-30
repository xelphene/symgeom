
import {Point, UnitVector, Line} from 'octogeom'

export const geomfunc = {
    point: {
        xlateUp: (pt:Point, dy:number):Point => pt.xlateUp(dy),
        ymirror: (pt:Point) => pt.ymirror(),
        xlateUnitVector: (pt:Point, dir:UnitVector, dist:number) =>
            pt.xlateUnitVector(dir, dist)
    },
    line: {
        toUnitVector: (line:Line) => line.toUnitVector()
    },
    unitVector: {
        rotate90ccw: (uv:UnitVector) => uv.rotate90ccw()
    }
}
