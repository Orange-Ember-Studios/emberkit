import type { JSXElement } from '@emberkit/core';

export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

type IconComponent = (props: IconProps) => JSXElement;

const defaultProps: IconProps = {
  size: 24,
  color: 'currentColor',
};

function createIcon(paths: string): IconComponent {
  return ({ size = 24, className, color = 'currentColor' }: IconProps) => {
    return {
      type: 'svg',
      props: {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        children: { type: 'path', props: { d: paths } },
      },
    } as unknown as JSXElement;
  };
}

export const IconMenu: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M3 12h18' } },
      { type: 'path', props: { d: 'M3 6h18' } },
      { type: 'path', props: { d: 'M3 18h18' } },
    ],
  },
}) as unknown as JSXElement;

export const IconX: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M18 6L6 18' } },
      { type: 'path', props: { d: 'M6 6l12 12' } },
    ],
  },
}) as unknown as JSXElement;

export const IconSearch: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 11, cy: 11, r: 8 } },
      { type: 'path', props: { d: 'm21 21-4.35-4.35' } },
    ],
  },
}) as unknown as JSXElement;

export const IconGithub: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    children: {
      type: 'path',
      props: {
        d: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
      },
    },
  },
}) as unknown as JSXElement;

export const IconChevronDown: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M6 9l6 6 6-6' } },
  },
}) as unknown as JSXElement;

export const IconChevronRight: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M9 18l6-6-6-6' } },
  },
}) as unknown as JSXElement;

export const IconArrowRight: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M5 12h14M12 5l7 7-7 7' } },
  },
}) as unknown as JSXElement;

export const IconPlay: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M5 3l14 9-14 9V3z' } },
  },
}) as unknown as JSXElement;

export const IconCode: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'polyline', props: { points: '16 18 22 12 16 6' } },
      { type: 'polyline', props: { points: '8 6 2 12 8 18' } },
    ],
  },
}) as unknown as JSXElement;

export const IconBook: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' } },
      { type: 'path', props: { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' } },
    ],
  },
}) as unknown as JSXElement;

export const IconZap: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' } },
  },
}) as unknown as JSXElement;

export const IconPackage: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M16.5 9.4l-9-5.19' } },
      { type: 'path', props: { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' } },
      { type: 'polyline', props: { points: '3.27 6.96 12 12.01 20.73 6.96' } },
      { type: 'line', props: { x1: 12, y1: 22.08, x2: 12, y2: 12 } },
    ],
  },
}) as unknown as JSXElement;

export const IconTarget: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
      { type: 'circle', props: { cx: 12, cy: 12, r: 6 } },
      { type: 'circle', props: { cx: 12, cy: 12, r: 2 } },
    ],
  },
}) as unknown as JSXElement;

export const IconType: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'polyline', props: { points: '4 7 4 4 20 4 20 7' } },
      { type: 'line', props: { x1: 9, y1: 20, x2: 15, y2: 20 } },
      { type: 'line', props: { x1: 12, y1: 4, x2: 12, y2: 20 } },
    ],
  },
}) as unknown as JSXElement;

export const IconSun: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 12, cy: 12, r: 5 } },
      { type: 'line', props: { x1: 12, y1: 1, x2: 12, y2: 3 } },
      { type: 'line', props: { x1: 12, y1: 21, x2: 12, y2: 23 } },
      { type: 'line', props: { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' } },
      { type: 'line', props: { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' } },
      { type: 'line', props: { x1: 1, y1: 12, x2: 3, y2: 12 } },
      { type: 'line', props: { x1: 21, y1: 12, x2: 23, y2: 12 } },
      { type: 'line', props: { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' } },
      { type: 'line', props: { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' } },
    ],
  },
}) as unknown as JSXElement;

export const IconMoon: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'path', props: { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' } },
  },
}) as unknown as JSXElement;

export const IconCopy: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'rect', props: { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 } },
      { type: 'path', props: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' } },
    ],
  },
}) as unknown as JSXElement;

export const IconCheck: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'polyline', props: { points: '20 6 9 17 4 12' } },
  },
}) as unknown as JSXElement;

export const IconAlertCircle: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
      { type: 'line', props: { x1: 12, y1: 8, x2: 12, y2: 12 } },
      { type: 'line', props: { x1: 12, y1: 16, x2: 12.01, y2: 16 } },
    ],
  },
}) as unknown as JSXElement;

export const IconExternalLink: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } },
      { type: 'polyline', props: { points: '15 3 21 3 21 9' } },
      { type: 'line', props: { x1: 10, y1: 14, x2: 21, y2: 3 } },
    ],
  },
}) as unknown as JSXElement;

export const IconPlus: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'line', props: { x1: 12, y1: 5, x2: 12, y2: 19 } },
      { type: 'line', props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
    ],
  },
}) as unknown as JSXElement;

export const IconMinus: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: { type: 'line', props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
  },
}) as unknown as JSXElement;

export const IconTerminal: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'polyline', props: { points: '4 17 10 11 4 5' } },
      { type: 'line', props: { x1: 12, y1: 19, x2: 20, y2: 19 } },
    ],
  },
}) as unknown as JSXElement;

export const IconLayers: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'polygon', props: { points: '12 2 2 7 12 12 22 7 12 2' } },
      { type: 'polyline', props: { points: '2 17 12 22 22 17' } },
      { type: 'polyline', props: { points: '2 12 12 17 22 12' } },
    ],
  },
}) as unknown as JSXElement;

export const IconGrid: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'rect', props: { x: 3, y: 3, width: 7, height: 7 } },
      { type: 'rect', props: { x: 14, y: 3, width: 7, height: 7 } },
      { type: 'rect', props: { x: 14, y: 14, width: 7, height: 7 } },
      { type: 'rect', props: { x: 3, y: 14, width: 7, height: 7 } },
    ],
  },
}) as unknown as JSXElement;

export const IconSettings: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 12, cy: 12, r: 3 } },
      { type: 'path', props: { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' } },
    ],
  },
}) as unknown as JSXElement;

export const IconGlobe: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
      { type: 'line', props: { x1: 2, y1: 12, x2: 22, y2: 12 } },
      { type: 'path', props: { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' } },
    ],
  },
}) as unknown as JSXElement;

export const IconImage: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'rect', props: { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 } },
      { type: 'circle', props: { cx: 8.5, cy: 8.5, r: 1.5 } },
      { type: 'polyline', props: { points: '21 15 16 10 5 21' } },
    ],
  },
}) as unknown as JSXElement;

export const IconFile: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' } },
      { type: 'polyline', props: { points: '13 2 13 9 20 9' } },
    ],
  },
}) as unknown as JSXElement;

export const IconFolder: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' } },
    ],
  },
}) as unknown as JSXElement;

export const IconEdit: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'path', props: { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' } },
      { type: 'path', props: { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' } },
    ],
  },
}) as unknown as JSXElement;

export const IconTrash: IconComponent = (props) => ({
  type: 'svg',
  props: {
    ...defaultProps,
    ...props,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    children: [
      { type: 'polyline', props: { points: '3 6 5 6 21 6' } },
      { type: 'path', props: { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' } },
    ],
  },
}) as unknown as JSXElement;

export default {
  Menu: IconMenu,
  X: IconX,
  Search: IconSearch,
  Github: IconGithub,
  ChevronDown: IconChevronDown,
  ChevronRight: IconChevronRight,
  ArrowRight: IconArrowRight,
  Play: IconPlay,
  Code: IconCode,
  Book: IconBook,
  Zap: IconZap,
  Package: IconPackage,
  Target: IconTarget,
  Type: IconType,
  Sun: IconSun,
  Moon: IconMoon,
  Copy: IconCopy,
  Check: IconCheck,
  AlertCircle: IconAlertCircle,
  ExternalLink: IconExternalLink,
  Plus: IconPlus,
  Minus: IconMinus,
  Terminal: IconTerminal,
  Layers: IconLayers,
  Grid: IconGrid,
  Settings: IconSettings,
  Globe: IconGlobe,
  Image: IconImage,
  File: IconFile,
  Folder: IconFolder,
  Edit: IconEdit,
  Trash: IconTrash,
};