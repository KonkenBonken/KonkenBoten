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
