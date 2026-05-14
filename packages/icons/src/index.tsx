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
    type: "svg",
    props: {
      viewBox: def.viewBox,
      fill: def.fill ?? "none",
      stroke:
        def.stroke !== false ? (props.color ?? "currentColor") : undefined,
      strokeWidth: def.stroke !== false ? 2 : undefined,
      strokeLinecap: def.stroke !== false ? "round" : undefined,
      strokeLinejoin: def.stroke !== false ? "round" : undefined,
      width: props.size ?? 24,
      height: props.size ?? 24,
      className: props.className,
      children: def.children,
    },
  });
}

export const IconMenu = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M3 12h18" } },
    { type: "path", props: { d: "M3 6h18" } },
    { type: "path", props: { d: "M3 18h18" } },
  ],
});

export const IconX = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M18 6L6 18" } },
    { type: "path", props: { d: "M6 6l12 12" } },
  ],
});

export const IconSearch = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 11, cy: 11, r: 8 } },
    { type: "path", props: { d: "m21 21-4.35-4.35" } },
  ],
});

export const IconGithub = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
    },
  },
});

export const IconChevronDown = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M6 9l6 6 6-6" } },
});

export const IconChevronRight = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M9 18l6-6-6-6" } },
});

export const IconChevronLeft = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M15 18l-6-6 6-6" } },
});

export const IconArrowRight = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M5 12h14M12 5l7 7-7 7" } },
});

export const IconArrowUp = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M12 19V5M5 12l7-7 7 7" } },
});

export const IconArrowDown = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M12 5v14M19 12l-7 7-7-7" } },
});

export const IconPlay = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M5 3l14 9-14 9V3z" } },
});

export const IconPause = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "rect", props: { x: 6, y: 4, width: 4, height: 16 } },
    { type: "rect", props: { x: 14, y: 4, width: 4, height: 16 } },
  ],
});

export const IconCode = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "16 18 22 12 16 6" } },
    { type: "polyline", props: { points: "8 6 2 12 8 18" } },
  ],
});

export const IconBook = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" } },
    {
      type: "path",
      props: {
        d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
      },
    },
  ],
});

export const IconZap = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "path", props: { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" } },
});

export const IconPackage = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M16.5 9.4l-9-5.19" } },
    {
      type: "path",
      props: {
        d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
      },
    },
    { type: "polyline", props: { points: "3.27 6.96 12 12.01 20.73 6.96" } },
    { type: "line", props: { x1: 12, y1: 22.08, x2: 12, y2: 12 } },
  ],
});

export const IconTarget = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "circle", props: { cx: 12, cy: 12, r: 6 } },
    { type: "circle", props: { cx: 12, cy: 12, r: 2 } },
  ],
});

export const IconType = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "4 7 4 4 20 4 20 7" } },
    { type: "line", props: { x1: 9, y1: 20, x2: 15, y2: 20 } },
    { type: "line", props: { x1: 12, y1: 4, x2: 12, y2: 20 } },
  ],
});

export const IconSun = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 5 } },
    { type: "line", props: { x1: 12, y1: 1, x2: 12, y2: 3 } },
    { type: "line", props: { x1: 12, y1: 21, x2: 12, y2: 23 } },
    { type: "line", props: { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" } },
    {
      type: "line",
      props: { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" },
    },
    { type: "line", props: { x1: 1, y1: 12, x2: 3, y2: 12 } },
    { type: "line", props: { x1: 21, y1: 12, x2: 23, y2: 12 } },
    {
      type: "line",
      props: { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" },
    },
    {
      type: "line",
      props: { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" },
    },
  ],
});

export const IconMoon = createSvgIcon({
  viewBox: "0 0 24 24",
  children: {
    type: "path",
    props: { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
  },
});

export const IconCopy = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "rect",
      props: { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 },
    },
    {
      type: "path",
      props: { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" },
    },
  ],
});

export const IconCheck = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "polyline", props: { points: "20 6 9 17 4 12" } },
});

export const IconAlertCircle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "line", props: { x1: 12, y1: 8, x2: 12, y2: 12 } },
    { type: "line", props: { x1: 12, y1: 16, x2: 12.01, y2: 16 } },
  ],
});

export const IconExternalLink = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" },
    },
    { type: "polyline", props: { points: "15 3 21 3 21 9" } },
    { type: "line", props: { x1: 10, y1: 14, x2: 21, y2: 3 } },
  ],
});

export const IconPlus = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "line", props: { x1: 12, y1: 5, x2: 12, y2: 19 } },
    { type: "line", props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
  ],
});

export const IconMinus = createSvgIcon({
  viewBox: "0 0 24 24",
  children: { type: "line", props: { x1: 5, y1: 12, x2: 19, y2: 12 } },
});

export const IconTerminal = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "4 17 10 11 4 5" } },
    { type: "line", props: { x1: 12, y1: 19, x2: 20, y2: 19 } },
  ],
});

export const IconLayers = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polygon", props: { points: "12 2 2 7 12 12 22 7 12 2" } },
    { type: "polyline", props: { points: "2 17 12 22 22 17" } },
    { type: "polyline", props: { points: "2 12 12 17 22 12" } },
  ],
});

export const IconGrid = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "rect", props: { x: 3, y: 3, width: 7, height: 7 } },
    { type: "rect", props: { x: 14, y: 3, width: 7, height: 7 } },
    { type: "rect", props: { x: 14, y: 14, width: 7, height: 7 } },
    { type: "rect", props: { x: 3, y: 14, width: 7, height: 7 } },
  ],
});

export const IconSettings = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 3 } },
    {
      type: "path",
      props: {
        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
      },
    },
  ],
});

export const IconGlobe = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "line", props: { x1: 2, y1: 12, x2: 22, y2: 12 } },
    {
      type: "path",
      props: {
        d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
      },
    },
  ],
});

export const IconImage = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "rect",
      props: { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 },
    },
    { type: "circle", props: { cx: 8.5, cy: 8.5, r: 1.5 } },
    { type: "polyline", props: { points: "21 15 16 10 5 21" } },
  ],
});

export const IconFile = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
      },
    },
    { type: "polyline", props: { points: "13 2 13 9 20 9" } },
  ],
});

export const IconFolder = createSvgIcon({
  viewBox: "0 0 24 24",
  children: {
    type: "path",
    props: {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
    },
  },
});

export const IconEdit = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
      },
    },
    {
      type: "path",
      props: { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" },
    },
  ],
});

export const IconTrash = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "3 6 5 6 21 6" } },
    {
      type: "path",
      props: {
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      },
    },
  ],
});

export const IconHeart = createSvgIcon({
  viewBox: "0 0 24 24",
  children: {
    type: "path",
    props: {
      d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    },
  },
});

export const IconStar = createSvgIcon({
  viewBox: "0 0 24 24",
  children: {
    type: "polygon",
    props: {
      points:
        "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
    },
  },
});

export const IconHome = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    },
    { type: "polyline", props: { points: "9 22 9 12 15 12 15 22" } },
  ],
});

export const IconUser = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" } },
    { type: "circle", props: { cx: 12, cy: 7, r: 4 } },
  ],
});

export const IconUsers = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" } },
    { type: "circle", props: { cx: 9, cy: 7, r: 4 } },
    { type: "path", props: { d: "M23 21v-2a4 4 0 0 0-3-3.87" } },
    { type: "path", props: { d: "M16 3.13a4 4 0 0 1 0 7.75" } },
  ],
});

export const IconLock = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "rect",
      props: { x: 3, y: 11, width: 18, height: 11, rx: 2, ry: 2 },
    },
    { type: "path", props: { d: "M7 11V7a5 5 0 0 1 10 0v4" } },
  ],
});

export const IconMail = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
      },
    },
    { type: "polyline", props: { points: "22,6 12,13 2,6" } },
  ],
});

export const IconCalendar = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "rect",
      props: { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 },
    },
    { type: "line", props: { x1: 16, y1: 2, x2: 16, y2: 6 } },
    { type: "line", props: { x1: 8, y1: 2, x2: 8, y2: 6 } },
    { type: "line", props: { x1: 3, y1: 10, x2: 21, y2: 10 } },
  ],
});

export const IconClock = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "polyline", props: { points: "12 6 12 12 16 14" } },
  ],
});

export const IconMapPin = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" },
    },
    { type: "circle", props: { cx: 12, cy: 10, r: 3 } },
  ],
});

export const IconLink = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
      },
    },
    {
      type: "path",
      props: {
        d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
      },
    },
  ],
});

export const IconRefresh = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "23 4 23 10 17 10" } },
    { type: "path", props: { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" } },
  ],
});

export const IconShield = createSvgIcon({
  viewBox: "0 0 24 24",
  children: {
    type: "path",
    props: { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  },
});

export const IconCloud = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" },
    },
  ],
});

export const IconDownload = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" } },
    { type: "polyline", props: { points: "7 10 12 15 17 10" } },
    { type: "line", props: { x1: 12, y1: 15, x2: 12, y2: 3 } },
  ],
});

export const IconUpload = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" } },
    { type: "polyline", props: { points: "17 8 12 3 7 8" } },
    { type: "line", props: { x1: 12, y1: 3, x2: 12, y2: 15 } },
  ],
});

export const IconAlertTriangle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
      },
    },
    { type: "line", props: { x1: 12, y1: 9, x2: 12, y2: 13 } },
    { type: "line", props: { x1: 12, y1: 17, x2: 12.01, y2: 17 } },
  ],
});

export const IconInfo = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "line", props: { x1: 12, y1: 16, x2: 12, y2: 12 } },
    { type: "line", props: { x1: 12, y1: 8, x2: 12.01, y2: 8 } },
  ],
});

export const IconFilter = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "polygon",
      props: { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" },
    },
  ],
});

export const IconShare = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 18, cy: 5, r: 3 } },
    { type: "circle", props: { cx: 6, cy: 12, r: 3 } },
    { type: "circle", props: { cx: 18, cy: 19, r: 3 } },
    { type: "line", props: { x1: 8.59, y1: 13.51, x2: 15.42, y2: 17.49 } },
    { type: "line", props: { x1: 15.41, y1: 6.51, x2: 8.59, y2: 10.49 } },
  ],
});

export const IconBookmark = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
    },
  ],
});

export const IconTag = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
      },
    },
    { type: "line", props: { x1: 7, y1: 7, x2: 7.01, y2: 7 } },
  ],
});

export const IconBell = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" },
    },
    { type: "path", props: { d: "M13.73 21a2 2 0 0 1-3.46 0" } },
  ],
});

export const IconMessageCircle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
      },
    },
  ],
});

export const IconPhone = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      },
    },
  ],
});

export const IconVideo = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polygon", props: { points: "23 7 16 12 23 17 23 7" } },
    {
      type: "rect",
      props: { x: 1, y: 5, width: 15, height: 14, rx: 2, ry: 2 },
    },
  ],
});

export const IconMic = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" },
    },
    { type: "path", props: { d: "M19 10v2a7 7 0 0 1-14 0v-2" } },
    { type: "line", props: { x1: 12, y1: 19, x2: 12, y2: 23 } },
    { type: "line", props: { x1: 8, y1: 23, x2: 16, y2: 23 } },
  ],
});

export const IconVolume = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polygon", props: { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" } },
    {
      type: "path",
      props: {
        d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07",
      },
    },
  ],
});

export const IconVolumeX = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polygon", props: { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" } },
    { type: "line", props: { x1: 23, y1: 9, x2: 17, y2: 15 } },
    { type: "line", props: { x1: 17, y1: 9, x2: 23, y2: 15 } },
  ],
});

export const IconPower = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M18.36 6.64a9 9 0 1 1-12.73 0" } },
    { type: "line", props: { x1: 12, y1: 2, x2: 12, y2: 12 } },
  ],
});

export const IconLogOut = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" } },
    { type: "polyline", props: { points: "16 17 21 12 16 7" } },
    { type: "line", props: { x1: 21, y1: 12, x2: 9, y2: 12 } },
  ],
});

export const IconLogIn = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" } },
    { type: "polyline", props: { points: "10 17 15 12 10 7" } },
    { type: "line", props: { x1: 15, y1: 12, x2: 3, y2: 12 } },
  ],
});

export const IconLoader = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "line", props: { x1: 12, y1: 2, x2: 12, y2: 6 } },
    { type: "line", props: { x1: 12, y1: 18, x2: 12, y2: 22 } },
    { type: "line", props: { x1: 4.93, y1: 4.93, x2: 7.76, y2: 7.76 } },
    { type: "line", props: { x1: 16.24, y1: 16.24, x2: 19.07, y2: 19.07 } },
    { type: "line", props: { x1: 2, y1: 12, x2: 6, y2: 12 } },
    { type: "line", props: { x1: 18, y1: 12, x2: 22, y2: 12 } },
    { type: "line", props: { x1: 4.93, y1: 19.07, x2: 7.76, y2: 16.24 } },
    { type: "line", props: { x1: 16.24, y1: 7.76, x2: 19.07, y2: 4.93 } },
  ],
});

export const IconDatabase = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "ellipse", props: { cx: 12, cy: 5, rx: 9, ry: 3 } },
    { type: "path", props: { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" } },
    { type: "path", props: { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" } },
  ],
});

export const IconServer = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "rect", props: { x: 2, y: 2, width: 20, height: 8, rx: 2, ry: 2 } },
    {
      type: "rect",
      props: { x: 2, y: 14, width: 20, height: 8, rx: 2, ry: 2 },
    },
    { type: "line", props: { x1: 6, y1: 6, x2: 6.01, y2: 6 } },
    { type: "line", props: { x1: 6, y1: 18, x2: 6.01, y2: 18 } },
  ],
});

export const IconWifi = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M5 12.55a11 11 0 0 1 14.08 0" } },
    { type: "path", props: { d: "M1.42 9a16 16 0 0 1 21.16 0" } },
    { type: "path", props: { d: "M8.53 16.11a6 6 0 0 1 6.95 0" } },
    { type: "line", props: { x1: 12, y1: 20, x2: 12.01, y2: 20 } },
  ],
});

export const IconBattery = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "rect",
      props: { x: 1, y: 6, width: 18, height: 12, rx: 2, ry: 2 },
    },
    { type: "line", props: { x1: 23, y1: 13, x2: 23, y2: 11 } },
  ],
});

export const IconFlag = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" },
    },
    { type: "line", props: { x1: 4, y1: 22, x2: 4, y2: 15 } },
  ],
});

export const IconEye = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" },
    },
    { type: "circle", props: { cx: 12, cy: 12, r: 3 } },
  ],
});

export const IconEyeOff = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
      },
    },
    { type: "line", props: { x1: 1, y1: 1, x2: 23, y2: 23 } },
  ],
});

export const IconThumbsUp = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
      },
    },
  ],
});

export const IconThumbsDown = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17",
      },
    },
  ],
});

export const IconClipboard = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      },
    },
    { type: "rect", props: { x: 8, y: 2, width: 8, height: 4, rx: 1, ry: 1 } },
  ],
});

export const IconMaximize = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
      },
    },
  ],
});

export const IconMinimize = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "path",
      props: {
        d: "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3",
      },
    },
  ],
});

export const IconMoreHorizontal = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 1 } },
    { type: "circle", props: { cx: 19, cy: 12, r: 1 } },
    { type: "circle", props: { cx: 5, cy: 12, r: 1 } },
  ],
});

export const IconMoreVertical = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 1 } },
    { type: "circle", props: { cx: 12, cy: 5, r: 1 } },
    { type: "circle", props: { cx: 12, cy: 19, r: 1 } },
  ],
});

export const IconPieChart = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M21.21 15.89A10 10 0 1 1 8 2.83" } },
    { type: "path", props: { d: "M22 12A10 10 0 0 0 12 2v10z" } },
  ],
});

export const IconBarChart = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "line", props: { x1: 12, y1: 20, x2: 12, y2: 10 } },
    { type: "line", props: { x1: 18, y1: 20, x2: 18, y2: 4 } },
    { type: "line", props: { x1: 6, y1: 20, x2: 6, y2: 16 } },
  ],
});

export const IconActivity = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "22 12 18 12 15 21 9 3 6 12 2 12" } },
  ],
});

export const IconAward = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 8, r: 7 } },
    {
      type: "polyline",
      props: { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" },
    },
  ],
});

export const IconCompass = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    {
      type: "polygon",
      props: {
        points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76",
      },
    },
  ],
});

export const IconHash = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "line", props: { x1: 4, y1: 9, x2: 20, y2: 9 } },
    { type: "line", props: { x1: 4, y1: 15, x2: 20, y2: 15 } },
    { type: "line", props: { x1: 10, y1: 3, x2: 8, y2: 21 } },
    { type: "line", props: { x1: 16, y1: 3, x2: 14, y2: 21 } },
  ],
});

export const IconAtSign = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 4 } },
    {
      type: "path",
      props: { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" },
    },
  ],
});

export const IconSend = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "line", props: { x1: 22, y1: 2, x2: 11, y2: 13 } },
    { type: "polygon", props: { points: "22 2 15 22 11 13 2 9 22 2" } },
  ],
});

export const IconInbox = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    {
      type: "polyline",
      props: { points: "22 12 16 12 14 15 10 15 8 12 2 12" },
    },
    {
      type: "path",
      props: {
        d: "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      },
    },
  ],
});

export const IconArchive = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "21 8 21 21 3 21 3 8" } },
    { type: "rect", props: { x: 1, y: 3, width: 22, height: 5 } },
    { type: "line", props: { x1: 10, y1: 12, x2: 14, y2: 12 } },
  ],
});

export const IconTrash2 = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "polyline", props: { points: "3 6 5 6 21 6" } },
    {
      type: "path",
      props: {
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      },
    },
    { type: "line", props: { x1: 10, y1: 11, x2: 10, y2: 17 } },
    { type: "line", props: { x1: 14, y1: 11, x2: 14, y2: 17 } },
  ],
});

export const IconScissors = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 6, cy: 6, r: 3 } },
    { type: "circle", props: { cx: 6, cy: 18, r: 3 } },
    { type: "line", props: { x1: 20, y1: 4, x2: 8.12, y2: 15.88 } },
    { type: "line", props: { x1: 14.47, y1: 14.48, x2: 20, y2: 20 } },
    { type: "line", props: { x1: 8.12, y1: 8.12, x2: 12, y2: 12 } },
  ],
});

export const IconCheckCircle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "path", props: { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" } },
    { type: "polyline", props: { points: "22 4 12 14.01 9 11.01" } },
  ],
});

export const IconXCircle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "line", props: { x1: 15, y1: 9, x2: 9, y2: 15 } },
    { type: "line", props: { x1: 9, y1: 9, x2: 15, y2: 15 } },
  ],
});

export const IconHelpCircle = createSvgIcon({
  viewBox: "0 0 24 24",
  children: [
    { type: "circle", props: { cx: 12, cy: 12, r: 10 } },
    { type: "path", props: { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" } },
    { type: "line", props: { x1: 12, y1: 17, x2: 12.01, y2: 17 } },
  ],
});

export const IconXTwitter = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
    },
  },
});

export const IconLinkedIn = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
  },
});

export const IconFacebook = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
    },
  },
});

export const IconInstagram = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
    },
  },
});

export const IconYoutube = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
  },
});

export const IconDiscord = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
    },
  },
});

export const IconReddit = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
    },
  },
});

export const IconTwitch = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z",
    },
  },
});

export const IconSlack = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M5.042 15.165a2.53 2.53 0 0 1-2.52 2.523A2.53 2.53 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52a2.527 2.527 0 0 1 2.521 2.52v6.313A2.53 2.53 0 0 1 8.834 24a2.53 2.53 0 0 1-2.521-2.522zM8.834 5.042a2.53 2.53 0 0 1-2.521-2.52A2.53 2.53 0 0 1 8.834 0a2.53 2.53 0 0 1 2.521 2.522v2.52zm0 1.271a2.53 2.53 0 0 1 2.521 2.521a2.53 2.53 0 0 1-2.521 2.521H2.522A2.53 2.53 0 0 1 0 8.834a2.53 2.53 0 0 1 2.522-2.521zm10.122 2.521a2.53 2.53 0 0 1 2.522-2.521A2.53 2.53 0 0 1 24 8.834a2.53 2.53 0 0 1-2.522 2.521h-2.522zm-1.268 0a2.53 2.53 0 0 1-2.523 2.521a2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.53 2.53 0 0 1 2.523 2.522zm-2.523 10.122a2.53 2.53 0 0 1 2.523 2.522A2.53 2.53 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522zm0-1.268a2.527 2.527 0 0 1-2.52-2.523a2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.53 2.53 0 0 1-2.522 2.523z",
    },
  },
});

export const IconTikTok = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    },
  },
});

export const IconWhatsApp = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
    },
  },
});

export const IconDribbble = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z",
    },
  },
});

export const IconBehance = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z",
    },
  },
});

export const IconPinterest = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
    },
  },
});

export const IconAstro = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z",
    },
  },
});

export const IconVue = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z",
    },
  },
});

export const IconAngular = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z",
    },
  },
});

export const IconReact = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
    },
  },
});

export const IconSvelte = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M23.485 1.455a1.75 1.75 0 0 0-2.475 0l-3.07 3.07c-.684-.44-1.454-.744-2.28-.876l-.478-1.587a1.75 1.75 0 0 0-3.324.228L11.22 5.89a10.29 10.29 0 0 0-3.15 0L6.91 4.286a1.75 1.75 0 0 0-3.324-.228l-.478 1.587c-.826.132-1.596.436-2.28.876L-.233 1.455a1.75 1.75 0 0 0-2.475 0L-.233 1.455c-.68.68-1.033 1.585-1.033 2.54v5.565c0 2.07 1.198 3.97 3.076 4.864l-.002.001-.732.627a1.75 1.75 0 0 0-.004 2.665l3.07 3.07a1.75 1.75 0 0 0 2.475 0l3.07-3.07c.684.44 1.454.744 2.28.876l.478 1.587a1.75 1.75 0 0 0 3.324-.228l.805-2.605a10.29 10.29 0 0 0 3.15 0l.805 2.605a1.75 1.75 0 0 0 3.324.228l.478-1.587c.826-.132 1.596-.436 2.28-.876l3.07 3.07a1.75 1.75 0 0 0 2.475 0l3.07-3.07a1.75 1.75 0 0 0 .004-2.665l-.732-.627c1.878-.894 3.076-2.794 3.076-4.864V4c0-.955-.353-1.86-1.033-2.54l-.13-.13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z",
    },
  },
});

export const IconNodeJs = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z",
    },
  },
});

export const IconNpm = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z",
    },
  },
});

export const IconYarn = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z",
    },
  },
});

export const IconPnpm = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM2 2h3.5v3.5H2zm8.25 0h3.498v3.5H10.25zm8.25 0H22v3.5h-3.5zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zm2 2H22v3.5h-3.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z",
    },
  },
});

export const IconVite = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z",
    },
  },
});

export const IconNextJs = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
    },
  },
});

export const IconRemix = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z",
    },
  },
});

export const IconNuxt = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M13.4642 19.8295h8.9218c.2834 0 .5618-.0723.8072-.2098a1.5899 1.5899 0 0 0 .5908-.5732 1.5293 1.5293 0 0 0 .216-.783 1.529 1.529 0 0 0-.2167-.7828L17.7916 7.4142a1.5904 1.5904 0 0 0-.5907-.573 1.6524 1.6524 0 0 0-.807-.2099c-.2833 0-.5616.0724-.807.2098a1.5904 1.5904 0 0 0-.5907.5731L13.4642 9.99l-2.9954-5.0366a1.5913 1.5913 0 0 0-.591-.573 1.6533 1.6533 0 0 0-.8071-.2098c-.2834 0-.5617.0723-.8072.2097a1.5913 1.5913 0 0 0-.591.573L.2168 17.4808A1.5292 1.5292 0 0 0 0 18.2635c-.0001.2749.0744.545.216.783a1.59 1.59 0 0 0 .5908.5732c.2454.1375.5238.2098.8072.2098h5.6003c2.219 0 3.8554-.9454 4.9813-2.7899l2.7337-4.5922L16.3935 9.99l4.3944 7.382h-5.8586ZM7.123 17.3694l-3.9083-.0009 5.8586-9.8421 2.9232 4.921-1.9572 3.2892c-.7478 1.1967-1.5972 1.6328-2.9163 1.6328z",
    },
  },
});

export const IconSolid = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M11.558.788A9.082 9.082 0 0 0 9.776.99l-.453.15c-.906.303-1.656.755-2.1 1.348l-.301.452-2.035 3.528c.426-.387.974-.698 1.643-.894h.001l.613-.154h.001a8.82 8.82 0 0 1 1.777-.206c2.916-.053 6.033 1.148 8.423 2.36 2.317 1.175 3.888 2.32 3.987 2.39L24 5.518c-.082-.06-1.66-1.21-3.991-2.386-2.393-1.206-5.521-2.396-8.45-2.343zM8.924 5.366a8.634 8.634 0 0 0-1.745.203l-.606.151c-1.278.376-2.095 1.16-2.43 2.108-.334.948-.188 2.065.487 3.116.33.43.747.813 1.216 1.147L12.328 10h.001a6.943 6.943 0 0 1 6.013 1.013l2.844-.963c-.17-.124-1.663-1.2-3.91-2.34-2.379-1.206-5.479-2.396-8.352-2.344zm5.435 4.497a6.791 6.791 0 0 0-1.984.283L2.94 13.189 0 18.334l9.276-2.992a6.945 6.945 0 0 1 7.408 2.314v.001c.695.903.89 1.906.66 2.808l2.572-4.63c.595-1.041.45-2.225-.302-3.429a6.792 6.792 0 0 0-5.255-2.543zm-3.031 5.341a6.787 6.787 0 0 0-2.006.283L.008 18.492c.175.131 2.02 1.498 4.687 2.768 2.797 1.332 6.37 2.467 9.468 1.712l.454-.152h.002c1.278-.376 2.134-1.162 2.487-2.09.353-.93.207-2.004-.541-2.978a6.791 6.791 0 0 0-5.237-2.548z",
    },
  },
});

export const IconElectron = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.0111 0c-.85 0-1.5392.6891-1.5392 1.5392 0 .8501.6891 1.5393 1.5392 1.5393.595 0 1.11-.338 1.3662-.832 2.2208 1.2675 3.847 5.4728 3.847 10.3623 0 2.0715-.2891 4.056-.825 5.7685a.3215.3215 0 0 0 .2107.403.322.322 0 0 0 .4033-.2111c.5558-1.7763.8542-3.8251.8542-5.9604 0-5.1927-1.7717-9.686-4.3206-11.0027.001-.0223.0035-.0443.0035-.0669 0-.85-.6891-1.5392-1.5393-1.5392zm0 .6432a.896.896 0 1 1 0 1.792.896.896 0 1 1 0-1.792zm-5.486 4.3052c-2.067.0074-3.6473.6646-4.3885 1.9485-.7375 1.2774-.5267 2.971.5113 4.7813a.3217.3217 0 0 0 .558-.32C2.271 9.7274 2.089 8.266 2.6938 7.2185c.821-1.422 3.033-1.9552 5.9321-1.4271a.3216.3216 0 0 0 .1153-.6329c-.784-.1428-1.5271-.2125-2.216-.21zm11.0522.0176a.3216.3216 0 0 0-.0084.6432c1.8337.0239 3.1556.5956 3.7502 1.6256.8192 1.419.1798 3.5947-1.7182 5.837a.322.322 0 0 0 .0377.4535.3215.3215 0 0 0 .4532-.0377c2.0535-2.426 2.7708-4.8661 1.7845-6.5744-.7257-1.257-2.26-1.9207-4.299-1.9472zm-2.6984.2924a.3225.3225 0 0 0-.0647.0072c-1.8568.3979-3.8333 1.1755-5.7314 2.2714-4.5699 2.6384-7.5924 6.4948-7.3601 9.3717-.4726.2628-.7928.7664-.7928 1.3455 0 .85.6892 1.5392 1.5393 1.5392.85 0 1.5392-.6891 1.5392-1.5392 0-.8501-.6891-1.5393-1.5392-1.5393-.038 0-.0754.003-.1128.0057-.1002-2.5597 2.7434-6.1412 7.048-8.6265 1.8413-1.063 3.7551-1.8163 5.5445-2.1997a.3217.3217 0 0 0-.07-.636zm-2.8787 6.2364a1.1192 1.1192 0 0 0-.2243.0255c-.6012.1301-.983.7225-.8533 1.3238.1302.6012.7226.9832 1.3238.8533.6012-.1302.9832-.7226.8533-1.3238-.1139-.526-.5816-.8844-1.0995-.8788zM4.532 13.341a.321.321 0 0 0-.2318.0835.3214.3214 0 0 0-.0214.4542c1.2682 1.3936 2.9157 2.701 4.7946 3.7857 4.4146 2.5489 9.1056 3.2849 11.5608 1.8392a1.53 1.53 0 0 0 .8966.2899c.8501 0 1.5392-.6891 1.5392-1.5392 0-.8501-.689-1.5393-1.5392-1.5393-.85 0-1.5392.6892-1.5392 1.5393 0 .276.0737.5344.201.7584-2.2448 1.214-6.631.5002-10.7976-1.9054-1.8228-1.0524-3.418-2.3181-4.6404-3.6614a.3206.3206 0 0 0-.2226-.1049zm-2.0628 4.0172a.896.896 0 1 1 0 1.792.896.896 0 1 1 0-1.792zm19.0616 0a.896.896 0 1 1 0 1.792.891.891 0 0 1-.5864-.2194c-.0025-.004-.0039-.0083-.0066-.0123a.3195.3195 0 0 0-.0957-.0914.896.896 0 0 1 .6887-1.4689zm-14.0045 1.368a.3215.3215 0 0 0-.3207.4296C8.2793 22.154 10.036 24 12.0111 24c1.4406 0 2.7735-.9822 3.8128-2.711a.3215.3215 0 0 0-.11-.4413.3219.3219 0 0 0-.4415.11c-.934 1.5537-2.0812 2.399-3.2613 2.399-1.6407 0-3.2075-1.6465-4.2-4.4179a.3216.3216 0 0 0-.2848-.2126z",
    },
  },
});

export const IconTailwind = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z",
    },
  },
});

export const IconWebpack = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M22.1987 18.498l-9.7699 5.5022v-4.2855l6.0872-3.3338 3.6826 2.117zm.6683-.6026V6.3884l-3.5752 2.0544v7.396zm-21.0657.6026l9.7699 5.5022v-4.2855L5.484 16.3809l-3.6826 2.117zm-.6683-.6026V6.3884l3.5751 2.0544v7.396zm.4183-12.2515l10.0199-5.644v4.1434L5.152 7.6586l-.0489.028zm20.8975 0l-10.02-5.644v4.1434l6.4192 3.5154.0489.028 3.5518-2.0427zm-10.8775 13.096l-6.0056-3.2873V8.9384l6.0054 3.4525v6.349zm.8575 0l6.0053-3.2873V8.9384l-6.0053 3.4525zM5.9724 8.1845l6.0287-3.3015L18.03 8.1845l-6.0288 3.4665z",
    },
  },
});

export const IconRollup = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M3.42.0002a.37.37 0 00-.369.37V19.885c.577-1.488 1.557-3.6168 3.1378-6.5297C11.8885 2.876 12.6355 1.8191 15.6043 1.8191c1.56 0 3.1338.704 4.1518 1.9549A7.9616 7.9616 0 0013.1014.0002zM16.1393 2.544c-1.19.01-2.257.466-2.6979 1.498-.967 2.2558 1.624 4.7667 2.7569 4.5677 1.4419-.255-.255-3.5628-.255-3.5628 2.2049 4.1558 1.6969 2.8838-2.2899 6.6996C9.6666 15.5623 5.596 23.6188 5.002 23.9568a.477.477 0 01-.08.043H20.558a.373.373 0 00.33-.538l-4.0878-8.0915a.37.37 0 01.144-.488 7.9596 7.9596 0 004.0048-6.9126c0-1.4249-.373-2.7608-1.03-3.9198-.9269-.9519-2.4298-1.5159-3.7787-1.5059z",
    },
  },
});

export const IconEsbuild = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zM6.718 5.282L13.436 12l-6.718 6.718-2.036-2.036L9.364 12 4.682 7.318zm7.2 0L20.636 12l-6.718 6.718-2.036-2.036L16.564 12l-4.682-4.682z",
    },
  },
});

export const IconTypeScript = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
    },
  },
});

export const IconJavaScript = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z",
    },
  },
});

export const IconBun = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 22.596c6.628 0 12-4.338 12-9.688 0-3.318-2.057-6.248-5.219-7.986-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a49.92 49.92 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687v.001ZM10.599 4.715c.334-.759.503-1.58.498-2.409 0-.145.202-.187.23-.029.658 2.783-.902 4.162-2.057 4.624-.124.048-.199-.121-.103-.209a5.763 5.763 0 0 0 1.432-1.977Zm2.058-.102a5.82 5.82 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172 1.962 2.111 1.307 4.067.556 5.051-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431Zm1.776-.561a5.727 5.727 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218 2.595 1.087 2.774 3.18 2.459 4.407a.116.116 0 0 1-.049.071.11.11 0 0 1-.153-.026.122.122 0 0 1-.022-.083 5.891 5.891 0 0 0-.737-2.331Zm-5.087.561c-.617.546-1.282.76-2.063 1-.117 0-.195-.078-.156-.181 1.752-.909 2.376-1.649 2.999-2.778 0 0 .155-.118.188.085 0 .304-.349 1.329-.968 1.874Zm4.945 11.237a2.957 2.957 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.178 2.178 0 0 1-1.327-.62 2.955 2.955 0 0 1-.925-1.553.244.244 0 0 1 .064-.198.234.234 0 0 1 .193-.069h3.965a.226.226 0 0 1 .19.07c.05.053.073.125.063.197Zm-5.458-2.176a1.862 1.862 0 0 1-2.384-.245 1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114 1.931 1.931 0 0 1-.698.869v.001Zm8.495.005a1.86 1.86 0 0 1-2.381-.253 1.964 1.964 0 0 1-.547-1.366c0-.384.11-.76.32-1.079.207-.319.503-.567.849-.713a1.844 1.844 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117 1.932 1.932 0 0 1-.702.868Z",
    },
  },
});

export const IconDeno = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M1.105 18.02A11.9 11.9 0 0 1 0 12.985q0-.698.078-1.376a12 12 0 0 1 .231-1.34A12 12 0 0 1 4.025 4.02a12 12 0 0 1 5.46-2.771 12 12 0 0 1 3.428-.23c1.452.112 2.825.477 4.077 1.05a12 12 0 0 1 2.78 1.774 12.02 12.02 0 0 1 4.053 7.078A12 12 0 0 1 24 12.985q0 .454-.036.914a12 12 0 0 1-.728 3.305 12 12 0 0 1-2.38 3.875c-1.33 1.357-3.02 1.962-4.43 1.936a4.4 4.4 0 0 1-2.724-1.024c-.99-.853-1.391-1.83-1.53-2.919a5 5 0 0 1 .128-1.518c.105-.38.37-1.116.76-1.437-.455-.197-1.04-.624-1.226-.829-.045-.05-.04-.13 0-.183a.155.155 0 0 1 .177-.053c.392.134.869.267 1.372.35.66.111 1.484.25 2.317.292 2.03.1 4.153-.813 4.812-2.627s.403-3.609-1.96-4.685-3.454-2.356-5.363-3.128c-1.247-.505-2.636-.205-4.06.582-3.838 2.121-7.277 8.822-5.69 15.032a.191.191 0 0 1-.315.19 12 12 0 0 1-1.25-1.634 12 12 0 0 1-.769-1.404M11.57 6.087c.649-.051 1.214.501 1.31 1.236.13.979-.228 1.99-1.41 2.013-1.01.02-1.315-.997-1.248-1.614.066-.616.574-1.575 1.35-1.635",
    },
  },
});

export const IconDocker = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
    },
  },
});

export const IconKubernetes = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34zm-3.289-2.057c-.042-.01-.103-.026-.145-.034-.174-.033-.315-.025-.479-.038-.35-.037-.638-.067-.895-.148-.105-.04-.18-.165-.216-.216l-.201-.059a6.45 6.45 0 0 0-.105-2.332 6.465 6.465 0 0 0-.936-2.163c.052-.047.15-.133.177-.159.008-.09.001-.183.094-.282.197-.185.444-.338.743-.522.142-.084.273-.137.415-.242.032-.024.076-.062.11-.089.24-.191.295-.52.123-.736-.172-.216-.506-.236-.745-.045-.034.027-.08.062-.111.088-.134.116-.217.23-.33.35-.246.25-.45.458-.673.609-.097.056-.239.037-.303.033l-.19.135a6.545 6.545 0 0 0-4.146-2.003l-.012-.223c-.065-.062-.143-.115-.163-.25-.022-.268.015-.557.057-.905.023-.163.061-.298.068-.475.001-.04-.001-.099-.001-.142 0-.306-.224-.555-.5-.555-.275 0-.499.249-.499.555l.001.014c0 .041-.002.092 0 .128.006.177.044.312.067.475.042.348.078.637.056.906a.545.545 0 0 1-.162.258l-.012.211a6.424 6.424 0 0 0-4.166 2.003 8.373 8.373 0 0 1-.18-.128c-.09.012-.18.04-.297-.029-.223-.15-.427-.358-.673-.608-.113-.12-.195-.234-.329-.349-.03-.026-.077-.062-.111-.088a.594.594 0 0 0-.348-.132.481.481 0 0 0-.398.176c-.172.216-.117.546.123.737l.007.005.104.083c.142.105.272.159.414.242.299.185.546.338.743.522.076.082.09.226.1.288l.16.143a6.462 6.462 0 0 0-1.02 4.506l-.208.06c-.055.072-.133.184-.215.217-.257.081-.546.11-.895.147-.164.014-.305.006-.48.039-.037.007-.09.02-.133.03l-.004.002-.007.002c-.295.071-.484.342-.423.608.061.267.349.429.645.365l.007-.001.01-.003.129-.029c.17-.046.294-.113.448-.172.33-.118.604-.217.87-.256.112-.009.23.069.288.101l.217-.037a6.5 6.5 0 0 0 2.88 3.596l-.09.218c.033.084.069.199.044.282-.097.252-.263.517-.452.813-.091.136-.185.242-.268.399-.02.037-.045.095-.064.134-.128.275-.034.591.213.71.248.12.556-.007.69-.282v-.002c.02-.039.046-.09.062-.127.07-.162.094-.301.144-.458.132-.332.205-.68.387-.897.05-.06.13-.082.215-.105l.113-.205a6.453 6.453 0 0 0 4.609.012l.106.192c.086.028.18.042.256.155.136.232.229.507.342.84.05.156.074.295.145.457.016.037.043.09.062.129.133.276.442.402.69.282.247-.118.341-.435.213-.71-.02-.039-.045-.096-.065-.134-.083-.156-.177-.261-.268-.398-.19-.296-.346-.541-.443-.793-.04-.13.007-.21.038-.294-.018-.022-.059-.144-.083-.202a6.499 6.499 0 0 0 2.88-3.622c.064.01.176.03.213.038.075-.05.144-.114.28-.104.266.039.54.138.87.256.154.06.277.128.448.173.036.01.088.019.13.028l.009.003.007.001c.297.064.584-.098.645-.365.06-.266-.128-.537-.423-.608zM16.4 9.701l-1.95 1.746v.005a.44.44 0 0 0 .173.757l.003.01 2.526.728a5.199 5.199 0 0 0-.108-1.674A5.208 5.208 0 0 0 16.4 9.7zm-4.013 5.325a.437.437 0 0 0-.404-.232.44.44 0 0 0-.372.233h-.002l-1.268 2.292a5.164 5.164 0 0 0 3.326.003l-1.27-2.296h-.01zm1.888-1.293a.44.44 0 0 0-.27.036.44.44 0 0 0-.214.572l-.003.004 1.01 2.438a5.15 5.15 0 0 0 2.081-2.615l-2.6-.44-.004.005z",
    },
  },
});

export const IconGit = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187",
    },
  },
});

export const IconGitHub = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    },
  },
});

export const IconGitLab = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z",
    },
  },
});

export const IconBitbucket = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z",
    },
  },
});

export const IconFigma = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
    },
  },
});

export const IconVSCode = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M23.15 2.587L18.21.21a1.49 1.49 0 0 0-1.705.29l-9.46 8.63l-4.12-3.128a1 1 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12L.326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a1 1 0 0 0 1.276.057l4.12-3.128l9.46 8.63a1.49 1.49 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352m-5.146 14.861L10.826 12l7.178-5.448z",
    },
  },
});

export const IconVim = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M24 11.986h-.027l-4.318-4.318 4.303-4.414V1.461l-.649-.648h-8.198l-.66.605v1.045L12.015.027V0L12 .014 11.986 0v.027l-1.29 1.291-.538-.539H2.035l-.638.692v1.885l.616.616h.72v5.31L.027 11.987H0L.014 12 0 12.014h.027l2.706 2.706v6.467l.907.523h2.322l1.857-1.904 4.166 4.166V24l.015-.014.014.014v-.028l2.51-2.509h.485c.111 0 .211-.07.25-.179l.146-.426c.028-.084.012-.172-.037-.239l1.462-1.462-.612 1.962c-.043.141.036.289.177.332.025.008.052.012.078.012h1.824c.106-.001.201-.064.243-.163l.165-.394c.025-.065.024-.138-.004-.203-.027-.065-.08-.116-.146-.142-.029-.012-.062-.019-.097-.02h-.075l.84-2.644h1.232l-1.016 3.221c-.043.141.036.289.176.332.025.008.052.012.079.012h2.002c.11 0 .207-.066.248-.17l.164-.428c.051-.138-.021-.29-.158-.341-.029-.011-.06-.017-.091-.017h-.145l1.131-3.673c.027-.082.012-.173-.039-.24l-.375-.504-.003-.005c-.051-.064-.127-.102-.209-.102h-1.436c-.071 0-.141.03-.19.081l-.4.439h-.624l-.042-.046 4.445-4.445H24L23.986 12l.014-.014zM9.838 21.139l1.579-4.509h-.501l.297-.304h1.659l-1.563 4.555h.623l-.079.258H9.838zm3.695-7.516l.15.151-.269.922-.225.226h-.969l-.181-.181.311-.871.288-.247h.895zM5.59 20.829H3.877l-.262-.15V3.091H2.379l-.1-.1V1.815l.143-.154h7.371l.213.214v1.108l-.142.173H8.785v8.688l8.807-8.688h-2.086l-.175-.188V1.805l.121-.111h7.49l.132.133v1.07L12.979 13.25h-.373c-.015-.001-.028 0-.042.001l-.02.003c-.045.01-.086.03-.119.06l-.343.295-.004.003c-.033.031-.059.069-.073.111l-.296.83-6.119 6.276zm14.768-3.952l.474-.519h1.334l.309.415-1.265 4.107h.493l-.08.209H19.84l1.124-3.564h-2.015l-1.077 3.391h.424l-.073.174h-1.605l1.107-3.548h-2.096l-1.062 3.339h.436l-.072.209H13.27l1.514-4.46H14.198l.091-.271h1.65l.519.537h.906l.491-.554h1.061l.489.535h.953z",
    },
  },
});

export const IconIntelliJ = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M0 0v24h24V0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723zm11.055 0H17v6.5c0 .612-.055 1.111-.222 1.556-.167.444-.39.777-.723 1.11-.277.279-.666.557-1.11.668a3.933 3.933 0 0 1-1.445.278c-.778 0-1.444-.167-1.944-.445a4.81 4.81 0 0 1-1.279-1.056l1.39-1.555c.277.334.555.555.833.722.277.167.611.278.945.278.389 0 .721-.111 1-.389.221-.278.333-.667.333-1.278zM2.222 19.5h9V21h-9z",
    },
  },
});

export const IconChrome = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z",
    },
  },
});

export const IconFirefox = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M8.824 7.287c.008 0 .004 0 0 0zm-2.8-1.4c.006 0 .003 0 0 0zm16.754 2.161c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z",
    },
  },
});

export const IconWindows = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801",
    },
  },
});

export const IconApple = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
    },
  },
});

export const IconLinux = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z",
    },
  },
});

export const IconAndroid = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z",
    },
  },
});

export const IconHeroku = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M18.238 4.505c-.282-.204-.616-.303-.975-.303H6.737c-.359 0-.693.1-1.007.315-.619.417-.975 1.089-.975 1.858v1.67c0 .078.063.141.141.141h1.809a.141.141 0 0 0 .141-.141V6.258c0-.33.184-.637.494-.801.095-.051.201-.076.308-.076h9.545c.111 0 .219.026.319.078.303.16.485.459.485.785v9.537c0 .33-.182.637-.485.799a1.028 1.028 0 0 1-.319.076H8.559a.141.141 0 0 0-.141.141v1.644c0 .078.063.141.141.141h8.704c.365 0 .705-.101 1.002-.303.623-.42.978-1.091.978-1.86V6.363c0-.77-.355-1.443-.996-1.858z",
    },
  },
});

export const IconVercel = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "m12 1.608 12 20.784H0Z",
    },
  },
});

export const IconNetlify = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M6.49 19.04h-.23L5.13 17.9v-.23l1.73-1.71h1.2l.15.15v1.2L6.5 19.04ZM5.13 6.31V6.1l1.13-1.13h.23L8.2 6.68v1.2l-.15.15h-1.2L5.13 6.31Zm9.96 9.09h-1.65l-.14-.13v-3.83c0-.68-.27-1.2-1.1-1.23-.42 0-.9 0-1.43.02l-.07.08v4.96l-.14.14H8.9l-.13-.14V8.73l.13-.14h3.7a2.6 2.6 0 0 1 2.61 2.6v4.08l-.13.14Zm-8.37-2.44H.14L0 12.82v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14Zm17.14 0h-6.58l-.14-.14v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14ZM11.05 6.55V1.64l.14-.14h1.65l.14.14v4.9l-.14.14h-1.65l-.14-.13Zm0 15.81v-4.9l.14-.14h1.65l.14.13v4.91l-.14.14h-1.65l-.14-.14Z",
    },
  },
});

export const IconCloudflare = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727",
    },
  },
});

export const IconAWS = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M6.763 10.036q.002.446.088.71c.064.176.144.368.256.576c.04.063.056.127.056.183q.002.12-.152.24l-.503.335a.4.4 0 0 1-.208.072q-.12-.002-.239-.112a2.5 2.5 0 0 1-.287-.375a6 6 0 0 1-.248-.471q-.934 1.101-2.347 1.101c-.67 0-1.205-.191-1.596-.574q-.588-.575-.59-1.533c0-.678.239-1.23.726-1.644c.487-.415 1.133-.623 1.955-.623c.272 0 .551.024.846.064c.296.04.6.104.918.176v-.583q-.001-.909-.375-1.277c-.255-.248-.686-.367-1.3-.367c-.28 0-.568.031-.863.103q-.443.106-.862.272a2 2 0 0 1-.28.104a.5.5 0 0 1-.127.023q-.168.002-.168-.247v-.391c0-.128.016-.224.056-.28a.6.6 0 0 1 .224-.167a4.6 4.6 0 0 1 1.005-.36a4.8 4.8 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647q.66.645.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144a1.8 1.8 0 0 0 .758-.51a1.3 1.3 0 0 0 .272-.512c.047-.191.08-.423.08-.694v-.335a7 7 0 0 0-.735-.136a6 6 0 0 0-.75-.048c-.535 0-.926.104-1.19.32c-.263.215-.39.518-.39.917c0 .375.095.655.295.846c.191.2.47.296.838.296m6.41.862c-.144 0-.24-.024-.304-.08c-.064-.048-.12-.16-.168-.311L7.586 5.55a1.4 1.4 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783q.227-.001.31.08c.065.048.113.16.16.312l1.342 5.284l1.245-5.284q.058-.24.151-.312a.55.55 0 0 1 .32-.08h.638c.152 0 .256.025.32.08c.063.048.12.16.151.312l1.261 5.348l1.381-5.348q.074-.24.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2c0 .04-.009.08-.017.128a1 1 0 0 1-.056.2l-1.923 6.17q-.072.24-.168.311a.5.5 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08c-.063-.056-.119-.16-.15-.32l-1.238-5.148l-1.23 5.14c-.04.16-.087.264-.15.32c-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143c-.399-.096-.71-.2-.918-.32c-.128-.071-.215-.151-.247-.223a.6.6 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247q.072 0 .144.024c.048.016.12.048.2.08q.408.181.878.279c.319.064.63.096.95.096c.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758a.78.78 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.9 1.9 0 0 1-.4-1.158q0-.502.216-.886c.144-.255.335-.479.575-.654c.24-.184.51-.32.83-.415c.32-.096.655-.136 1.006-.136c.175 0 .359.008.535.032c.183.024.35.056.518.088q.24.058.455.127q.216.072.336.144a.7.7 0 0 1 .24.2a.43.43 0 0 1 .071.263v.375q-.002.254-.184.256a.8.8 0 0 1-.303-.096a3.65 3.65 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223s-.375.383-.375.71c0 .224.08.416.24.567c.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767s.367.702.367 1.117c0 .343-.072.655-.207.926a2.2 2.2 0 0 1-.583.703c-.248.2-.543.343-.886.447c-.36.111-.734.167-1.142.167m1.509 3.88c-2.626 1.94-6.442 2.969-9.722 2.969c-4.598 0-8.74-1.7-11.87-4.526c-.247-.223-.024-.527.272-.351c3.384 1.963 7.559 3.153 11.877 3.153c2.914 0 6.114-.607 9.06-1.852c.439-.2.814.287.383.607m1.094-1.246c-.336-.43-2.22-.207-3.074-.103c-.255.032-.295-.192-.063-.36c1.5-1.053 3.967-.75 4.254-.399c.287.36-.08 2.826-1.485 4.007c-.215.184-.423.088-.327-.151c.32-.79 1.03-2.57.695-2.994",
    },
  },
});

export const IconGCP = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z",
    },
  },
});

export const IconAzure = createSvgIcon({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: false,
  children: {
    type: "path",
    props: {
      d: "M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892l4.947 3.675c.28.208.618.32.966.32m-3.084-12.531l3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76l-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684",
    },
  },
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
  XTwitter: IconXTwitter,
  LinkedIn: IconLinkedIn,
  Facebook: IconFacebook,
  Instagram: IconInstagram,
  Youtube: IconYoutube,
  Discord: IconDiscord,
  Reddit: IconReddit,
  Twitch: IconTwitch,
  Slack: IconSlack,
  Dribbble: IconDribbble,
  Behance: IconBehance,
  Pinterest: IconPinterest,
  TikTok: IconTikTok,
  WhatsApp: IconWhatsApp,
  Astro: IconAstro,
  Vue: IconVue,
  Angular: IconAngular,
  React: IconReact,
  Svelte: IconSvelte,
  NodeJs: IconNodeJs,
  Npm: IconNpm,
  Yarn: IconYarn,
  Pnpm: IconPnpm,
  Vite: IconVite,
  NextJs: IconNextJs,
  Remix: IconRemix,
  Nuxt: IconNuxt,
  Solid: IconSolid,
  Electron: IconElectron,
  Tailwind: IconTailwind,
  Webpack: IconWebpack,
  Rollup: IconRollup,
  Esbuild: IconEsbuild,
  TypeScript: IconTypeScript,
  JavaScript: IconJavaScript,
  Bun: IconBun,
  Deno: IconDeno,
  Docker: IconDocker,
  Kubernetes: IconKubernetes,
  Git: IconGit,
  GitHub: IconGitHub,
  GitLab: IconGitLab,
  Bitbucket: IconBitbucket,
  Figma: IconFigma,
  VSCode: IconVSCode,
  Vim: IconVim,
  IntelliJ: IconIntelliJ,
  Chrome: IconChrome,
  Firefox: IconFirefox,
  Windows: IconWindows,
  Apple: IconApple,
  Linux: IconLinux,
  Android: IconAndroid,
  Heroku: IconHeroku,
  Vercel: IconVercel,
  Netlify: IconNetlify,
  AWS: IconAWS,
  GCP: IconGCP,
  Azure: IconAzure,
};

export const IconEmberKit = createSvgIcon({
  viewBox: "0 0 32 32",
  fill: "currentColor",
  stroke: false,
  children: [
    {
      type: "path",
      props: {
        d: "M16 2C16 2 25 8 25 17C25 22.5 22 28 18.5 31C17 32 15 32 13.5 31C9.8 27.5 6 21 6 15.5C6 8.5 10.5 3 12 2C13.5 1 14.5 1.5 15 2.5C15.5 3.5 15 5 14 6C13 7 10 10.5 10 14.5C10 18 12.5 21.5 14.5 23.5C15.5 24.5 16.5 24.5 17.5 23.5C19.5 21.5 22 18 22 14.5C22 10.5 19 7 18 6C17 5 16.5 3.5 17 2.5C17.5 1.5 18.5 1 20 2C21.5 3 26 8.5 26 15.5C26 22 22.5 28.5 18.5 31.5",
      },
    },
    {
      type: "path",
      props: {
        d: "M16 6C16 6 21 10.5 21 15.5C21 19 19 22.5 17 24.5C16.5 25 15.5 25 15 24.5C13 22.5 11 19 11 15.5C11 10.5 16 6 16 6Z",
      },
    },
    {
      type: "circle",
      props: { cx: "12", cy: "4", r: "1.2" },
    },
    {
      type: "circle",
      props: { cx: "20", cy: "4", r: "1.2" },
    },
    {
      type: "circle",
      props: { cx: "8", cy: "9", r: "0.8" },
    },
    {
      type: "circle",
      props: { cx: "24", cy: "9", r: "0.8" },
    },
  ],
});
