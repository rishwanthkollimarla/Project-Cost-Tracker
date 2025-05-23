import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#EBF5FF',
      100: '#D1E9FF',
      200: '#A3D4FF',
      300: '#75BEFF',
      400: '#47A9FF',
      500: '#3B82F6', // primary blue
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316', // accent orange
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    success: {
      500: '#10B981', // success green
    },
    warning: {
      500: '#FBBF24', // warning yellow
    },
    error: {
      500: '#EF4444', // error red
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'primary' ? 'primary.500' : `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'primary' ? 'primary.600' : `${props.colorScheme}.600`,
          },
        }),
        outline: (props: any) => ({
          borderColor: props.colorScheme === 'primary' ? 'primary.500' : `${props.colorScheme}.500`,
          color: props.colorScheme === 'primary' ? 'primary.500' : `${props.colorScheme}.500`,
        }),
      },
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          p: 4,
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme;