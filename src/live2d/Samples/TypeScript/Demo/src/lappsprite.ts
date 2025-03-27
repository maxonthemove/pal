/**
 * 版权所有（C）Live2D Inc.保留所有权利。
 *
 * 此源代码的使用由LIVE2D打开软件许可证约束
 * 可以在https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html上找到。
 */

import { LAppSubdelegate } from './lappsubdelegate';

/**
 * 实施精灵的课程
 *
 * 纹理ID和RECT管理
 */
export class LAppSprite {
  /**
   * 构造函数
   * @param x            x坐标
   * @param y            y坐标
   * @param width        宽度
   * @param height       高度
   * @param textureId    质地
   */
  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    textureId: WebGLTexture
  ) {
    this._rect = new Rect();
    this._rect.left = x - width * 0.5;
    this._rect.right = x + width * 0.5;
    this._rect.up = y + height * 0.5;
    this._rect.down = y - height * 0.5;
    this._texture = textureId;
    this._vertexBuffer = null;
    this._uvBuffer = null;
    this._indexBuffer = null;

    this._positionLocation = null;
    this._uvLocation = null;
    this._textureLocation = null;

    this._positionArray = null;
    this._uvArray = null;
    this._indexArray = null;

    this._firstDraw = true;
  }

  /**
   * 发布。
   */
  public release(): void {
    this._rect = null;

    const gl = this._subdelegate.getGlManager().getGl();

    gl.deleteTexture(this._texture);
    this._texture = null;

    gl.deleteBuffer(this._uvBuffer);
    this._uvBuffer = null;

    gl.deleteBuffer(this._vertexBuffer);
    this._vertexBuffer = null;

    gl.deleteBuffer(this._indexBuffer);
    this._indexBuffer = null;
  }

  /**
   * 返回纹理
   */
  public getTexture(): WebGLTexture {
    return this._texture;
  }

  /**
   * 画。
   * @param programId 着色器程序
   * @param canvas 校园信息绘制
   */
  public render(programId: WebGLProgram): void {
    if (this._texture == null) {
      // 加载尚未完成
      return;
    }

    const gl = this._subdelegate.getGlManager().getGl();

    // When drawing for the first time
    if (this._firstDraw) {
      // 获取属性变量的数量
      this._positionLocation = gl.getAttribLocation(programId, 'position');
      gl.enableVertexAttribArray(this._positionLocation);

      this._uvLocation = gl.getAttribLocation(programId, 'uv');
      gl.enableVertexAttribArray(this._uvLocation);

      // 获取什么统一变量
      this._textureLocation = gl.getUniformLocation(programId, 'texture');

      // 注册统一属性
      gl.uniform1i(this._textureLocation, 0);

      // 紫外线缓冲，协调初始化
      {
        this._uvArray = new Float32Array([
          1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0
        ]);

        // 创建一个紫外线缓冲区
        this._uvBuffer = gl.createBuffer();
      }

      // 顶点缓冲，协调初始化
      {
        const maxWidth = this._subdelegate.getCanvas().width;
        const maxHeight = this._subdelegate.getCanvas().height;

        // 顶点数据
        this._positionArray = new Float32Array([
          (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5)
        ]);

        // 创建一个顶点缓冲区
        this._vertexBuffer = gl.createBuffer();
      }

      // 顶点索引缓冲区，初始化
      {
        // 索引数据
        this._indexArray = new Uint16Array([0, 1, 2, 3, 2, 0]);

        // 创建索引缓冲区
        this._indexBuffer = gl.createBuffer();
      }

      this._firstDraw = false;
    }

    // UV coordinate registration
    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._uvArray, gl.STATIC_DRAW);

    // 注册属性属性
    gl.vertexAttribPointer(this._uvLocation, 2, gl.FLOAT, false, 0, 0);

    // 注册顶点坐标
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionArray, gl.STATIC_DRAW);

    // 注册属性属性
    gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 创建一个顶点索引
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexArray, gl.DYNAMIC_DRAW);

    // 绘制模型
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.drawElements(
      gl.TRIANGLES,
      this._indexArray.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  /**
   * 获胜检测
   * @param pointX x坐标
   * @param pointY y坐标
   */
  public isHit(pointX: number, pointY: number): boolean {
    // 获取屏幕尺寸。
    const { height } = this._subdelegate.getCanvas();

    // y坐标需要转换
    const y = height - pointY;

    return (
      pointX >= this._rect.left &&
      pointX <= this._rect.right &&
      y <= this._rect.up &&
      y >= this._rect.down
    );
  }

  /**
   * 放
   * @param subdelegate
   */
  public setSubdelegate(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
  }

  _texture: WebGLTexture; // 质地
  _vertexBuffer: WebGLBuffer; // 顶点缓冲区
  _uvBuffer: WebGLBuffer; // UV顶点缓冲区
  _indexBuffer: WebGLBuffer; // 顶点索引缓冲区
  _rect: Rect; // rectangle

  _positionLocation: number;
  _uvLocation: number;
  _textureLocation: WebGLUniformLocation;

  _positionArray: Float32Array;
  _uvArray: Float32Array;
  _indexArray: Uint16Array;

  _firstDraw: boolean;

  private _subdelegate: LAppSubdelegate;
}

export class Rect {
  public left: number; // Left side
  public right: number; // right side
  public up: number; // 顶部
  public down: number; // The bottom
}
