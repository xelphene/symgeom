
declare module "octogeom" {
    export class Point {
        constructor( x:number, y:number );
        ymirror(): Point;
        xlateUp(number): Point;
    }
}
