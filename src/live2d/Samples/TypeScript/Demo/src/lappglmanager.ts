/**
 * 版权所有（C）Live2D Inc.保留所有权利。
 *
 * 此源代码的使用由LIVE2D打开软件许可证约束
 * 可以在https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html上找到。
 */

/**
 * 用于管理 Cubism SDK 示例中使用的 WebGL 的类
 */
export class LAppGlManager {
  public constructor() {
    this._gl = null;
  }

  public initialize(canvas: HTMLCanvasElement): boolean {
    // 初始化 gl 上下文
    this._gl = canvas.getContext('webgl2');

    if (!this._gl) {
      // gl 初始化失败
      alert('Cannot initialize WebGL. This browser does not support.');
      this._gl = null;
      // document.body.innerHTML =
      //   'This browser does not support the <code>&lt;canvas&gt;</code> element.';
      return false;
    }
    return true;
  }

  /**
   * 释放资源
   */
  public release(): void {}

  public getGl(): WebGLRenderingContext | WebGL2RenderingContext {
    return this._gl;
  }

  private _gl: WebGLRenderingContext | WebGL2RenderingContext = null;
}
