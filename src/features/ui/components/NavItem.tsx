import { type HTMLProps, type MouseEventHandler, type ReactNode } from 'react';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

export type NavItemProps = {
  className?: string;
  children: ReactNode;
} & (
  | Required<Pick<HTMLProps<HTMLButtonElement>, 'onClick'>>
  | {
      to: string;
    }
);

const NavItem = ({ className, children, ...props }: NavItemProps) => {
  const router = useRouter();
  const isActive =
    'to' in props && props.to === '/'
      ? router.pathname === props.to
      : 'to' in props && router.pathname.startsWith(props.to);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    'onClick' in props ? props.onClick(e) : void router.push(props.to);
  };

  return (
    <button
      className={twMerge(
        'px-2',
        isActive
          ? 'text-pink-500 hover:text-pink-700 [&.active]:text-pink-900 font-semibold dark:[&.active]:text-zinc-400 text-sm lg:text-base'
          : 'text-neutral-500 hover:text-neutral-700 [&.active]:text-black/90 dark:[&.active]:text-zinc-400 text-sm lg:text-base',
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default NavItem;
