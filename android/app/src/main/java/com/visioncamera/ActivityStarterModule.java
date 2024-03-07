package com.visioncamera;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

final class ActivityStarterModule extends ReactContextBaseJavaModule {

  private static final String TAG = ActivityStarterModule.class.getSimpleName();

  ActivityStarterModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    // https://github.com/facebook/react-native/issues/26813
    return "ActivityStarter"; // Cannot be "ActivityStarterModule"!
  }

  @ReactMethod
  public void getTimestamp() {
    Log.i(TAG, "getTimestamp(): " + System.currentTimeMillis());
  }

  @ReactMethod
  public void navigateToCamera() {
    Activity activity = getCurrentActivity();
    if (activity != null) {
      Intent intent = new Intent(activity, CameraActivity.class);
      activity.startActivity(intent);
    }
  }
}
