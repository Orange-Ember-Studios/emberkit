import { createSignal } from '@emberkit/core';
import {
  IconMenu, IconX, IconSearch, IconGithub,
  IconChevronDown, IconChevronRight, IconChevronLeft,
  IconArrowRight, IconArrowUp, IconArrowDown,
  IconPlay, IconPause, IconCode, IconBook,
  IconZap, IconPackage, IconTarget, IconType,
  IconSun, IconMoon, IconCopy, IconCheck,
  IconAlertCircle, IconExternalLink, IconPlus, IconMinus,
  IconTerminal, IconLayers, IconGrid, IconSettings,
  IconGlobe, IconImage, IconFile, IconFolder,
  IconEdit, IconTrash, IconHeart, IconStar,
  IconHome, IconUser, IconUsers, IconLock,
  IconMail, IconCalendar, IconClock, IconMapPin,
  IconLink, IconRefresh, IconShield, IconCloud,
  IconDownload, IconUpload, IconAlertTriangle, IconInfo,
  IconFilter, IconShare, IconBookmark, IconTag,
  IconBell, IconMessageCircle, IconPhone, IconVideo,
  IconMic, IconVolume, IconVolumeX, IconPower,
  IconLogOut, IconLogIn, IconLoader, IconDatabase,
  IconServer, IconWifi, IconBattery, IconFlag,
  IconEye, IconEyeOff, IconThumbsUp, IconThumbsDown,
  IconClipboard, IconMaximize, IconMinimize,
  IconMoreHorizontal, IconMoreVertical,
  IconPieChart, IconBarChart, IconActivity,
  IconAward, IconCompass, IconHash, IconAtSign,
  IconSend, IconInbox, IconArchive, IconTrash2,
  IconScissors, IconCheckCircle, IconXCircle, IconHelpCircle,
  IconXTwitter, IconLinkedIn, IconFacebook, IconInstagram,
  IconYoutube, IconDiscord, IconReddit, IconTwitch,
  IconSlack, IconTikTok, IconWhatsApp,
  IconDribbble, IconBehance, IconPinterest,
  IconAstro, IconVue, IconAngular, IconReact,
  IconSvelte, IconNodeJs, IconNpm, IconYarn,
  IconPnpm, IconVite, IconNextJs, IconRemix,
  IconNuxt, IconSolid, IconElectron, IconTailwind,
  IconWebpack, IconRollup, IconEsbuild,
  IconTypeScript, IconJavaScript, IconBun, IconDeno,
  IconDocker, IconKubernetes, IconGit, IconGitHub,
  IconGitLab, IconBitbucket, IconFigma,
  IconVSCode, IconVim, IconIntelliJ,
  IconChrome, IconFirefox, IconWindows, IconApple,
  IconLinux, IconAndroid, IconHeroku, IconVercel,
  IconNetlify, IconCloudflare, IconAWS, IconGCP, IconAzure,
} from '@emberkit/icons';

type IconComponent = (props: { size?: number; className?: string; color?: string }) => unknown;

interface IconEntry {
  name: string;
  component: IconComponent;
}

const icons: IconEntry[] = [
  { name: 'IconMenu', component: IconMenu },
  { name: 'IconX', component: IconX },
  { name: 'IconSearch', component: IconSearch },
  { name: 'IconGithub', component: IconGithub },
  { name: 'IconChevronDown', component: IconChevronDown },
  { name: 'IconChevronRight', component: IconChevronRight },
  { name: 'IconChevronLeft', component: IconChevronLeft },
  { name: 'IconArrowRight', component: IconArrowRight },
  { name: 'IconArrowUp', component: IconArrowUp },
  { name: 'IconArrowDown', component: IconArrowDown },
  { name: 'IconPlay', component: IconPlay },
  { name: 'IconPause', component: IconPause },
  { name: 'IconCode', component: IconCode },
  { name: 'IconBook', component: IconBook },
  { name: 'IconZap', component: IconZap },
  { name: 'IconPackage', component: IconPackage },
  { name: 'IconTarget', component: IconTarget },
  { name: 'IconType', component: IconType },
  { name: 'IconSun', component: IconSun },
  { name: 'IconMoon', component: IconMoon },
  { name: 'IconCopy', component: IconCopy },
  { name: 'IconCheck', component: IconCheck },
  { name: 'IconAlertCircle', component: IconAlertCircle },
  { name: 'IconExternalLink', component: IconExternalLink },
  { name: 'IconPlus', component: IconPlus },
  { name: 'IconMinus', component: IconMinus },
  { name: 'IconTerminal', component: IconTerminal },
  { name: 'IconLayers', component: IconLayers },
  { name: 'IconGrid', component: IconGrid },
  { name: 'IconSettings', component: IconSettings },
  { name: 'IconGlobe', component: IconGlobe },
  { name: 'IconImage', component: IconImage },
  { name: 'IconFile', component: IconFile },
  { name: 'IconFolder', component: IconFolder },
  { name: 'IconEdit', component: IconEdit },
  { name: 'IconTrash', component: IconTrash },
  { name: 'IconHeart', component: IconHeart },
  { name: 'IconStar', component: IconStar },
  { name: 'IconHome', component: IconHome },
  { name: 'IconUser', component: IconUser },
  { name: 'IconUsers', component: IconUsers },
  { name: 'IconLock', component: IconLock },
  { name: 'IconMail', component: IconMail },
  { name: 'IconCalendar', component: IconCalendar },
  { name: 'IconClock', component: IconClock },
  { name: 'IconMapPin', component: IconMapPin },
  { name: 'IconLink', component: IconLink },
  { name: 'IconRefresh', component: IconRefresh },
  { name: 'IconShield', component: IconShield },
  { name: 'IconCloud', component: IconCloud },
  { name: 'IconDownload', component: IconDownload },
  { name: 'IconUpload', component: IconUpload },
  { name: 'IconAlertTriangle', component: IconAlertTriangle },
  { name: 'IconInfo', component: IconInfo },
  { name: 'IconFilter', component: IconFilter },
  { name: 'IconShare', component: IconShare },
  { name: 'IconBookmark', component: IconBookmark },
  { name: 'IconTag', component: IconTag },
  { name: 'IconBell', component: IconBell },
  { name: 'IconMessageCircle', component: IconMessageCircle },
  { name: 'IconPhone', component: IconPhone },
  { name: 'IconVideo', component: IconVideo },
  { name: 'IconMic', component: IconMic },
  { name: 'IconVolume', component: IconVolume },
  { name: 'IconVolumeX', component: IconVolumeX },
  { name: 'IconPower', component: IconPower },
  { name: 'IconLogOut', component: IconLogOut },
  { name: 'IconLogIn', component: IconLogIn },
  { name: 'IconLoader', component: IconLoader },
  { name: 'IconDatabase', component: IconDatabase },
  { name: 'IconServer', component: IconServer },
  { name: 'IconWifi', component: IconWifi },
  { name: 'IconBattery', component: IconBattery },
  { name: 'IconFlag', component: IconFlag },
  { name: 'IconEye', component: IconEye },
  { name: 'IconEyeOff', component: IconEyeOff },
  { name: 'IconThumbsUp', component: IconThumbsUp },
  { name: 'IconThumbsDown', component: IconThumbsDown },
  { name: 'IconClipboard', component: IconClipboard },
  { name: 'IconMaximize', component: IconMaximize },
  { name: 'IconMinimize', component: IconMinimize },
  { name: 'IconMoreHorizontal', component: IconMoreHorizontal },
  { name: 'IconMoreVertical', component: IconMoreVertical },
  { name: 'IconPieChart', component: IconPieChart },
  { name: 'IconBarChart', component: IconBarChart },
  { name: 'IconActivity', component: IconActivity },
  { name: 'IconAward', component: IconAward },
  { name: 'IconCompass', component: IconCompass },
  { name: 'IconHash', component: IconHash },
  { name: 'IconAtSign', component: IconAtSign },
  { name: 'IconSend', component: IconSend },
  { name: 'IconInbox', component: IconInbox },
  { name: 'IconArchive', component: IconArchive },
  { name: 'IconTrash2', component: IconTrash2 },
  { name: 'IconScissors', component: IconScissors },
  { name: 'IconCheckCircle', component: IconCheckCircle },
  { name: 'IconXCircle', component: IconXCircle },
  { name: 'IconHelpCircle', component: IconHelpCircle },
  { name: 'IconXTwitter', component: IconXTwitter },
  { name: 'IconLinkedIn', component: IconLinkedIn },
  { name: 'IconFacebook', component: IconFacebook },
  { name: 'IconInstagram', component: IconInstagram },
  { name: 'IconYoutube', component: IconYoutube },
  { name: 'IconDiscord', component: IconDiscord },
  { name: 'IconReddit', component: IconReddit },
  { name: 'IconTwitch', component: IconTwitch },
  { name: 'IconSlack', component: IconSlack },
  { name: 'IconTikTok', component: IconTikTok },
  { name: 'IconWhatsApp', component: IconWhatsApp },
  { name: 'IconDribbble', component: IconDribbble },
  { name: 'IconBehance', component: IconBehance },
  { name: 'IconPinterest', component: IconPinterest },
  { name: 'IconAstro', component: IconAstro },
  { name: 'IconVue', component: IconVue },
  { name: 'IconAngular', component: IconAngular },
  { name: 'IconReact', component: IconReact },
  { name: 'IconSvelte', component: IconSvelte },
  { name: 'IconNodeJs', component: IconNodeJs },
  { name: 'IconNpm', component: IconNpm },
  { name: 'IconYarn', component: IconYarn },
  { name: 'IconPnpm', component: IconPnpm },
  { name: 'IconVite', component: IconVite },
  { name: 'IconNextJs', component: IconNextJs },
  { name: 'IconRemix', component: IconRemix },
  { name: 'IconNuxt', component: IconNuxt },
  { name: 'IconSolid', component: IconSolid },
  { name: 'IconElectron', component: IconElectron },
  { name: 'IconTailwind', component: IconTailwind },
  { name: 'IconWebpack', component: IconWebpack },
  { name: 'IconRollup', component: IconRollup },
  { name: 'IconEsbuild', component: IconEsbuild },
  { name: 'IconTypeScript', component: IconTypeScript },
  { name: 'IconJavaScript', component: IconJavaScript },
  { name: 'IconBun', component: IconBun },
  { name: 'IconDeno', component: IconDeno },
  { name: 'IconDocker', component: IconDocker },
  { name: 'IconKubernetes', component: IconKubernetes },
  { name: 'IconGit', component: IconGit },
  { name: 'IconGitHub', component: IconGitHub },
  { name: 'IconGitLab', component: IconGitLab },
  { name: 'IconBitbucket', component: IconBitbucket },
  { name: 'IconFigma', component: IconFigma },
  { name: 'IconVSCode', component: IconVSCode },
  { name: 'IconVim', component: IconVim },
  { name: 'IconIntelliJ', component: IconIntelliJ },
  { name: 'IconChrome', component: IconChrome },
  { name: 'IconFirefox', component: IconFirefox },
  { name: 'IconWindows', component: IconWindows },
  { name: 'IconApple', component: IconApple },
  { name: 'IconLinux', component: IconLinux },
  { name: 'IconAndroid', component: IconAndroid },
  { name: 'IconHeroku', component: IconHeroku },
  { name: 'IconVercel', component: IconVercel },
  { name: 'IconNetlify', component: IconNetlify },
  { name: 'IconCloudflare', component: IconCloudflare },
  { name: 'IconAWS', component: IconAWS },
  { name: 'IconGCP', component: IconGCP },
  { name: 'IconAzure', component: IconAzure },
];

function IconShowcase() {
  const [selected, setSelected] = createSignal<string | null>(null);
  const [copied, setCopied] = createSignal(false);

  const handleCopy = async (name: string) => {
    const importText = `import { ${name} } from '@emberkit/icons';`;
    try {
      await navigator.clipboard.writeText(importText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for environments without clipboard API
    }
  };

  const selectedIcon = selected() ? icons.find(i => i.name === selected()) : null;

  return (
    <div>
      {selectedIcon && (
        <div className="mb-8 rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5">
              {(() => {
                const IconComp = selectedIcon.component;
                return <IconComp size={32} />;
              })()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedIcon.name}</h3>
              <code className="text-sm text-orange-400">
                {'import { '}{selectedIcon.name}{' }'} from '@emberkit/icons';
              </code>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(selectedIcon.name)}
              className="rounded-lg bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-400 transition-all hover:bg-orange-500/30 active:scale-95"
            >
              {copied() ? 'Copied!' : 'Copy Import'}
            </button>
            <button
              onClick={() => setSelected(null)}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
        {icons.map((icon) => {
          const IconComp = icon.component;
          const isActive = selected() === icon.name;
          return (
            <button
              key={icon.name}
              onClick={() => setSelected(isActive ? null : icon.name)}
              className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-400 scale-105'
                  : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white hover:scale-105'
              }`}
              title={icon.name}
            >
              <IconComp size={20} />
              <span className="mt-1.5 truncate text-[9px] leading-tight opacity-50 group-hover:opacity-100 transition-opacity">
                {icon.name.replace('Icon', '')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default IconShowcase;
