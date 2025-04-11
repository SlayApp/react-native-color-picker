#import <React/RCTBridgeModule.h>

@interface ColorPickerModule : NSObject <RCTBridgeModule>

- (void)show:(NSDictionary *)options
    onColorSelected:(RCTResponseSenderBlock)colorSelectedCallback
    onDismissed:(RCTResponseSenderBlock)dismissedCallback;

@end
