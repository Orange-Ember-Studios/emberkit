# @emberkit/icons

SVG icon library for EmberKit. Tree-shakeable, lightweight, and built with JSX.

## Install

```bash
npm install @emberkit/icons
# or
pnpm add @emberkit/icons
```

## Usage

```tsx
import { IconMenu, IconX, IconSearch } from '@emberkit/icons';

function Header() {
  return (
    <nav>
      <IconMenu size={24} />
      <IconX size={24} color="#f97316" />
      <IconSearch size={20} className="search-icon" />
    </nav>
  );
}
```

## Available Icons

| Category | Icons |
|----------|-------|
| Navigation | `IconMenu`, `IconX`, `IconChevronDown`, `IconChevronRight`, `IconChevronLeft` |
| Arrows | `IconArrowRight`, `IconArrowUp`, `IconArrowDown` |
| Media | `IconPlay`, `IconPause`, `IconImage` |
| Code | `IconCode`, `IconTerminal` |
| UI | `IconSearch`, `IconCopy`, `IconCheck`, `IconPlus`, `IconMinus`, `IconExternalLink` |
| Files | `IconFile`, `IconFolder`, `IconEdit`, `IconTrash`, `IconDownload`, `IconUpload` |
| Shapes | `IconHeart`, `IconStar`, `IconShield`, `IconCloud`, `IconGlobe` |
| People | `IconUser`, `IconUsers`, `IconLock`, `IconMail` |
| Time | `IconCalendar`, `IconClock` |
| Layout | `IconHome`, `IconGrid`, `IconLayers`, `IconSettings` |
| Brand | `IconGithub` |
| Alerts | `IconAlertCircle` |
| Other | `IconBook`, `IconZap`, `IconPackage`, `IconTarget`, `IconType`, `IconSun`, `IconMoon`, `IconLink`, `IconRefresh`, `IconMapPin` |

## Props

All icons accept the same props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `24` | Width and height in pixels |
| `color` | `string` | `currentColor` | Stroke or fill color |
| `className` | `string` | — | CSS class name |

## Default Import

You can also import all icons as an object:

```tsx
import Icons from '@emberkit/icons';

<Icons.Menu size={24} />
```

## License

Apache-2.0
