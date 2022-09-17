import { XY } from "./lib_gametype";

/**
* @param {number} v1 시작 숫자값
* @param {number} v2 종료 숫자값
* @param {number} t 0~1 사이의 진행 값
* @returns 보간 결과
*/
export function lerp_1(v1, v2, t)
{
    return ((1-t) * v1) + (t * v2);   //기본 그대로 사용
    //return v1 + ((v2 - v1) * t);      //type-1
    //return v1 * t + v2;               //type-0
}

/**
* @param {XY} v1
* @param {XY} v2
* @param {number} t
* @param {XY} out
* @returns 보간결과 out을 그대로 리턴
*/
export function lerp_2(v1, v2, t, out)
{
    out = out ? out : new XY(v1.x, v1.y);
    let nx = lerp_1(v1.x, v2.x, t);
    let ny = lerp_1(v1.y, v2.y, t);
    out.set(nx, ny);
    return out;
}


/** lerp_2만 써서, 점 3개짜리 곡선 움직임 찾기 */
export function point3_bezier_1(p0, p1, p2, t, out)
{
    out = out ? out : new XY(p0.x, p0.y);
    let a = lerp_2(p0, p1, t);
    let b = lerp_2(p1, p2, t);
    lerp_2(a, b, t, out);
    return out;
}


/**
* @param {XY} p0
* @param {XY} p1
* @param {XY} p2
* @param {number} t
* @param {XY} out
*/
export function point3_bezier_2(p0, p1, p2, t, out)
{
    out = out ? out : new XY(0, 0);
    out.x = point3_bezier_calc_1(p0.x, p1.x, p2.x, t);
    out.y = point3_bezier_calc_1(p0.y, p1.y, p2.y, t);
    return out;
}

export function point3_bezier_3(out, t, pts)
{
    out = out ? out : new XY(0, 0);
    out.x = point3_bezier_calc_1(pts[0].x, pts[1].x, pts[2].x, t);
    out.y = point3_bezier_calc_1(pts[0].y, pts[1].y, pts[2].y, t);
    return out;
}


/*
-------------------------------------------------------------------------------
- 점 3개                                                                       -
-------------------------------------------------------------------------------
B
A      C

1) A->B : ((1-t)A + tB)  ->  ok
2) B->C : ((1-t)B + tC)  ->  ok
3) AB->BC : (1-t)((1-t)A + tB) + t((1-t)B + tC)  ->  ok
-------------------------------------------------------------------------------
= (1-t)²A + (1-t)tB + (1-t)tB + t²C
= (1-t)²A + 2(1-t)tB + t²C
-------------------------------------------------------------------------------
*/
export function point3_bezier_calc_1(n0, n1, n2, t)
{
    return (1-t)**2*n0 + 2*t*(1-t)*n1 + t**2*n2; //ok
    //let mt = 1-t; return (mt*(mt*n0 + t*n1) + t*(mt*n1 + t*n2)); // ok
    //return n0*t**2 - 2*n1*t**2 + n2*t**2 - 2*n0*t + 2*n1*t + n0; //ok
}

/*
-------------------------------------------------------------------------------
- 점 4개                                                                       -
-------------------------------------------------------------------------------
= (1-t)³A + 3(1-t)²tB + 3(1-t)²tC + t³D
-------------------------------------------------------------------------------
*/

/** lerp_2만 써서, 점 4개짜리 곡선 움직임 찾기
 * @param {XY} p0 - XY 형식의 좌표값. p0 ~ p3
 * @param {XY} out
 * @param {number} t
 */
export function point4_bezier_1(p0, p1, p2, p3, t, out)
{
    out = out ? out : new XY(p0.x, p0.y);

    let a = lerp_2(p0, p1, t);
    let b = lerp_2(p1, p2, t);
    let c = lerp_2(p2, p3, t);

    let e = lerp_2(a, b, t);
    let f = lerp_2(b, c, t);

    lerp_2(e, f, t, out);

    return out;
}

/**
 * @param {XY} out
 * @param {number} t
 * @param {XY[]} pts - [XY, XY, XY, XY] XY 4개 있는 배열 필요.
 */
export function point4_bezier_2(out, t, pts)
{
    out = out ? out : new XY(pts[0].x, pts[0].y);

    let a = lerp_2(pts[0], pts[1], t);
    let b = lerp_2(pts[1], pts[2], t);
    let c = lerp_2(pts[2], pts[3], t);

    let e = lerp_2(a, b, t);
    let f = lerp_2(b, c, t);

    lerp_2(e, f, t, out);

    return out;
}


// P0( -3t^2 +6t -3 ) + P1( 9t^2 -12t +3 ) + P2( -9t^2 + 6t ) + P3( 3t^2 )
/** 점4개 베지어에서 1번째 도함수에서 속도를(탄젠트) 구한다.
 * @param {XY} out
 * @param {number} t
 * @param {XY[]} pts - [XY, XY, XY, XY] XY 4개 있는 배열 필요.
 */
export function point4_bezier_velocity(t, pts)
{
    let out = new XY(pts[0].x, pts[0].y);

    if(pts.length !== 4) {
        console.warn('point4_bezier_velocity: need 4 points');
        return
    }
    let p0 = ((-3 * t ** 2) + (6 * t) + (-3));
    let p1 = (9 * t ** 2) + (-12 * t) + (3);
    let p2 = (-9 * t ** 2) + (6 * t);
    let p3 = (3 * t ** 2);

    out.x = (p0 * pts[0].x) + (p1 * pts[1].x) + (p2 * pts[2].x) + (p3 * pts[3].x);
    out.y = (p0 * pts[0].y) + (p1 * pts[1].y) + (p2 * pts[2].y) + (p3 * pts[3].y);

    console.log('point4_bezier_velocity\n: ' + out.toString());

    let final = p0 + p1 + p2 + p3;
    console.log.apply(console, ['point4_bezier_velocity\n: all('+final.toFixed(2)+') P0('+p0.toFixed(2)+') + P1('+p1.toFixed(2)+') + P2('+p2.toFixed(2)+') + P3('+p3.toFixed(2)+')']);
    return final;
}