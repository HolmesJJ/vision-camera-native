package com.visioncamera.camera2;

import android.hardware.camera2.CameraDevice;
import android.util.Size;

public interface Camera2Listener {
  /**
   * 当打开时执行
   * @param cameraDevice 相机实例
   * @param cameraId 相机ID
   * @param displayOrientation 相机预览旋转角度
   * @param isMirror 是否镜像显示
   */
  void onCameraOpened(CameraDevice cameraDevice, String cameraId, Size previewSize, int displayOrientation, boolean isMirror);

  /**
   * 预览数据回调
   * @param nv21Bytes 预览数据
   * @param previewSize 预览尺寸
   */
  void onPreview(byte[] nv21Bytes, Size previewSize);

  /**
   * 当相机关闭时执行
   */
  void onCameraClosed();

  /**
   * 当出现异常时执行
   * @param e 相机相关异常
   */
  void onCameraError(Exception e);
}
