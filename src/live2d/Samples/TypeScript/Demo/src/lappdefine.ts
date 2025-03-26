/**
 * 版权所有(c) Live2D Inc. 保留所有权利。
 *
 * 本源代码的使用受Live2D开放软件许可协议的约束，
 * 该协议可在以下网址找到：https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html。
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample App中使用的常量
 */

// 画布宽度和高度的像素值，或动态屏幕大小（'auto'）。
export const CanvasSize: { width: number; height: number } | 'auto' = 'auto';

// 画布的数量
export const CanvasNum = 1;

// 画面
export const ViewScale = 1.0;
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;
export const ViewLogicalBottom = -1.0;
export const ViewLogicalTop = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 相对路径
export const ResourcesPath = '../../Resources/';

// 模型后面的背景图片文件
export const BackImageName = 'back_class_normal.png';

// 齿轮图标
export const GearImageName = 'icon_gear.png';

// 关闭按钮
export const PowerImageName = 'CloseNormal.png';

// 模型定义---------------------------------------------
// 模型所在目录名称的数组
// 确保目录名称与model3.json的名称一致
export const ModelDir: string[] = [
  'Haru',
  'Hiyori',
  'Mark',
  'Natori',
  'Rice',
  'Mao',
  'Wanko'
];
export const ModelDirSize: number = ModelDir.length;

// 与外部定义文件（json）一致
export const MotionGroupIdle = 'Idle'; // 待机
export const MotionGroupTapBody = 'TapBody'; // 点击身体时

// 与外部定义文件（json）一致
export const HitAreaNameHead = 'Head'; // 头部
export const HitAreaNameBody = 'Body'; // 身体

// 动作的优先级常量
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// MOC3一致性验证选项
export const MOCConsistencyValidationEnable = true;

// 调试日志显示选项
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Framework输出日志的级别设置
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// 默认的渲染目标尺寸
export const RenderTargetWidth = 1900;
export const RenderTargetHeight = 1000;
