/**
 * 坐标系转换工具
 * -------------------------------------------------------
 * 支持 WGS-84 ↔ GCJ-02 ↔ BD-09 之间的相互转换。
 *
 * 约定：
 *   - WGS-84：GPS 原始坐标（国际通用）
 *   - GCJ-02：国测局加密坐标（腾讯 / 高德地图）
 *   - BD-09  ：百度二次加密坐标（百度地图专属）
 *
 * 算法来源：公开的火星坐标算法（"Encrypting algorithm for Chinese Coordinate Systems"）。
 * 注：所有转换均为近似值，误差在厘米级，对普通导航足够精确。
 */

const PI = Math.PI;
const a = 6378245.0;          // 长半轴
const ee = 0.00669342162296594323; // 扁率

/** 粗略判断是否在国内境外（境外不做加密偏移） */
function outOfChina(lng: number, lat: number): boolean {
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

function delta(lng: number, lat: number): { dLng: number; dLat: number } {
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
  return { dLng, dLat };
}

/** WGS-84 → GCJ-02 */
export function wgs84ToGcj02(lng: number, lat: number): { lng: number; lat: number } {
  if (outOfChina(lng, lat)) return { lng, lat };
  const { dLng, dLat } = delta(lng, lat);
  return { lng: lng + dLng, lat: lat + dLat };
}

/** GCJ-02 → WGS-84（迭代法精度更高） */
export function gcj02ToWgs84(lng: number, lat: number): { lng: number; lat: number } {
  if (outOfChina(lng, lat)) return { lng, lat };
  let g0 = { lng, lat };
  let w0 = g0;
  let g1 = wgs84ToGcj02(w0.lng, w0.lat);
  // 迭代 10 次足够收敛到毫米级
  for (let i = 0; i < 10; i++) {
    w0 = { lng: w0.lng - (g1.lng - g0.lng), lat: w0.lat - (g1.lat - g0.lat) };
    g1 = wgs84ToGcj02(w0.lng, w0.lat);
  }
  return w0;
}

/** GCJ-02 → BD-09（百度在 GCJ-02 基础上再做一次偏移） */
export function gcj02ToBd09(lng: number, lat: number): { lng: number; lat: number } {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * PI * 3000.0 / 180.0);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * PI * 3000.0 / 180.0);
  return {
    lng: z * Math.cos(theta) + 0.0065,
    lat: z * Math.sin(theta) + 0.006,
  };
}

/** BD-09 → GCJ-02 */
export function bd09ToGcj02(lng: number, lat: number): { lng: number; lat: number } {
  const x = lng - 0.0065;
  const y = lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI * 3000.0 / 180.0);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI * 3000.0 / 180.0);
  return {
    lng: z * Math.cos(theta),
    lat: z * Math.sin(theta),
  };
}

/** WGS-84 → BD-09（两步：WGS→GCJ→BD） */
export function wgs84ToBd09(lng: number, lat: number): { lng: number; lat: number } {
  const g = wgs84ToGcj02(lng, lat);
  return gcj02ToBd09(g.lng, g.lat);
}

/** BD-09 → WGS-84 */
export function bd09ToWgs84(lng: number, lat: number): { lng: number; lat: number } {
  const g = bd09ToGcj02(lng, lat);
  return gcj02ToWgs84(g.lng, g.lat);
}
