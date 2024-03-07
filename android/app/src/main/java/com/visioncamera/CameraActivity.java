package com.visioncamera;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.PorterDuff;
import android.hardware.camera2.CameraDevice;
import android.os.Bundle;
import android.os.SystemClock;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicYuvToRGB;
import android.renderscript.Type;
import android.util.Log;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Surface;
import android.view.SurfaceView;
import android.view.TextureView;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;
import com.visioncamera.camera2.Camera2Helper;
import com.visioncamera.camera2.Camera2Listener;
import com.visioncamera.thread.CustomThreadPool;
import com.visioncamera.utils.BitmapUtils;
import com.visioncamera.utils.ContextUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

public class CameraActivity extends AppCompatActivity implements Camera2Listener {

  private static final String TAG = CameraActivity.class.getSimpleName();

  private static final CustomThreadPool THREAD_POOL_TRACK = new CustomThreadPool(Thread.NORM_PRIORITY);

  private static final SparseIntArray ORIENTATIONS = new SparseIntArray();

  static {
    ORIENTATIONS.append(Surface.ROTATION_0, 0);
    ORIENTATIONS.append(Surface.ROTATION_90, 90);
    ORIENTATIONS.append(Surface.ROTATION_180, 180);
    ORIENTATIONS.append(Surface.ROTATION_270, 270);
  }

  private static class CompareSizeByArea implements Comparator<Size> {
    @Override
    public int compare(Size lhs, Size rhs) {
      return Long.signum(((long) lhs.getWidth() * lhs.getHeight())
          - ((long) rhs.getWidth() * rhs.getHeight()));
    }
  }

  private final ReentrantLock mLock = new ReentrantLock();

  private Camera2Helper mCamera2Helper;
  // 显示的旋转角度
  private int mDisplayOrientation;
  // 是否手动镜像预览
  private boolean mIsMirrorPreview;
  // 实际打开的cameraId
  private String mOpenedCameraId;
  // 图像帧数据，全局变量避免反复创建，降低gc频率
  private byte[] mCameraTrackNv21;

  private volatile boolean mIsCameraTrackReady;

  private int mPreviewW = -1;
  private int mPreviewH = -1;

  private final List<Barcode> mBarcodes = new ArrayList<>();
  private BarcodeScanner mBarcodeScanner;
  private Paint mPaint;

  private ScriptIntrinsicYuvToRGB mScriptIntrinsicYuvToRGB;
  private Allocation mInAllocation, mOutAllocation;
  private Bitmap mSourceBitmap;

  private TextureView mTvCamera;
  private SurfaceView mSfvOverlap;
  private TextView mTvCode;
  private ImageView mIvTest;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_camera);
    initViews();
    initCamera();
    initOverlap();
    initBarcodeScanner();
  }

  @Override
  protected void onResume() {
    super.onResume();
    mIsCameraTrackReady = false;
    startCamera();
  }

  @Override
  protected void onStop() {
    stopCamera();
    super.onStop();
  }

  @Override
  protected void onDestroy() {
    releaseBarcodeScanner();
    releaseCamera();
    super.onDestroy();
  }

  @Override
  public void onCameraOpened(CameraDevice cameraDevice, String cameraId, Size previewSize, int displayOrientation, boolean isMirror) {
    Log.i(TAG, "onCameraOpened: previewSize = " + previewSize.getWidth() + " x " + previewSize.getHeight()
        + ", displayOrientation = " + displayOrientation);
    this.mDisplayOrientation = displayOrientation;
    this.mIsMirrorPreview = isMirror;
    this.mOpenedCameraId = cameraId;
  }

  @Override
  public void onPreview(byte[] nv21Bytes, Size previewSize) {
    if (mCameraTrackNv21 == null) {
      mCameraTrackNv21 = new byte[nv21Bytes.length];
      mPreviewW = previewSize.getWidth();
      mPreviewH = previewSize.getHeight();
    }
    if (!mIsCameraTrackReady) {
      mLock.lock();
      System.arraycopy(nv21Bytes, 0, mCameraTrackNv21, 0, nv21Bytes.length);
      mIsCameraTrackReady = true;
      mLock.unlock();
      Log.i(TAG, "mIsCameraTrackReady: " + mIsCameraTrackReady);
      startTrack();
    }
  }

  @Override
  public void onCameraClosed() {
    Log.i(TAG, "onCameraClosed");
  }

  @Override
  public void onCameraError(Exception e) {
    Log.i(TAG, "onCameraError: " + e.fillInStackTrace());
  }

  private void initViews() {
    mTvCamera = findViewById(R.id.tv_camera);
    mSfvOverlap = findViewById(R.id.sfv_overlap);
    mTvCode = findViewById(R.id.tv_code);
    mIvTest = findViewById(R.id.iv_test);
  }

  private void initCamera() {
    if (mCamera2Helper != null) {
      return;
    }
    Camera2Helper.Builder cameraBuilder = new Camera2Helper.Builder()
        .context(ContextUtils.getContext())
        .specificCameraId(Camera2Helper.getCameraIdBack())
        .previewOn(mTvCamera)
        .cameraListener(this);
    mCamera2Helper = cameraBuilder.build();
  }

  private void startCamera() {
    if (mCamera2Helper == null) {
      return;
    }
    mCamera2Helper.start();
  }

  private void stopCamera() {
    if (mCamera2Helper == null) {
      return;
    }
    mCamera2Helper.stop();
  }

  private void releaseCamera() {
    if (mCamera2Helper == null) {
      return;
    }
    mCamera2Helper.release();
    mCamera2Helper = null;
  }

  private void initOverlap() {
    ViewGroup.LayoutParams layoutParams = mTvCamera.getLayoutParams();
    mSfvOverlap.setLayoutParams(layoutParams);
    mSfvOverlap.setZOrderOnTop(true);
    mSfvOverlap.getHolder().setFormat(PixelFormat.TRANSPARENT);
    mPaint = new Paint();
    mPaint.setStyle(Paint.Style.STROKE);
    mPaint.setColor(Color.BLUE);
    mPaint.setStrokeWidth(5);
    mPaint.setTextSize(50);
  }

  private void initBarcodeScanner() {
    if (mBarcodeScanner == null) {
      BarcodeScannerOptions options =
          new BarcodeScannerOptions.Builder().setBarcodeFormats(
              Barcode.FORMAT_CODE_128,
              Barcode.FORMAT_CODE_39,
              Barcode.FORMAT_CODE_93,
              Barcode.FORMAT_CODABAR,
              Barcode.FORMAT_EAN_13,
              Barcode.FORMAT_EAN_8,
              Barcode.FORMAT_ITF,
              Barcode.FORMAT_UPC_A,
              Barcode.FORMAT_UPC_E,
              Barcode.FORMAT_QR_CODE,
              Barcode.FORMAT_PDF417,
              Barcode.FORMAT_AZTEC,
              Barcode.FORMAT_DATA_MATRIX).build();
      mBarcodeScanner = BarcodeScanning.getClient(options);
    }
  }

  private void releaseBarcodeScanner() {
    if (mBarcodeScanner == null) {
      return;
    }
    mBarcodeScanner.close();
    mBarcodeScanner = null;
  }

  private void startTrack() {
    THREAD_POOL_TRACK.execute(() -> {
      if (mIsCameraTrackReady) {
        InputImage image = InputImage.fromByteArray(mCameraTrackNv21, mPreviewW, mPreviewH,
            // 对于前置数据，镜像处理；若手动设置镜像预览，则镜像处理；若都有，则不需要镜像处理
            Camera2Helper.getCameraIdFront().equals(mOpenedCameraId) ^ mIsMirrorPreview
                ? 360 - mDisplayOrientation : mDisplayOrientation,
            InputImage.IMAGE_FORMAT_NV21
        );
        // testBitmap();
        if (mBarcodeScanner == null) {
          mLock.lock();
          mIsCameraTrackReady = false;
          mLock.unlock();
          return;
        }
        mBarcodeScanner.process(image).addOnSuccessListener(barcodes -> {
          if (barcodes.size() == 0) {
            clearCanvas();
            mLock.lock();
            mIsCameraTrackReady = false;
            mLock.unlock();
            return;
          }
          mBarcodes.addAll(barcodes);
          drawBarcodes(mBarcodes);
          runOnUiThread(() -> {
            mTvCode.setText(mBarcodes.get(0).getDisplayValue());
          });
          mBarcodes.clear();
          mLock.lock();
          mIsCameraTrackReady = false;
          mLock.unlock();
        }).addOnFailureListener(e -> {
          Log.i(TAG, "Barcode tracking error: " + e.fillInStackTrace());
          mLock.lock();
          mIsCameraTrackReady = false;
          mLock.unlock();
        });
      }
    });
  }

  private void drawBarcodes(List<Barcode> barcodes) {
    if (barcodes != null && barcodes.size() > 0) {
      Canvas canvas = mSfvOverlap.getHolder().lockCanvas();
      if (canvas == null) {
        return;
      }
      canvas.drawColor(0, PorterDuff.Mode.CLEAR);
      // Only take face 0
      Barcode barcode = barcodes.get(0);
      canvas.save();
      canvas.setMatrix(mTvCamera.getMatrix());
      if (barcode.getBoundingBox() == null) {
        return;
      }
      int centerX = barcode.getBoundingBox().centerX();
      int centerY = barcode.getBoundingBox().centerY();
      int width = barcode.getBoundingBox().width();
      int height = barcode.getBoundingBox().height();
      // scale
      float scaledCenterX = centerX * canvas.getHeight() * 1.0f / mPreviewW;
      float scaledCenterY = centerY * canvas.getWidth() * 1.0f / mPreviewH;
      float scaledWidth = width * canvas.getHeight() * 1.0f / mPreviewW;
      float scaledHeight = height * canvas.getWidth() * 1.0f / mPreviewH;
      Log.i(TAG, "scaledX: " + (canvas.getHeight() * 1.0f / mPreviewW));
      Log.i(TAG, "scaledY: " + (canvas.getWidth() * 1.0f / mPreviewH));

      int extraWidth = 20;
      int extraBottom = 50;
      canvas.drawRect(
          canvas.getWidth() - scaledCenterX - scaledWidth / 2 + extraWidth,
          scaledCenterY  - scaledHeight / 2,
          canvas.getWidth() - scaledCenterX + scaledWidth / 2 - extraWidth,
          scaledCenterY  + scaledHeight / 2 - extraBottom,
          mPaint);
      canvas.drawText("Detecting...",
          canvas.getWidth() - scaledCenterX - scaledWidth / 2 + extraWidth,
          scaledCenterY  - scaledHeight / 2 - 30, mPaint);
      canvas.restore();
      mSfvOverlap.getHolder().unlockCanvasAndPost(canvas);
    } else {
      clearCanvas();
    }
  }

  private void testBitmap() {
    Bitmap sceneBtm = getSceneBtm(mCameraTrackNv21, mPreviewW, mPreviewH);
    Bitmap rotatedBtm = BitmapUtils.rotateBitmap(
        sceneBtm,
        // 对于前置数据，镜像处理；若手动设置镜像预览，则镜像处理；若都有，则不需要镜像处理
        Camera2Helper.getCameraIdFront().equals(mOpenedCameraId) ^ mIsMirrorPreview
            ? 360 - mDisplayOrientation : mDisplayOrientation,
        true,
        false);
    runOnUiThread(() -> {
      mIvTest.setImageBitmap(rotatedBtm);
    });
  }

  private void clearCanvas() {
    if (mSfvOverlap == null) {
      return;
    }
    Canvas canvas = mSfvOverlap.getHolder().lockCanvas();
    if (canvas != null) {
      canvas.drawColor(0, PorterDuff.Mode.CLEAR);
      mSfvOverlap.getHolder().unlockCanvasAndPost(canvas);
    }
  }

  /**
   * 根据nv21数据生成bitmap
   * 8ms左右
   */
  private Bitmap getSceneBtm(byte[] nv21Bytes, int width, int height) {
    if (nv21Bytes == null) {
      return null;
    }
    if (mInAllocation == null) {
      initRenderScript(width, height);
    }
    long s = SystemClock.uptimeMillis();
    mInAllocation.copyFrom(nv21Bytes);
    mScriptIntrinsicYuvToRGB.setInput(mInAllocation);
    mScriptIntrinsicYuvToRGB.forEach(mOutAllocation);
    if (mSourceBitmap == null || mSourceBitmap.getWidth() * mSourceBitmap.getHeight() != width * height) {
      mSourceBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    }
    mOutAllocation.copyTo(mSourceBitmap);
    Log.i(TAG, "getSceneBtm = " + Math.abs(SystemClock.uptimeMillis() - s));
    return mSourceBitmap;
  }

  private void initRenderScript(int width, int height) {
    RenderScript mRenderScript = RenderScript.create(ContextUtils.getContext());
    mScriptIntrinsicYuvToRGB = ScriptIntrinsicYuvToRGB.create(mRenderScript,
        Element.U8_4(mRenderScript));

    Type.Builder yuvType = new Type.Builder(mRenderScript, Element.U8(mRenderScript))
        .setX(width * height * 3 / 2);
    mInAllocation = Allocation.createTyped(mRenderScript,
        yuvType.create(),
        Allocation.USAGE_SCRIPT);

    Type.Builder rgbaType = new Type.Builder(mRenderScript, Element.RGBA_8888(mRenderScript))
        .setX(width).setY(height);
    mOutAllocation = Allocation.createTyped(mRenderScript,
        rgbaType.create(),
        Allocation.USAGE_SCRIPT);
  }
}
