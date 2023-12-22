// @ts-nocheck
import { Button, Chip, Listbox, ListboxItem } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
type ListboxProps = {
  source: string[];
  destination: string[];
  addToDestination: (items: string[]) => void;
  removeFromDestination: (items: string[]) => void;
  srcTitle?: string;
  desTitle?: string;
};

const DoubleListbox: FC<ListboxProps> = ({
  source,
  destination,
  addToDestination,
  removeFromDestination,
  srcTitle = '分類',
  desTitle = '選択',
}) => {
  const dispatch = useDispatch();
  const [selectedSrc, setSelectedSrc] = useState(new Set([]));
  const [selectedDes, setSelectedDes] = useState(new Set([]));
  const selectedValue = React.useMemo(() => Array.from(selectedSrc).join(', '), [selectedSrc]);

  const handleAddToDestination = () => {
    dispatch(addToDestination(Array.from(selectedSrc)));
    setSelectedSrc([]);
  };

  const handleRemoveFromDestination = () => {
    dispatch(removeFromDestination([...selectedDes]));
    setSelectedDes([]);
  };

  return (
    <div className='flex justify-between space-x-2 w-full max-w-full'>
      <div className='w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100'>
        <Listbox
          topContent={
            <Chip size='sm' variant='shadow' className='max-w-full' radius='sm'>
              {srcTitle}
            </Chip>
          }
          classNames={{
            base: 'max-w-xs',
            list: 'max-h-[100px] overflow-y-scroll !important',
          }}
          aria-label='Multiple selection origin'
          color='primary'
          disallowEmptySelection={false}
          selectionMode='multiple'
          selectedKeys={selectedSrc}
          onSelectionChange={setSelectedSrc}
          variant='flat'
        >
          {source.map(item => (
            <ListboxItem key={item} textValue={item} className='flex-shrink-0'>
              {item}
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      <div className='flex flex-col justify-around'>
        <Button color='default' size='sm' variant='faded' onClick={handleAddToDestination}>
          &gt;&gt;
        </Button>
        <Button color='default' size='sm' variant='faded' onClick={handleRemoveFromDestination}>
          &lt;&lt;
        </Button>
      </div>

      <div className='w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100'>
        <Listbox
          topContent={
            <Chip size='sm' variant='shadow' className='max-w-full' radius='sm'>
              {desTitle}
            </Chip>
          }
          classNames={{
            base: 'max-w-xs',
            list: 'max-h-[100px] overflow-scroll !important',
          }}
          aria-label='Multiple selection edited'
          variant='flat'
          color='primary'
          disallowEmptySelection={false}
          selectionMode='multiple'
          selectedKeys={selectedDes}
          onSelectionChange={setSelectedDes}
        >
          {destination.map(item => (
            <ListboxItem key={item} className='flex-shrink-0'>
              {item}
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </div>
  );
};

export default DoubleListbox;
