import { atom, computed } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { ClientTheme, ClientThemeMode } from '#client/types'
import { generatePalette, hexToRgb } from '#client/utils/color'
import dayjs from '#client/utils/dayjs'
import * as fp from '#shared/utils/fp'
import * as state from './state'

const CUSTOM_THEME_RE = /^#([A-Fa-f0-9]{6})_#([A-Fa-f0-9]{6})$/

const THEMES: Record<ClientTheme, { base: string; acc: string }> = {
  light: {
    base: '#ffffff',
    acc: '#000000',
  },
  dark: {
    base: '#000000',
    acc: '#ffffff',
  },
  custom: {
    base: 'custom',
    acc: 'custom',
  },
  sunrise: {
    base: '#ffd266',
    acc: '#ffffff',
  },
  sunset: {
    base: '#FF8758',
    acc: '#ffffff',
  },
  fill_blue: {
    base: '#82CBF8',
    acc: '#ffffff',
  },
  light_red: {
    base: '#FFF9F9',
    acc: '#E86575',
  },
}

export const isCustomThemeEnabled = persistentAtom<boolean>(
  'custom_theme_is_enabled',
  false,
  {
    encode: (value) => value.toString(),
    decode: (value) => value === 'true',
  }
)

export const theme = atom<ClientTheme>(
  (() => {
    if (isCustomThemeEnabled.get()) {
      return 'custom'
    }
    return 'light'
  })()
)

export const customTheme = persistentAtom<{ base: string; acc: string }>(
  'custom_theme',
  THEMES.light,
  {
    encode: (x) => x.base + '_' + x.acc,
    decode: (x) => {
      if (!CUSTOM_THEME_RE.test(x)) {
        return THEMES.light
      }
      return {
        base: x.split('_')[0],
        acc: x.split('_')[1],
      }
    },
  }
)
export const baseColor = atom<string>(
  (() => {
    const _theme = theme.get()
    const _customTheme = customTheme.get()
    if (_theme === 'custom') {
      return _customTheme.base
    }
    return (THEMES[_theme] || THEMES.light).base
  })()
)
export const accentColor = atom<string>(
  (() => {
    const _theme = theme.get()
    const _customTheme = customTheme.get()
    if (_theme === 'custom') {
      return _customTheme.acc
    }
    return (THEMES[_theme] || THEMES.light).acc
  })()
)

export const accentPalette = computed(accentColor, (_accentColor) => {
  return generatePalette(_accentColor).reverse()
})

theme.subscribe((value) => {
  const values = value === 'custom' ? customTheme.get() : THEMES[value]
  if (values.base !== baseColor.get()) {
    baseColor.set(values.base)
  }
  if (values.acc !== accentColor.get()) {
    accentColor.set(values.acc)
  }
  isCustomThemeEnabled.set(value === 'custom')
})

// theme.subscribe((value) => {
//   let themeMode: ClientThemeMode = 'light'
//   const cl = document.documentElement.classList
//   if (value === 'light') {
//     cl.remove('dark')
//     themeMode = 'light'
//   } else if (value === 'dark') {
//     cl.add('dark')
//     themeMode = 'dark'
//   } else if (value === 'system') {
//     if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       cl.add('dark')
//       themeMode = 'dark'
//     } else {
//       cl.remove('dark')
//       themeMode = 'light'
//     }
//   }
//   setBrowserAppearanceColor(themeMode)
// })

function handleColorsChange() {
  const base = baseColor.get()
  const acc = accentColor.get()

  let _theme: ClientTheme | null = null
  for (const [key, value] of Object.entries(THEMES)) {
    if (value.base === base && value.acc === acc) {
      _theme = key as ClientTheme
      break
    }
  }
  if (_theme) {
    theme.set(_theme)
  } else {
    customTheme.set({ base, acc })
    theme.set('custom')
  }
}
const handleColorsChangeDebounced = fp.debounce(handleColorsChange, 400)

baseColor.subscribe((value) => {
  document.documentElement.style.setProperty('--base-color', value)
  handleColorsChangeDebounced()
})
accentColor.subscribe((value) => {
  const rgb = hexToRgb(value) || hexToRgb(THEMES.light.acc)!
  document.documentElement.style.setProperty(
    `--acc-color-default`,
    rgb.join(' ')
  )
  handleColorsChangeDebounced()
})
accentPalette.subscribe((palette) => {
  palette.forEach((x) => {
    document.documentElement.style.setProperty(
      `--acc-color-${x.index}`,
      x.colorRgb.join(' ')
    )
  })
})

function setBrowserAppearanceColor(themeMode: ClientThemeMode) {
  const themeColor = themeMode === 'light' ? '#fff' : '#1a1a1a'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColor)
}

state.isMirrorOn.subscribe((value) => {
  if (value) {
    setTimeout(() => theme.set('dark'), 1e3)
  } else {
    // NOTE: the following logic is duplicated in src/client/utils/sun.ts
    const _theme = theme.get()
    const _isCustomThemeEnabled = isCustomThemeEnabled.get()
    if (_isCustomThemeEnabled && _theme !== 'custom') {
      theme.set('custom')
      return
    }
    const weather = state.weather.get()
    if (!weather) {
      theme.set('light')
      return
    }
    const now = dayjs()
    const sunrise = dayjs.utc(weather.sunrise * 1000).local()
    const sunset = dayjs.utc(weather.sunset * 1000).local()
    const isDark = now.isAfter(sunset) || now.isBefore(sunrise)
    if (isDark && ['light', 'sunset', 'sunrise'].includes(_theme)) {
      theme.set('dark')
      return
    }
    theme.set('light')
  }
})
