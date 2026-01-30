
declare module "octogeom" {
    export class Point {
        constructor( x:number, y:number );
        ymirror(): Point;
        xlateUp(number): Point;
        xlateUnitVector(UnitVector,number): Point;
    }
    export class Line {
        constructor( start:Point, end:Point );
        ymirror(): Line;
        toUnitVector(): UnitVector;
        xlateUnitVector(dir:UnitVector, dist:number): Line
    }
    export class UnitVector {
        constructor( x:number, y:number );
        rotate90ccw();
        directionAngle: number;
        unicodeArrow: string;
    }
}
