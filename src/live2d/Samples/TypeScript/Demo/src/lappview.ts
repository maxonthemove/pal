/**
 * 版权所有（C）Live2D Inc.保留所有权利。
 *
 * 该源代码用于通过Live2D打开软件许可约束
 * 可以在https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html上找到。
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { CubismViewMatrix } from '@framework/math/cubismviewmatrix';

import * as LAppDefine from './lappdefine';
import { LAppDelegate } from './lappdelegate';
import { LAppPal } from './lapppal';
import { LAppSprite } from './lappsprite';
import { TextureInfo } from './lapptexturemanager';
import { TouchManager } from './touchmanager';
import { LAppSubdelegate } from './lappsubdelegate';

/**
 * 绘图类。
 */
export class LAppView {
  /**
   * 构造函数
   */
  public constructor() {
    this._programId = null;
    this._back = null;
    this._gear = null;

    // 触摸事件管理
    this._touchManager = new TouchManager();

    // 用于将设备坐标转换为屏幕坐标
    this._deviceToScreen = new CubismMatrix44();

    // 用于屏幕显示Zoom的矩阵并移动转换
    this._viewMatrix = new CubismViewMatrix();
  }

  /**
   * 初始化
   */
  public initialize(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
    const { width, height } = subdelegate.getCanvas();

    const ratio: number = width / height;
    const left: number = -ratio;
    const right: number = ratio;
    const bottom: number = LAppDefine.ViewLogicalLeft;
    const top: number = LAppDefine.ViewLogicalRight;

    this._viewMatrix.setScreenRect(left, right, bottom, top); // 屏幕范围对应于设备。 x左边界，x右边界，y下边界，y上边界，y上边界
    this._viewMatrix.scale(LAppDefine.ViewScale, LAppDefine.ViewScale);

    this._deviceToScreen.loadIdentity();
    if (width > height) {
      const screenW: number = Math.abs(right - left);
      this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
    } else {
      const screenH: number = Math.abs(top - bottom);
      this._deviceToScreen.scaleRelative(screenH / height, -screenH / height);
    }
    this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);

    // 显示范围设置
    this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 最大放大倍率
    this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 最小降低率

    // 可以显示的最大范围
    this._viewMatrix.setMaxScreenRect(
      LAppDefine.ViewLogicalMaxLeft,
      LAppDefine.ViewLogicalMaxRight,
      LAppDefine.ViewLogicalMaxBottom,
      LAppDefine.ViewLogicalMaxTop
    );
  }

  /**
   * release
   */
  public release(): void {
    this._viewMatrix = null;
    this._touchManager = null;
    this._deviceToScreen = null;

    this._gear.release();
    this._gear = null;

    this._back.release();
    this._back = null;

    this._subdelegate.getGlManager().getGl().deleteProgram(this._programId);
    this._programId = null;
  }

  /**
   * painting.
   */
  public render(): void {
    this._subdelegate.getGlManager().getGl().useProgram(this._programId);

    if (this._back) {
      this._back.render(this._programId);
    }
    if (this._gear) {
      this._gear.render(this._programId);
    }

    this._subdelegate.getGlManager().getGl().flush();

    const lapplive2dmanager = this._subdelegate.getLive2DManager();
    if (lapplive2dmanager != null) {
      lapplive2dmanager.setViewMatrix(this._viewMatrix);

      lapplive2dmanager.onUpdate();
    }
  }

  /**
   * Initialize the image.
   */
  public initializeSprite(): void {
    const width: number = this._subdelegate.getCanvas().width;
    const height: number = this._subdelegate.getCanvas().height;
    const textureManager = this._subdelegate.getTextureManager();
    const resourcesPath = LAppDefine.ResourcesPath;

    let imageName = '';

    // 背景图像初始化
    imageName = LAppDefine.BackImageName;

    // Create a callback function because it is asynchronous
    const initBackGroundTexture = (textureInfo: TextureInfo): void => {
      const x: number = width * 0.5;
      const y: number = height * 0.5;

      const fwidth = textureInfo.width * 2.0;
      const fheight = height * 0.95;
      this._back = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
      this._back.setSubdelegate(this._subdelegate);
    };

    textureManager.createTextureFromPngFile(
      resourcesPath + imageName,
      false,
      initBackGroundTexture
    );

    // 齿轮图像初始化
    imageName = LAppDefine.GearImageName;
    const initGearTexture = (textureInfo: TextureInfo): void => {
      const x = width - textureInfo.width * 0.5;
      const y = height - textureInfo.height * 0.5;
      const fwidth = textureInfo.width;
      const fheight = textureInfo.height;
      this._gear = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
      this._gear.setSubdelegate(this._subdelegate);
    };

    textureManager.createTextureFromPngFile(
      resourcesPath + imageName,
      false,
      initGearTexture
    );

    // 创建一个着色器
    if (this._programId == null) {
      this._programId = this._subdelegate.createShader();
    }
  }

  /**
   * Call when touched.
   *
   * @param pointX Screen X coordinate
   * @param pointY Screen Y coordinates
   */
  public onTouchesBegan(pointX: number, pointY: number): void {
    this._touchManager.touchesBegan(
      pointX * window.devicePixelRatio,
      pointY * window.devicePixelRatio
    );
  }

  /**
   * If the pointer moves when touched.
   *
   * @param pointX Screen X coordinate
   * @param pointY Screen Y coordinates
   */
  public onTouchesMoved(pointX: number, pointY: number): void {
    const posX = pointX * window.devicePixelRatio;
    const posY = pointY * window.devicePixelRatio;

    const lapplive2dmanager = this._subdelegate.getLive2DManager();

    const viewX: number = this.transformViewX(this._touchManager.getX());
    const viewY: number = this.transformViewY(this._touchManager.getY());

    this._touchManager.touchesMoved(posX, posY);

    lapplive2dmanager.onDrag(viewX, viewY);
  }

  /**
   * Once the touch is finished, you will be called.
   *
   * @param pointX Screen X coordinate
   * @param pointY Screen Y coordinates
   */
  public onTouchesEnded(pointX: number, pointY: number): void {
    const posX = pointX * window.devicePixelRatio;
    const posY = pointY * window.devicePixelRatio;

    const lapplive2dmanager = this._subdelegate.getLive2DManager();

    // Finish
    lapplive2dmanager.onDrag(0.0, 0.0);

    // Single point
    const x: number = this.transformViewX(posX);
    const y: number = this.transformViewY(posY);

    if (LAppDefine.DebugTouchLogEnable) {
      LAppPal.printMessage(`[APP]touchesEnded x: ${x} y: ${y}`);
    }
    lapplive2dmanager.onTap(x, y);

    // Have you tapped the equipment?
    if (this._gear.isHit(posX, posY)) {
      lapplive2dmanager.nextScene();
    }
  }

  /**
   * 将X坐标转换为查看坐标。
   *
   * @param deviceX 设备X坐标
   */
  public transformViewX(deviceX: number): number {
    const screenX: number = this._deviceToScreen.transformX(deviceX); // Gets the coordinates that have been converted to logical coordinates.
    return this._viewMatrix.invertTransformX(screenX); // 缩放，缩小和移动后的值。
  }

  /**
   * 转换Y坐标以查看坐标。
   *
   * @param deviceY 设备y坐标
   */
  public transformViewY(deviceY: number): number {
    const screenY: number = this._deviceToScreen.transformY(deviceY); // Gets the coordinates that have been converted to logical coordinates.
    return this._viewMatrix.invertTransformY(screenY);
  }

  /**
   * 将X坐标转换为屏幕坐标。
   * @param deviceX 设备X坐标
   */
  public transformScreenX(deviceX: number): number {
    return this._deviceToScreen.transformX(deviceX);
  }

  /**
   * 将Y坐标转换为屏幕坐标。
   *
   * @param deviceY 设备y坐标
   */
  public transformScreenY(deviceY: number): number {
    return this._deviceToScreen.transformY(deviceY);
  }

  _touchManager: TouchManager; // 触摸管理器
  _deviceToScreen: CubismMatrix44; // 屏幕矩阵的设备
  _viewMatrix: CubismViewMatrix; // 查看矩阵
  _programId: WebGLProgram; // 着色器ID
  _back: LAppSprite; // 背景图片
  _gear: LAppSprite; // 齿轮图片
  _changeModel: boolean; // 型号切换徽标
  _isClick: boolean; // 点击状态
  private _subdelegate: LAppSubdelegate;
}
