/**
 * 导航链接生成器
 * -------------------------------------------------------
 * 为不同地图 App 生成「优先唤起 App，失败降级到网页」的跳转链接。
 *
 * 支持：高德 / 百度 / 腾讯 / 苹果地图
 * 坐标系约定：
 *   - 本模块接收 **WGS-84** 作为输入基准（GPS 原始坐标）
 *   - 内部通过 coord.ts 自动转换为各地图所需坐标系
 *   - 严禁混用坐标系
 */

import { wgs84ToGcj02, wgs84ToBd09 } from './coord';

export type MapApp = 'amap' | 'baidu' | 'tencent' | 'apple';

/** 导航目标 */
export interface NavTarget {
  /** 目的地名称 */
  name: string;
  /** WGS-84 经度 */
  wgsLng: number;
  /** WGS-84 纬度 */
  wgsLat: number;
  /** 详细地址（可选，用于网页兜底） */
  address?: string;
}

/** 生成结果 */
export interface NavURLs {
  /** App URL Scheme（优先唤起已安装的本地 App） */
  appUrl: string;
  /** 网页兜底 URL（App 未安装时跳转） */
  webUrl: string;
}

/** 是否 iOS */
export const isIOS = (): boolean =>
  /iPhone|iPad|iPod/i.test(navigator.userAgent);

/** 是否微信内置浏览器 */
export const isWeChat = (): boolean =>
  /MicroMessenger/i.test(navigator.userAgent);

/** 是否 Android */
export const isAndroid = (): boolean =>
  /Android/i.test(navigator.userAgent);

/** ========== 各地图 URL 生成 ========== */

/** 高德：App Scheme 使用 GCJ-02（高德自家坐标） */
function buildAmap(target: NavTarget): NavURLs {
  const { lng, lat } = wgs84ToGcj02(target.wgsLng, target.wgsLat);
  const name = encodeURIComponent(target.name);
  const addr = encodeURIComponent(target.address || '');

  // URL Scheme —— 高德官方 URI API
  // https://uri.amap.com/ 同时兼容 App 唤起和网页打开（自动降级）
  const appUrl = `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}&address=${addr}&coordinate=gaode&src=YaoQing&callnative=1`;

  // 纯网页兜底（明确用 amap.com 域名）
  const webUrl = `https://amap.com/place/?lat=${lat}&lng=${lng}&name=${name}`;

  return { appUrl, webUrl };
}

/** 百度：App Scheme 使用 BD-09（百度自家坐标） */
function buildBaidu(target: NavTarget): NavURLs {
  const { lng, lat } = wgs84ToBd09(target.wgsLng, target.wgsLat);
  const name = encodeURIComponent(target.name);

  // 百度 URI API —— 支持 App 唤起 + 网页打开
  const appUrl = `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${name}&coord_type=bd09&src=YaoQing&output=html`;

  // 纯网页兜底
  const webUrl = `https://map.baidu.com/search/?q=${name}&lat=${lat}&lng=${lng}`;

  return { appUrl, webUrl };
}

/** 腾讯：App Scheme 使用 GCJ-02 */
function buildTencent(target: NavTarget): NavURLs {
  const { lng, lat } = wgs84ToGcj02(target.wgsLng, target.wgsLat);
  const name = encodeURIComponent(target.name);
  const addr = encodeURIComponent(target.address || '');

  // 腾讯 URI API —— 自动降级到 Web
  const appUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${name};addr:${addr}&referer=YaoQing`;

  // 纯网页兜底
  const webUrl = `https://map.qq.com/marker?lat=${lat}&lng=${lng}&title=${name}`;

  return { appUrl, webUrl };
}

/** 苹果地图：使用 WGS-84（Apple 原生就是 WGS-84） */
function buildApple(target: NavTarget): NavURLs {
  const name = encodeURIComponent(target.name);
  // Apple 地图 URL Scheme —— 自动在 iOS 上唤起原生 App，其他平台打开网页版
  const appUrl = `https://maps.apple.com/?q=${name}&ll=${target.wgsLat},${target.wgsLng}`;
  const webUrl = appUrl; // Apple 没有独立的网页域名，同一个 URL 就够了
  return { appUrl, webUrl };
}

/** ========== 统一入口 ========== */

export function buildNavURLs(app: MapApp, target: NavTarget): NavURLs {
  switch (app) {
    case 'amap':    return buildAmap(target);
    case 'baidu':   return buildBaidu(target);
    case 'tencent': return buildTencent(target);
    case 'apple':   return buildApple(target);
  }
}

/**
 * 执行导航跳转
 * -------------------------------------------------------
 * 策略：
 *   1) 微信内置浏览器：不直接跳转（Scheme 被拦截），引导用户"在浏览器中打开"
 *   2) 其他浏览器：先尝试唤起 App（appUrl），2 秒后若页面未跳转则打开 webUrl 兜底
 *
 * 调用方应自行处理"微信引导"UI（本函数仅返回是否命中微信环境）。
 */
export function openNav(app: MapApp, target: NavTarget): { wechatBlocked: boolean } {
  if (isWeChat()) {
    return { wechatBlocked: true };
  }

  const { appUrl, webUrl } = buildNavURLs(app, target);

  // iOS 上直接 window.location 唤起，Android 上同样可以
  // 如果 App 未安装，URL Scheme 通常会静默失败；用 setTimeout 降级到 webUrl
  const startTs = Date.now();
  const timeout = window.setTimeout(() => {
    // 若页面可见，说明 App 未唤起，降级到 webUrl
    if (Date.now() - startTs < 2500 && !document.hidden) {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  }, 2000);

  window.addEventListener('pagehide', () => window.clearTimeout(timeout), { once: true });
  window.location.href = appUrl;

  return { wechatBlocked: false };
}
