package com.visioncamera.utils;

import android.app.ActivityManager;
import android.content.Context;
import android.text.TextUtils;

import java.io.File;

/**
 * 系统属性获取修改工具类
 */
public final class SystemUtils {

  private SystemUtils() {
  }

  /**
   * 判断是不是UI主进程，因为有些东西只能在UI主进程初始化
   */
  public static boolean isAppMainProcess(Context context) {
    try {
      int pid = android.os.Process.myPid();
      String process = getAppNameByPID(context.getApplicationContext(), pid);
      if (TextUtils.isEmpty(process)) {
        return true;
      } else {
        return context.getPackageName().equalsIgnoreCase(process);
      }
    } catch (Exception e) {
      e.printStackTrace();
      return true;
    }
  }

  /**
   * 根据Pid得到进程名
   */
  public static String getAppNameByPID(Context context, int pid) {
    ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    for (ActivityManager.RunningAppProcessInfo processInfo : manager.getRunningAppProcesses()) {
      if (processInfo.pid == pid) {
        return processInfo.processName;
      }
    }
    return "";
  }
}
