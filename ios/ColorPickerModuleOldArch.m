#import "ColorPickerModuleOldArch.h"
#import <UIKit/UIKit.h>

@interface ColorPickerModuleOldArch() <UIColorPickerViewControllerDelegate>
@property (nonatomic, strong) UIColorPickerViewController *colorPickerViewController;
@property (nonatomic, copy) RCTResponseSenderBlock colorSelectedCallback;
@property (nonatomic, copy) RCTResponseSenderBlock dismissedCallback;
@end

@implementation ColorPickerModuleOldArch

RCT_EXPORT_MODULE(ColorPickerModule);

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(show:(NSDictionary *)options
                  onColorSelected:(RCTResponseSenderBlock)colorSelectedCallback
                  onDismissed:(RCTResponseSenderBlock)dismissedCallback)
{
  // Store callbacks
  self.colorSelectedCallback = colorSelectedCallback;
  self.dismissedCallback = dismissedCallback;
  
  // Create color picker controller
  self.colorPickerViewController = [[UIColorPickerViewController alloc] init];
  self.colorPickerViewController.delegate = self;
  
  // Set initial color
  NSString *colorString = options[@"color"] ? options[@"color"] : @"#FF0000";
  UIColor *initialColor = [self colorFromHexString:colorString];
  self.colorPickerViewController.selectedColor = initialColor;
  
  // Set alpha support
  BOOL supportsAlpha = options[@"supportsAlpha"] ? [options[@"supportsAlpha"] boolValue] : YES;
  self.colorPickerViewController.supportsAlpha = supportsAlpha;
  
  // Present the color picker
  UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
  [rootViewController presentViewController:self.colorPickerViewController animated:YES completion:nil];
}

RCT_EXPORT_METHOD(hide)
{
  if (self.colorPickerViewController) {
    [self.colorPickerViewController dismissViewControllerAnimated:YES completion:nil];
    self.colorPickerViewController = nil;
  }
}

RCT_EXPORT_METHOD(registerDevMenu)
{
  // Implementation for dev menu registration will be added later
}

#pragma mark - UIColorPickerViewControllerDelegate

- (void)colorPickerViewControllerDidFinish:(UIColorPickerViewController *)viewController
{
  UIColor *selectedColor = viewController.selectedColor;
  NSString *hexColor = [self hexStringFromColor:selectedColor];
  
  if (self.colorSelectedCallback) {
    self.colorSelectedCallback(@[hexColor]);
  }
  
  self.colorPickerViewController = nil;
}

- (void)colorPickerViewControllerDidSelectColor:(UIColorPickerViewController *)viewController
{
  // This method is called when the user changes the color, but hasn't dismissed the picker yet
  // We don't need to handle this for now
}

- (void)colorPickerViewControllerDidCancel:(UIColorPickerViewController *)viewController
{
  if (self.dismissedCallback) {
    self.dismissedCallback(@[]);
  }
  
  self.colorPickerViewController = nil;
}

#pragma mark - Helper Methods

// Convert hex string to UIColor
- (UIColor *)colorFromHexString:(NSString *)hexString
{
  if (![hexString hasPrefix:@"#"]) {
    hexString = [NSString stringWithFormat:@"#%@", hexString];
  }
  
  unsigned int hexValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:[hexString substringFromIndex:1]];
  [scanner scanHexInt:&hexValue];
  
  CGFloat red = ((hexValue & 0xFF0000) >> 16) / 255.0;
  CGFloat green = ((hexValue & 0x00FF00) >> 8) / 255.0;
  CGFloat blue = (hexValue & 0x0000FF) / 255.0;
  
  return [UIColor colorWithRed:red green:green blue:blue alpha:1.0];
}

// Convert UIColor to hex string
- (NSString *)hexStringFromColor:(UIColor *)color
{
  CGFloat red, green, blue, alpha;
  [color getRed:&red green:&green blue:&blue alpha:&alpha];
  
  int redInt = (int)(red * 255);
  int greenInt = (int)(green * 255);
  int blueInt = (int)(blue * 255);
  int alphaInt = (int)(alpha * 255);
  
  if (alpha < 1.0) {
    return [NSString stringWithFormat:@"#%02X%02X%02X%02X", redInt, greenInt, blueInt, alphaInt];
  } else {
    return [NSString stringWithFormat:@"#%02X%02X%02X", redInt, greenInt, blueInt];
  }
}

@end
