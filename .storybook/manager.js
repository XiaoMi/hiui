import { addons } from '@storybook/addons';
import hiuiTheme from './themes/hiui-theme';

addons.setConfig({
  theme: hiuiTheme,
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
})
