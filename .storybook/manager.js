import { addons } from '@storybook/addons';
import hiuiTheme from './hiuiTheme';

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  theme: hiuiTheme,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
});