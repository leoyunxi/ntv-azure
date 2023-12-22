'use client';

import SingleSelectionDropDown from '@/component/singleSelectionDropDown';
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import classnames from 'classnames';
import { usePathname } from 'next/navigation';
import { PiTelevisionDuotone } from 'react-icons/pi';

export const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { lable: '素材検索', href: '/' },
    { lable: 'お気に入り', href: '/favorite' },
    { lable: '素材登録', href: '/register' },
    { lable: '運行表登録', href: '/timetable' },
    { lable: 'CG/音効UL', href: '/upload' },
    { lable: 'JOB一覧', href: '/job' },
    { lable: 'オーダー一覧', href: '/order' },
  ];

  const groups = ['CVグループ1', 'CVグループ2', 'CVグループ3'];

  return (
    <>
      <Navbar maxWidth='full' isBordered position='sticky'>
        <NavbarBrand>
          <Link href='/' className='text-slate-800'>
            <h1 className='flex text-2xl p-10 items-center'>
              <PiTelevisionDuotone />
              リモートCMS
            </h1>
          </Link>
        </NavbarBrand>
        <NavbarContent className='hidden sm:flex gap-6' justify='center'>
          {links.map(link => (
            <NavbarItem key={link.href}>
              <Link
                key={link.href}
                href={link.href}
                className={classnames({
                  'text-sky-500': link.href == currentPath,
                  'text-zinc-600 ': link.href !== currentPath,
                  'hover:text-sky-600 transition-colors': true,
                })}
              >
                {link.lable}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify='end'>
          <NavbarItem>
            <SingleSelectionDropDown
              items={groups}
              selected='CVグループ1'
            ></SingleSelectionDropDown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};
