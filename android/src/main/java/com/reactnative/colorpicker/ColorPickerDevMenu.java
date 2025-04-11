package com.reactnative.colorpicker;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.devsupport.interfaces.DevSupportManager;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;

import java.lang.reflect.Method;
import java.util.HashMap;

/**
 * Adds a color picker option to the React Native dev menu
 */
public class ColorPickerDevMenu {
    private static final String TAG = "ColorPickerDevMenu";

    public static void register(final ReactApplicationContext reactContext) {
        try {
            DevSupportManager devSupportManager = getDevSupportManager(reactContext);
            if (devSupportManager == null) {
                Log.e(TAG, "Could not get DevSupportManager");
                return;
            }

            UiThreadUtil.runOnUiThread(() -> {
                try {
                    Method addCustomDevOptionMethod = devSupportManager.getClass().getMethod(
                            "addCustomDevOption",
                            String.class,
                            Runnable.class);

                    addCustomDevOptionMethod.invoke(
                            devSupportManager,
                            "Show Color Picker",
                            (Runnable) () -> {
                                Activity currentActivity = reactContext.getCurrentActivity();
                                if (currentActivity == null || !(currentActivity instanceof FragmentActivity)) {
                                    Log.e(TAG, "Current activity is not a FragmentActivity");
                                    return;
                                }

                                ColorPickerModule colorPickerModule = new ColorPickerModule(reactContext);
                                WritableMap options = Arguments.createMap();
                                options.putString("color", "#FF0000");
                                options.putBoolean("supportsAlpha", true);
                                options.putString("title", "Dev Menu Color Picker");

                                colorPickerModule.show(
                                        options,
                                        new Callback() {
                                            @Override
                                            public void invoke(Object... args) {
                                                String color = args.length > 0 ? (String) args[0] : "#FF0000";
                                                Log.d(TAG, "Dev Menu Color Picker: Selected color " + color);
                                            }
                                        },
                                        new Callback() {
                                            @Override
                                            public void invoke(Object... args) {
                                                Log.d(TAG, "Dev Menu Color Picker: Dismissed");
                                            }
                                        }
                                );
                            });
                } catch (Exception e) {
                    Log.e(TAG, "Error adding custom dev option", e);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error registering dev menu", e);
        }
    }

    private static DevSupportManager getDevSupportManager(ReactContext reactContext) {
        try {
            Method getDevSupportManagerMethod = reactContext.getClass().getMethod("getDevSupportManager");
            return (DevSupportManager) getDevSupportManagerMethod.invoke(reactContext);
        } catch (Exception e) {
            Log.e(TAG, "Error getting DevSupportManager", e);
            return null;
        }
    }
}
