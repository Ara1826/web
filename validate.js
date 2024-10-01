
export default class Validate
{
    x;
    y;
    r;
    constructor() {
        this.log = "";
    }
    check(x, y, r) {
        this.log = "";
        if (!this.checkForNull(x, y, r))
            return {
                allOk: false,
                log: "Заполните все поля формы"
            };
        return {
            allOk: this.checkX(x) && this.checkY(y) && this.checkR(r),
            log: this.log
        };
    }
    checkForNull(x, y, r){
        if (x && y && r)
            return true;
        else
            return false;
    }
    // checkX(x){
    //     x = parseFloat(x.value);
    //     this.x = x;
    //     if ([-5, -4, -3, -2, -1, 0, 1, 2, 3].includes(x))
    //         return true;
    //     else {
    //         this.log = "X нужно выбрать"
    //         return false;
    //     }
    // }

    checkX(x) {
        if (!/^(-?\d+(\.\d+)?)$/.test(x.value)){
            this.log = "X должен содержать число"
            return false;
        }
        x = parseFloat(x.value);
        this.x = x;
        if (isNaN(x)) {
            this.log = "X должен содержать число"
            return false;
        }
        if (-5 <= x && x <= 3)
            return true;
        else {
            this.log = "Значение X должно быть от -5  до 3"
            return false;
        }
    }
    checkY(y){
        y = parseFloat(y.value);
        this.y = y;
        if ([-4, -3, -2, -1, 0, 1, 2, 3, 4].includes(y))
            return true;
        else {
            this.log = "Y нужно выбрать"
            return false;
        }
    }

    checkR(r) {
        r = parseFloat(r.value);
        this.r = r;
        if (isNaN(r)) {
            this.log = "R нужно выбрать"
            return false;
        }
        return true;
    }

    getCoords(){
        return{
            x: this.x,
            y: this.y,
            r: this.r
        };
    }
}
