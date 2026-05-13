export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

type IconComponent<P = IconProps> = (props: P) => unknown;

interface IconDefinition {
  viewBox: string;
  fill?: string;
  stroke?: boolean;
  children: unknown;
}

function createSvgIcon(def: IconDefinition): IconComponent {
  return (props: IconProps) => ({
    type: 'svg',
    props: {
      viewBox: def.viewBox,
      fill: def.fill ?? 'none',
      stroke: def.stroke !== false ? (props.color ?? 'currentColor') : undefined,
      strokeWidth: def.stroke !== false ? 2 : undefined,
      strokeLinecap: def.stroke !== false ? 'round' : undefined,
      strokeLinejoin: def.stroke !== false ? 'round' : undefined,
      width: props.size ?? 24,
      height: props.size ?? 24,
      className: props.className,
      children: def.children,
    },
  });
}

export const IconMenu = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M3 12h18' } },
    { type: 'path', props: { d: 'M3 6h18' } },
    { type: 'path', props: { d: 'M3 18h18' } },
  ],
});

export const IconX = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M18 6L6 18' } },
    { type: 'path', props: { d: 'M6 6l12 12' } },
  ],
});

export const IconSearch = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 11, cy: 11, r: 8 } },
    { type: 'path', props: { d: 'm21 21-4.35-4.35' } },
  ],
});

export const IconGithub = createSvgIcon({
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  stroke: false,
  children: {
    type: 'path',
    props: {
      d: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
    },
  },
});

export const IconChevronDown = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M6 9l6 6 6-6' } },
});

export const IconChevronRight = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M9 18l6-6-6-6' } },
});

export const IconChevronLeft = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M15 18l-6-6 6-6' } },
});

export const IconArrowRight = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M5 12h14M12 5l7 7-7 7' } },
});

export const IconArrowUp = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M12 19V5M5 12l7-7 7 7' } },
});

export const IconArrowDown = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M12 5v14M19 12l-7 7-7-7' } },
});

export const IconPlay = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M5 3l14 9-14 9V3z' } },
});

export const IconPause = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 6, y: 4, width: 4, height: 16 } },
    { type: 'rect', props: { x: 14, y: 4, width: 4, height: 16 } },
  ],
});

export const IconCode = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '16 18 22 12 16 6' } },
    { type: 'polyline', props: { points: '8 6 2 12 8 18' } },
  ],
});

export const IconBook = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' } },
    { type: 'path', props: { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' } },
  ],
});

export const IconZap = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' } },
});

export const IconPackage = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M16.5 9.4l-9-5.19' } },
    { type: 'path', props: { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' } },
    { type: 'polyline', props: { points: '3.27 6.96 12 12.01 20.73 6.96' } },
    { type: 'line', props: { x1: 12, y1: 22.08, x2: 12, y2: 12 } },
  ],
});

export const IconTarget = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'circle', props: { cx: 12, cy: 12, r: 6 } },
    { type: 'circle', props: { cx: 12, cy: 12, r: 2 } },
  ],
});

export const IconType = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '4 7 4 4 20 4 20 7' } },
    { type: 'line', props: { x1: 9, y1: 20, x2: 15, y2: 20 } },
    { type: 'line', props: { x1: 12, y1: 4, x2: 12, y2: 20 } },
  ],
});

export const IconSun = createSvgIcon({
  viewBox: '0 0 24 24',
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
});

export const IconMoon = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' } },
});

export const IconCopy = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 } },
    { type: 'path', props: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' } },
  ],
});

export const IconCheck = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'polyline', props: { points: '20 6 9 17 4 12' } },
});

export const IconAlertCircle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'line', props: { x1: 12, y1: 8, x2: 12, y2: 12 } },
    { type: 'line', props: { x1: 12, y1: 16, x2: 12.01, y2: 16 } },
  ],
});

export const IconExternalLink = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } },
    { type: 'polyline', props: { points: '15 3 21 3 21 9' } },
    { type: 'line', props: { x1: 10, y1: 14, x2: 21, y2: 3 } },
  ],
});

export const IconPlus = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'line', props: { x1: 12, y1: 5, x2: 12, y2: 19 } },
    { type: 'line', props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
  ],
});

export const IconMinus = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'line', props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
});

export const IconTerminal = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '4 17 10 11 4 5' } },
    { type: 'line', props: { x1: 12, y1: 19, x2: 20, y2: 19 } },
  ],
});

export const IconLayers = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polygon', props: { points: '12 2 2 7 12 12 22 7 12 2' } },
    { type: 'polyline', props: { points: '2 17 12 22 22 17' } },
    { type: 'polyline', props: { points: '2 12 12 17 22 12' } },
  ],
});

export const IconGrid = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 3, y: 3, width: 7, height: 7 } },
    { type: 'rect', props: { x: 14, y: 3, width: 7, height: 7 } },
    { type: 'rect', props: { x: 14, y: 14, width: 7, height: 7 } },
    { type: 'rect', props: { x: 3, y: 14, width: 7, height: 7 } },
  ],
});

export const IconSettings = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 3 } },
    { type: 'path', props: { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' } },
  ],
});

export const IconGlobe = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'line', props: { x1: 2, y1: 12, x2: 22, y2: 12 } },
    { type: 'path', props: { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' } },
  ],
});

export const IconImage = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 } },
    { type: 'circle', props: { cx: 8.5, cy: 8.5, r: 1.5 } },
    { type: 'polyline', props: { points: '21 15 16 10 5 21' } },
  ],
});

export const IconFile = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' } },
    { type: 'polyline', props: { points: '13 2 13 9 20 9' } },
  ],
});

export const IconFolder = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' } },
});

export const IconEdit = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' } },
    { type: 'path', props: { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' } },
  ],
});

export const IconTrash = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '3 6 5 6 21 6' } },
    { type: 'path', props: { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' } },
  ],
});

export const IconHeart = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' } },
});

export const IconStar = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'polygon', props: { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' } },
});

export const IconHome = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' } },
    { type: 'polyline', props: { points: '9 22 9 12 15 12 15 22' } },
  ],
});

export const IconUser = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' } },
    { type: 'circle', props: { cx: 12, cy: 7, r: 4 } },
  ],
});

export const IconUsers = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' } },
    { type: 'circle', props: { cx: 9, cy: 7, r: 4 } },
    { type: 'path', props: { d: 'M23 21v-2a4 4 0 0 0-3-3.87' } },
    { type: 'path', props: { d: 'M16 3.13a4 4 0 0 1 0 7.75' } },
  ],
});

export const IconLock = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 3, y: 11, width: 18, height: 11, rx: 2, ry: 2 } },
    { type: 'path', props: { d: 'M7 11V7a5 5 0 0 1 10 0v4' } },
  ],
});

export const IconMail = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' } },
    { type: 'polyline', props: { points: '22,6 12,13 2,6' } },
  ],
});

export const IconCalendar = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 } },
    { type: 'line', props: { x1: 16, y1: 2, x2: 16, y2: 6 } },
    { type: 'line', props: { x1: 8, y1: 2, x2: 8, y2: 6 } },
    { type: 'line', props: { x1: 3, y1: 10, x2: 21, y2: 10 } },
  ],
});

export const IconClock = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'polyline', props: { points: '12 6 12 12 16 14' } },
  ],
});

export const IconMapPin = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' } },
    { type: 'circle', props: { cx: 12, cy: 10, r: 3 } },
  ],
});

export const IconLink = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' } },
    { type: 'path', props: { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' } },
  ],
});

export const IconRefresh = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '23 4 23 10 17 10' } },
    { type: 'path', props: { d: 'M20.49 15a9 9 0 1 1-2.12-9.36L23 10' } },
  ],
});

export const IconShield = createSvgIcon({
  viewBox: '0 0 24 24',
  children: { type: 'path', props: { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' } },
});

export const IconCloud = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' } },
  ],
});

export const IconDownload = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
    { type: 'polyline', props: { points: '7 10 12 15 17 10' } },
    { type: 'line', props: { x1: 12, y1: 15, x2: 12, y2: 3 } },
  ],
});

export const IconUpload = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
    { type: 'polyline', props: { points: '17 8 12 3 7 8' } },
    { type: 'line', props: { x1: 12, y1: 3, x2: 12, y2: 15 } },
  ],
});

export const IconAlertTriangle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' } },
    { type: 'line', props: { x1: 12, y1: 9, x2: 12, y2: 13 } },
    { type: 'line', props: { x1: 12, y1: 17, x2: 12.01, y2: 17 } },
  ],
});

export const IconInfo = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'line', props: { x1: 12, y1: 16, x2: 12, y2: 12 } },
    { type: 'line', props: { x1: 12, y1: 8, x2: 12.01, y2: 8 } },
  ],
});

export const IconFilter = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polygon', props: { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' } },
  ],
});

export const IconShare = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 18, cy: 5, r: 3 } },
    { type: 'circle', props: { cx: 6, cy: 12, r: 3 } },
    { type: 'circle', props: { cx: 18, cy: 19, r: 3 } },
    { type: 'line', props: { x1: 8.59, y1: 13.51, x2: 15.42, y2: 17.49 } },
    { type: 'line', props: { x1: 15.41, y1: 6.51, x2: 8.59, y2: 10.49 } },
  ],
});

export const IconBookmark = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' } },
  ],
});

export const IconTag = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' } },
    { type: 'line', props: { x1: 7, y1: 7, x2: 7.01, y2: 7 } },
  ],
});

export const IconBell = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' } },
    { type: 'path', props: { d: 'M13.73 21a2 2 0 0 1-3.46 0' } },
  ],
});

export const IconMessageCircle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' } },
  ],
});

export const IconPhone = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' } },
  ],
});

export const IconVideo = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polygon', props: { points: '23 7 16 12 23 17 23 7' } },
    { type: 'rect', props: { x: 1, y: 5, width: 15, height: 14, rx: 2, ry: 2 } },
  ],
});

export const IconMic = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' } },
    { type: 'path', props: { d: 'M19 10v2a7 7 0 0 1-14 0v-2' } },
    { type: 'line', props: { x1: 12, y1: 19, x2: 12, y2: 23 } },
    { type: 'line', props: { x1: 8, y1: 23, x2: 16, y2: 23 } },
  ],
});

export const IconVolume = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polygon', props: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
    { type: 'path', props: { d: 'M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07' } },
  ],
});

export const IconVolumeX = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polygon', props: { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' } },
    { type: 'line', props: { x1: 23, y1: 9, x2: 17, y2: 15 } },
    { type: 'line', props: { x1: 17, y1: 9, x2: 23, y2: 15 } },
  ],
});

export const IconPower = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M18.36 6.64a9 9 0 1 1-12.73 0' } },
    { type: 'line', props: { x1: 12, y1: 2, x2: 12, y2: 12 } },
  ],
});

export const IconLogOut = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' } },
    { type: 'polyline', props: { points: '16 17 21 12 16 7' } },
    { type: 'line', props: { x1: 21, y1: 12, x2: 9, y2: 12 } },
  ],
});

export const IconLogIn = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' } },
    { type: 'polyline', props: { points: '10 17 15 12 10 7' } },
    { type: 'line', props: { x1: 15, y1: 12, x2: 3, y2: 12 } },
  ],
});

export const IconLoader = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'line', props: { x1: 12, y1: 2, x2: 12, y2: 6 } },
    { type: 'line', props: { x1: 12, y1: 18, x2: 12, y2: 22 } },
    { type: 'line', props: { x1: 4.93, y1: 4.93, x2: 7.76, y2: 7.76 } },
    { type: 'line', props: { x1: 16.24, y1: 16.24, x2: 19.07, y2: 19.07 } },
    { type: 'line', props: { x1: 2, y1: 12, x2: 6, y2: 12 } },
    { type: 'line', props: { x1: 18, y1: 12, x2: 22, y2: 12 } },
    { type: 'line', props: { x1: 4.93, y1: 19.07, x2: 7.76, y2: 16.24 } },
    { type: 'line', props: { x1: 16.24, y1: 7.76, x2: 19.07, y2: 4.93 } },
  ],
});

export const IconDatabase = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'ellipse', props: { cx: 12, cy: 5, rx: 9, ry: 3 } },
    { type: 'path', props: { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' } },
    { type: 'path', props: { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' } },
  ],
});

export const IconServer = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 2, y: 2, width: 20, height: 8, rx: 2, ry: 2 } },
    { type: 'rect', props: { x: 2, y: 14, width: 20, height: 8, rx: 2, ry: 2 } },
    { type: 'line', props: { x1: 6, y1: 6, x2: 6.01, y2: 6 } },
    { type: 'line', props: { x1: 6, y1: 18, x2: 6.01, y2: 18 } },
  ],
});

export const IconWifi = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M5 12.55a11 11 0 0 1 14.08 0' } },
    { type: 'path', props: { d: 'M1.42 9a16 16 0 0 1 21.16 0' } },
    { type: 'path', props: { d: 'M8.53 16.11a6 6 0 0 1 6.95 0' } },
    { type: 'line', props: { x1: 12, y1: 20, x2: 12.01, y2: 20 } },
  ],
});

export const IconBattery = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'rect', props: { x: 1, y: 6, width: 18, height: 12, rx: 2, ry: 2 } },
    { type: 'line', props: { x1: 23, y1: 13, x2: 23, y2: 11 } },
  ],
});

export const IconFlag = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' } },
    { type: 'line', props: { x1: 4, y1: 22, x2: 4, y2: 15 } },
  ],
});

export const IconEye = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' } },
    { type: 'circle', props: { cx: 12, cy: 12, r: 3 } },
  ],
});

export const IconEyeOff = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' } },
    { type: 'line', props: { x1: 1, y1: 1, x2: 23, y2: 23 } },
  ],
});

export const IconThumbsUp = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' } },
  ],
});

export const IconThumbsDown = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17' } },
  ],
});

export const IconClipboard = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' } },
    { type: 'rect', props: { x: 8, y: 2, width: 8, height: 4, rx: 1, ry: 1 } },
  ],
});

export const IconMaximize = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' } },
  ],
});

export const IconMinimize = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3' } },
  ],
});

export const IconMoreHorizontal = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 1 } },
    { type: 'circle', props: { cx: 19, cy: 12, r: 1 } },
    { type: 'circle', props: { cx: 5, cy: 12, r: 1 } },
  ],
});

export const IconMoreVertical = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 1 } },
    { type: 'circle', props: { cx: 12, cy: 5, r: 1 } },
    { type: 'circle', props: { cx: 12, cy: 19, r: 1 } },
  ],
});

export const IconPieChart = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' } },
    { type: 'path', props: { d: 'M22 12A10 10 0 0 0 12 2v10z' } },
  ],
});

export const IconBarChart = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'line', props: { x1: 12, y1: 20, x2: 12, y2: 10 } },
    { type: 'line', props: { x1: 18, y1: 20, x2: 18, y2: 4 } },
    { type: 'line', props: { x1: 6, y1: 20, x2: 6, y2: 16 } },
  ],
});

export const IconActivity = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '22 12 18 12 15 21 9 3 6 12 2 12' } },
  ],
});

export const IconAward = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 8, r: 7 } },
    { type: 'polyline', props: { points: '8.21 13.89 7 23 12 20 17 23 15.79 13.88' } },
  ],
});

export const IconCompass = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'polygon', props: { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' } },
  ],
});

export const IconHash = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'line', props: { x1: 4, y1: 9, x2: 20, y2: 9 } },
    { type: 'line', props: { x1: 4, y1: 15, x2: 20, y2: 15 } },
    { type: 'line', props: { x1: 10, y1: 3, x2: 8, y2: 21 } },
    { type: 'line', props: { x1: 16, y1: 3, x2: 14, y2: 21 } },
  ],
});

export const IconAtSign = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 4 } },
    { type: 'path', props: { d: 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94' } },
  ],
});

export const IconSend = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'line', props: { x1: 22, y1: 2, x2: 11, y2: 13 } },
    { type: 'polygon', props: { points: '22 2 15 22 11 13 2 9 22 2' } },
  ],
});

export const IconInbox = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '22 12 16 12 14 15 10 15 8 12 2 12' } },
    { type: 'path', props: { d: 'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' } },
  ],
});

export const IconArchive = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '21 8 21 21 3 21 3 8' } },
    { type: 'rect', props: { x: 1, y: 3, width: 22, height: 5 } },
    { type: 'line', props: { x1: 10, y1: 12, x2: 14, y2: 12 } },
  ],
});

export const IconTrash2 = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'polyline', props: { points: '3 6 5 6 21 6' } },
    { type: 'path', props: { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' } },
    { type: 'line', props: { x1: 10, y1: 11, x2: 10, y2: 17 } },
    { type: 'line', props: { x1: 14, y1: 11, x2: 14, y2: 17 } },
  ],
});

export const IconScissors = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 6, cy: 6, r: 3 } },
    { type: 'circle', props: { cx: 6, cy: 18, r: 3 } },
    { type: 'line', props: { x1: 20, y1: 4, x2: 8.12, y2: 15.88 } },
    { type: 'line', props: { x1: 14.47, y1: 14.48, x2: 20, y2: 20 } },
    { type: 'line', props: { x1: 8.12, y1: 8.12, x2: 12, y2: 12 } },
  ],
});

export const IconCheckCircle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'path', props: { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' } },
    { type: 'polyline', props: { points: '22 4 12 14.01 9 11.01' } },
  ],
});

export const IconXCircle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'line', props: { x1: 15, y1: 9, x2: 9, y2: 15 } },
    { type: 'line', props: { x1: 9, y1: 9, x2: 15, y2: 15 } },
  ],
});

export const IconHelpCircle = createSvgIcon({
  viewBox: '0 0 24 24',
  children: [
    { type: 'circle', props: { cx: 12, cy: 12, r: 10 } },
    { type: 'path', props: { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' } },
    { type: 'line', props: { x1: 12, y1: 17, x2: 12.01, y2: 17 } },
  ],
});

export default {
  Menu: IconMenu,
  X: IconX,
  Search: IconSearch,
  Github: IconGithub,
  ChevronDown: IconChevronDown,
  ChevronRight: IconChevronRight,
  ChevronLeft: IconChevronLeft,
  ArrowRight: IconArrowRight,
  ArrowUp: IconArrowUp,
  ArrowDown: IconArrowDown,
  Play: IconPlay,
  Pause: IconPause,
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
  Heart: IconHeart,
  Star: IconStar,
  Home: IconHome,
  User: IconUser,
  Users: IconUsers,
  Lock: IconLock,
  Mail: IconMail,
  Calendar: IconCalendar,
  Clock: IconClock,
  MapPin: IconMapPin,
  Link: IconLink,
  Refresh: IconRefresh,
  Shield: IconShield,
  Cloud: IconCloud,
  Download: IconDownload,
  Upload: IconUpload,
  AlertTriangle: IconAlertTriangle,
  Info: IconInfo,
  Filter: IconFilter,
  Share: IconShare,
  Bookmark: IconBookmark,
  Tag: IconTag,
  Bell: IconBell,
  MessageCircle: IconMessageCircle,
  Phone: IconPhone,
  Video: IconVideo,
  Mic: IconMic,
  Volume: IconVolume,
  VolumeX: IconVolumeX,
  Power: IconPower,
  LogOut: IconLogOut,
  LogIn: IconLogIn,
  Loader: IconLoader,
  Database: IconDatabase,
  Server: IconServer,
  Wifi: IconWifi,
  Battery: IconBattery,
  Flag: IconFlag,
  Eye: IconEye,
  EyeOff: IconEyeOff,
  ThumbsUp: IconThumbsUp,
  ThumbsDown: IconThumbsDown,
  Clipboard: IconClipboard,
  Maximize: IconMaximize,
  Minimize: IconMinimize,
  MoreHorizontal: IconMoreHorizontal,
  MoreVertical: IconMoreVertical,
  PieChart: IconPieChart,
  BarChart: IconBarChart,
  Activity: IconActivity,
  Award: IconAward,
  Compass: IconCompass,
  Hash: IconHash,
  AtSign: IconAtSign,
  Send: IconSend,
  Inbox: IconInbox,
  Archive: IconArchive,
  Trash2: IconTrash2,
  Scissors: IconScissors,
  CheckCircle: IconCheckCircle,
  XCircle: IconXCircle,
  HelpCircle: IconHelpCircle,
};