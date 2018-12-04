import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => width / guidelineBaseWidth * size * 1.1;

export { scale, verticalScale, moderateScale };
