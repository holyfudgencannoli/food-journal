import { Fonts } from './theme';


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
    sans: string;
    serif: string;
    rounded: string;
    mono: string;
  };
}

export const Shades = {
  'color-primary-100': 'hsl(120, 100%, 90%)',
  'color-primary-200': 'hsl(120, 100%, 80%)',
  'color-primary-300': 'hsl(120, 100%, 70%)',
  'color-primary-400': 'hsl(120, 100%, 60%)',
  'color-primary-500': 'hsl(120, 100%, 50%)',
  'color-primary-600': 'hsl(120, 100%, 40%)',
  'color-primary-700': 'hsl(120, 100%, 30%)',
  'color-primary-800': 'hsl(120, 100%, 20%)',
  'color-primary-900': 'hsl(120, 100%, 10%)',

  'color-neutral-100': 'hsl(120, 25%, 90%)',
  'color-neutral-200': 'hsl(120, 25%, 80%)',
  'color-neutral-300': 'hsl(120, 25%, 70%)',
  'color-neutral-400': 'hsl(120, 25%, 60%)',
  'color-neutral-500': 'hsl(120, 25%, 50%)',
  'color-neutral-600': 'hsl(120, 25%, 40%)',
  'color-neutral-700': 'hsl(120, 25%, 30%)',
  'color-neutral-800': 'hsl(120, 25%, 20%)',
  'color-neutral-900': 'hsl(120, 25%, 10%)',
}




export const LightTheme: NativeTheme = {
  dark: false,
  colors: {
    primary: Shades['color-primary-300'],
    background: Shades['color-primary-100'],
    card: Shades['color-neutral-100'],
    text: Shades['color-neutral-900'],
    border: Shades['color-neutral-300'],
    error: 'hsl(16, 75%, 75%)',
  },
  fonts: Fonts,
};
