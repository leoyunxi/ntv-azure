// @ts-nocheck
'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import React from 'react';

type Props = {
  selected: string;
  items: string[];
  onSelected?: ((key: string | number) => void) | undefined;
};

const SingleSelectionDropDown = ({ selected, items, onSelected }: Props) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([selected]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='bordered' className='capitalize'>
          {selectedValue}
          <CaretDownIcon width='16' height='16' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onAction={onSelected}
      >
        {items.map(item => (
          <DropdownItem key={item}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SingleSelectionDropDown;
