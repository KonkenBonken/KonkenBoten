export function DiscordImage({ src, srcSizes, className }: { src: string, srcSizes?: number[], className?: string }) {
  const sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
    .filter(size => !srcSizes || srcSizes.includes(size)),
    srcset = (size: number) => `${src}?size=${size} ${size}w`;

  return (<img src={`${src}?size=${sizes[0]}`} srcSet={sizes.map(srcset).join()} className={className} />);
}
