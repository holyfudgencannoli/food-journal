import { Fonts } from '../config/theme';
import { Shades } from './LightTheme';


type FontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};


interface NativeTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    error: string;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
}



export const DarkTheme: NativeTheme = {
  dark: true,
  colors: {
    primary: Shades['color-primary-400'],
    background: Shades['color-primary-700'],
    card: Shades['color-neutral-700'],
    text: Shades['color-neutral-100'],
    border: Shades['color-neutral-300'],
    error: 'hsl(16, 75%, 25%)',
  },
  fonts: {
    regular: { fontFamily: Fonts?.sans ?? 'system', fontWeight: '400' },
    medium: { fontFamily: Fonts?.sans ?? 'system', fontWeight: '500' },
    bold: { fontFamily: Fonts?.sans ?? 'system', fontWeight: '700' },
    heavy: { fontFamily: Fonts?.sans ?? 'system', fontWeight: '800' },
  },
};
