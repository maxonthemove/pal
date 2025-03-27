/**
 * 版权所有（C）Live2D Inc.保留所有权利。
 *
 * 此源代码的使用由LIVE2D打开软件许可证约束
 * 可以在https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html上找到。
 */

/**
 * 立体主义平台抽象层，抽象依赖平台的特征。
 *
 * 汇总了平台依赖性功能，例如文件加载和时间获取。
 */
export class LAppPal {
  /**
   * 将文件读取为字节数据
   *
   * @param filePath 要加载的文件的路径
   * @return
   * {
   *      缓冲区，读取字节数据
   *      大小文件大小
   * }
   */
  public static loadFileAsBytes(
    filePath: string,
    callback: (arrayBuffer: ArrayBuffer, size: number) => void
  ): void {
    fetch(filePath)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => callback(arrayBuffer, arrayBuffer.byteLength));
  }

  /**
   * 获取三角洲时间（与上一个帧有所不同）
   * @return 增量时间[MS]
   */
  public static getDeltaTime(): number {
    return this.deltaTime;
  }

  public static updateTime(): void {
    this.currentFrame = Date.now();
    this.deltaTime = (this.currentFrame - this.lastFrame) / 1000;
    this.lastFrame = this.currentFrame;
  }

  /**
   * 输出消息
   * @param message 细绳
   */
  public static printMessage(message: string): void {
    console.log(message);
  }

  static lastUpdate = Date.now();

  static currentFrame = 0.0;
  static lastFrame = 0.0;
  static deltaTime = 0.0;
}
