// Each mixin is a traditional ES class
var Jumpable = /** @class */ (function () {
    function Jumpable() {
    }
    Jumpable.prototype.jump = function () {
    };
    return Jumpable;
}());
var Duckable = /** @class */ (function () {
    function Duckable() {
    }
    Duckable.prototype.duck = function () { };
    return Duckable;
}());
// Including the base
var Sprite = /** @class */ (function () {
    function Sprite() {
        this.x = 0;
        this.y = 0;
    }
    return Sprite;
}());
// Apply the mixins into the base class via
// the JS at runtime
applyMixins(Sprite, [Jumpable, Duckable]);
console.log(Sprite);
var player = new Sprite();
player.jump();
console.log(player.x, player.y);
// This can live anywhere in your codebase:
function applyMixins(derivedCtor, constructors) {
    constructors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null));
        });
    });
}
