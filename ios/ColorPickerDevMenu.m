#import "ColorPickerDevMenu.h"
#import "ColorPicker.h"
#import <React/RCTBridge.h>
#import <React/RCTDevMenu.h>

@implementation ColorPickerDevMenu

+ (void)registerWithDevMenu:(RCTDevMenu *)devMenu
{
  if (devMenu == nil) {
    return;
  }
  
  [devMenu addItem:[RCTDevMenuItem buttonItemWithTitle:@"Show Color Picker" handler:^{
    // Get the ColorPickerModule instance
    ColorPickerModule *colorPickerModule = [[ColorPickerModule alloc] init];
    
    // Show the color picker with default options
    [colorPickerModule show:@{
      @"color": @"#FF0000",
      @"supportsAlpha": @YES,
      @"title": @"Dev Menu Color Picker"
    } onColorSelected:^(NSArray *args) {
      NSString *selectedColor = args[0];
      NSLog(@"Dev Menu Color Picker: Selected color %@", selectedColor);
    } onDismissed:^(NSArray *args) {
      NSLog(@"Dev Menu Color Picker: Dismissed");
    }];
  }]];
}

@end
