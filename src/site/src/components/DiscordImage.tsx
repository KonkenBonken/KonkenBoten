import { useState } from 'react';

export function DiscordImage({ src, srcSizes, className, animateOnHover }: { src: string, srcSizes?: number[], className?: string, animateOnHover?: false }) {
  const [hovered, setHovered] = (animateOnHover ?? src.includes('a_')) ? useState(false) : [false, () => false];

  const sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
    .filter(size => !srcSizes || srcSizes.includes(size)),
    srcset = (size: number) => `${src}${hovered ? '.gif' : '.png'}?size=${size} ${size}w`;

  return (<img
    onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}
    src={`${src}.png?size=${sizes[0]}`} srcSet={sizes.map(srcset).join()} className={className}
  />);
}

export function GuildPlaceholder({ name }: { name: string }) {
  const acronym = name //https://github.com/discordjs/discord.js/blob/386c41f24fb3c9d06967d9c1881a57645c3a71f2/packages/discord.js/src/structures/BaseGuild.js#L67-L69
    .replace(/'s /g, ' ')
    .replace(/\w+/g, e => e[0])
    .replace(/\s/g, '');

  return (<div className="placeholder">{acronym}</div>)
}
