package com.visioncamera;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class ActivityStarterReactPackage implements ReactPackage {

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext context) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new ActivityStarterModule(context));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext context) {
    return Collections.emptyList();
  }
}
