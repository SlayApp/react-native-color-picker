package com.reactnative.colorpicker;

import android.app.Activity;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.github.dhaval2404.colorpicker.ColorPickerDialog;
import com.github.dhaval2404.colorpicker.listener.ColorListener;
import com.github.dhaval2404.colorpicker.model.ColorShape;

@ReactModule(name = ColorPickerModule.NAME)
public class ColorPickerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ColorPickerModule";

    private @Nullable ColorPickerDialog colorPickerDialog;
    private @Nullable Callback colorSelectedCallback;
    private @Nullable Callback dismissedCallback;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public ColorPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void show(ReadableMap options, final Callback colorSelectedCallback, final Callback dismissedCallback) {
        this.colorSelectedCallback = colorSelectedCallback;
        this.dismissedCallback = dismissedCallback;

        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null || !(currentActivity instanceof FragmentActivity)) {
            if (dismissedCallback != null) {
                dismissedCallback.invoke();
            }
            return;
        }

        final FragmentActivity fragmentActivity = (FragmentActivity) currentActivity;
        final String initialColor = options.hasKey("color") ? options.getString("color") : "#FF0000";
        final String title = options.hasKey("title") ? options.getString("title") : "Select a Color";
        final boolean supportsAlpha = options.hasKey("supportsAlpha") && options.getBoolean("supportsAlpha");

        // Ensure dialog is created and shown on the UI thread
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                int colorInt;
                try {
                    colorInt = Color.parseColor(initialColor);
                } catch (IllegalArgumentException e) {
                    colorInt = Color.RED;
                }

                colorPickerDialog = new ColorPickerDialog
                        .Builder(fragmentActivity)
                        .setTitle(title)
                        .setColorShape(ColorShape.CIRCLE)
                        .setDefaultColor(colorInt)
                        .setColorListener(new ColorListener() {
                            @Override
                            public void onColorSelected(int color, String colorHex) {
                                if (ColorPickerModule.this.colorSelectedCallback != null) {
                                    ColorPickerModule.this.colorSelectedCallback.invoke(colorHex);
                                }
                                colorPickerDialog = null;
                            }
                        })
                        .build();

                // Since we can't access the dialog directly, we'll call the dismissed callback
                // when the color dialog is hidden by any means
                mainHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if (colorPickerDialog == null && ColorPickerModule.this.dismissedCallback != null) {
                            ColorPickerModule.this.dismissedCallback.invoke();
                        }
                    }
                }, 500);

                colorPickerDialog.show();
            }
        });
    }

    @ReactMethod
    public void hide() {
        // We can only clear our reference to the dialog
        // The dialog itself handles its own lifecycle and doesn't provide a dismiss method
        colorPickerDialog = null;
        
        // If there's a pending dismissed callback, invoke it
        if (dismissedCallback != null) {
            dismissedCallback.invoke();
            dismissedCallback = null;
        }
    }

    @ReactMethod
    public void registerDevMenu() {
        if (BuildConfig.DEBUG) {
            ColorPickerDevMenu.register(getReactApplicationContext());
        }
    }

    private String colorIntToHex(int colorInt) {
        return String.format("#%06X", (0xFFFFFF & colorInt));
    }

    private int hexToColorInt(String hex) {
        try {
            return Color.parseColor(hex);
        } catch (IllegalArgumentException e) {
            return Color.RED;
        }
    }
}
