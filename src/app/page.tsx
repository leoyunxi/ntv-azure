'use client';
import DoubleListbox from '@/component/doubleListBox';
import PagenatedTable from '@/component/pagenatedTable';
import SingleSelectionDropDown from '@/component/singleSelectionDropDown';
import data from '@/constant/data';
import { addToDestination, removeFromDestination } from '@/redux/features/listbox/listboxSlice';
import { RootState } from '@/redux/store';
import { Button, Checkbox, Input, Tab, Tabs } from '@nextui-org/react';
import {
  Card,
  Col,
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
  Flex,
  Grid,
} from '@tremor/react';
import { ja } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MdAccessTime, MdEditCalendar, MdOutlineInfo } from 'react-icons/md';
import { parse, isSameDay } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '@/redux/features/searchResult/searchResultsSlice';

interface SearchConditions {
  recordStartTimeStart?: string;
  recordStartTimeEnd?: string;
  materialNoIncludes?: string;
  genreIncludes?: string[];
  programNameIncludes?: string[];
  categoryIncludes?: string[];
  freeword?: string;
}

export default function Home() {
  const dispatch = useDispatch();

  const [dateValue, setDateValue] = useState<DateRangePickerValue>({
    from: undefined,
    to: undefined,
  });
  const [conjunctiveOperators, setConjunctiveOperators] = React.useState<string>('');
  const [freeword, setFreeword] = React.useState<string>('');
  const [materialNo, setMaterialNo] = React.useState<string>('');
  const { genre, programName, category } = useSelector((state: RootState) => state.listbox);

  const [isDateSelected, setIsDateSelected] = useState<boolean>(false);
  const [isOriginSelected, setIsOriginSelected] = useState<boolean>(false);
  const [isEditSelected, setIsEditSelected] = useState<boolean>(false);

  const isInvalid = React.useMemo(() => {
    if (materialNo === '') return false;
    return materialNo.match(/^[0-9a-zA-Z]{1,9}$/i) ? false : true;
  }, [materialNo]);

  useEffect(() => {
    const storedValue = localStorage.getItem('materialData');
    if (storedValue) {
      const deserializedData = JSON.parse(storedValue);
      dispatch(setSearchResults(deserializedData));
    } else {
      const serializedData = JSON.stringify(data);
      localStorage.setItem('materialData', serializedData);
      const deserializedData = JSON.parse(serializedData);
      dispatch(setSearchResults(deserializedData));
    }
  });

  const searchByMaterialInfo = (data: any[], conditions: SearchConditions): any[] => {
    conditions.recordStartTimeStart = isDateSelected ? conditions.recordStartTimeStart : '';
    conditions.recordStartTimeEnd = isDateSelected ? conditions.recordStartTimeEnd : '';
    conditions.genreIncludes = isOriginSelected ? conditions.genreIncludes : [];
    conditions.programNameIncludes = isEditSelected ? conditions.programNameIncludes : [];

    return data.filter(record => {
      if (conditions.recordStartTimeStart && conditions.recordStartTimeEnd) {
        if (conditions.recordStartTimeStart == conditions.recordStartTimeEnd) {
          console.log('equal');
          const parsedDate1 = parse(conditions?.recordStartTimeStart, 'MM/dd/yyyy', new Date());
          const parsedDate2 = parse(record.recordStartTime, "yyyy-MM-dd'T'HH:mm:ss", new Date());
          const isSameDate = isSameDay(parsedDate1, parsedDate2);
          if (!isSameDate) return false;
        } else if (
          new Date(record.recordStartTime) < new Date(conditions.recordStartTimeStart) ||
          new Date(record.recordStartTime) > new Date(conditions.recordStartTimeEnd)
        ) {
          return false;
        }
      }

      if (
        conditions.materialNoIncludes &&
        !record.materialNo.includes(conditions.materialNoIncludes)
      ) {
        return false;
      }

      if (
        conditions.genreIncludes &&
        conditions.genreIncludes.length > 0 &&
        !conditions.genreIncludes.some(genre => record.genre.includes(genre))
      ) {
        return false;
      }

      if (
        conditions.programNameIncludes &&
        conditions.programNameIncludes.length > 0 &&
        !conditions.programNameIncludes.some(programName =>
          record.programName.includes(programName)
        )
      ) {
        return false;
      }

      if (
        conditions.categoryIncludes &&
        conditions.categoryIncludes.length > 0 &&
        !conditions.categoryIncludes.some(category => record.category.includes(category))
      ) {
        return false;
      }

      if (conditions.freeword) {
        const keywordsArray = conditions.freeword.split(/\s+/);

        if (conjunctiveOperators === 'AND') {
          return keywordsArray.every(keyword => record.title.includes(keyword));
        }

        if (conjunctiveOperators === 'OR') {
          return keywordsArray.some(keyword => record.title.includes(keyword));
        }
      }
      return true;
    });
  };

  return (
    <>
      <div className='flex w-full flex-col'>
        <Tabs
          aria-label='Options'
          color='primary'
          variant='bordered'
          classNames={{
            tabList: 'gap-6 w-full relative',
          }}
        >
          <Tab
            key='searchBy'
            title={
              <div className='flex items-center space-x-2'>
                <MdOutlineInfo />
                <span>素材情報で検索</span>
              </div>
            }
          >
            <Grid numItems={1} numItemsSm={2} numItemsLg={3} className='gap-3'>
              <Card>
                <div className='flex flex-col space-y-5'>
                  <Button
                    // isIconOnly
                    size='md'
                    color='default'
                    variant='bordered'
                    aria-label='search btn'
                    className='w-max-[200px]'
                    onClick={() => {
                      const conditions: SearchConditions = {
                        recordStartTimeStart:
                          dateValue.from instanceof Date ? dateValue.from.toLocaleDateString() : '',
                        recordStartTimeEnd:
                          dateValue.to instanceof Date ? dateValue.to.toLocaleDateString() : '',
                        materialNoIncludes: materialNo,
                        genreIncludes: genre.destination,
                        programNameIncludes: programName.destination,
                        categoryIncludes: category.destination,
                        freeword: freeword,
                      };

                      const result = searchByMaterialInfo(data, conditions);
                      // 検索結果を反映する
                      dispatch(setSearchResults(result));
                    }}
                  >
                    <BiSearchAlt />
                    検索する
                  </Button>

                  <Flex flexDirection='col' alignItems='start'>
                    <Checkbox isSelected={isDateSelected} onValueChange={setIsDateSelected}>
                      収録日
                    </Checkbox>

                    <DateRangePicker
                      className='max-w-md mx-auto'
                      value={dateValue}
                      onValueChange={setDateValue}
                      locale={ja}
                      placeholder='日付を選択してください'
                      selectPlaceholder='...'
                      color='rose'
                      displayFormat='yyyy/MM/dd'
                      enableYearNavigation
                      weekStartsOn={1}
                    >
                      <DateRangePickerItem
                        key='max'
                        value='max'
                        from={new Date(0)}
                        to={new Date(new Date().getTime() - 24 * 2 * 60 * 60 * 1000)}
                      >
                        更に前
                      </DateRangePickerItem>
                      <DateRangePickerItem
                        key='yesterday'
                        value='yesterday'
                        from={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                        to={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                      >
                        昨日
                      </DateRangePickerItem>
                      <DateRangePickerItem
                        key='today'
                        value='today'
                        from={new Date()}
                        to={new Date()}
                      >
                        今日
                      </DateRangePickerItem>
                    </DateRangePicker>
                  </Flex>

                  <Flex flexDirection='col' alignItems='start'>
                    <Checkbox isSelected={isOriginSelected} onValueChange={setIsOriginSelected}>
                      元素材
                    </Checkbox>

                    <DoubleListbox
                      srcTitle='ジャンル'
                      source={genre.source}
                      destination={genre.destination}
                      addToDestination={items => addToDestination({ key: 'genre', items })}
                      removeFromDestination={items =>
                        removeFromDestination({ key: 'genre', items })
                      }
                    />
                  </Flex>

                  <Flex flexDirection='col' alignItems='start'>
                    <Checkbox isSelected={isEditSelected} onValueChange={setIsEditSelected}>
                      編集済素材
                    </Checkbox>
                    <DoubleListbox
                      srcTitle='番組名'
                      source={programName.source}
                      destination={programName.destination}
                      addToDestination={items => addToDestination({ key: 'programName', items })}
                      removeFromDestination={items =>
                        removeFromDestination({ key: 'programName', items })
                      }
                    />
                  </Flex>

                  <Flex justifyContent='between' className='space-x-1'>
                    <SingleSelectionDropDown
                      items={['AND', 'OR']}
                      selected='AND'
                      onSelected={value => {
                        setConjunctiveOperators(`${value}`);
                      }}
                    ></SingleSelectionDropDown>

                    <div className='w-full flex gap-2 max-w-full'>
                      <Input
                        isClearable
                        variant='bordered'
                        label='フリーワード'
                        size='sm'
                        // labelPlacement="outside-left"
                        value={freeword}
                        onValueChange={setFreeword}
                      />
                    </div>
                  </Flex>

                  <div className='w-full flex gap-2 max-w-full m-0'>
                    <Input
                      isClearable
                      variant='bordered'
                      label='素材番号'
                      size='sm'
                      // labelPlacement="outside-left"
                      value={materialNo}
                      onValueChange={setMaterialNo}
                      isInvalid={isInvalid}
                      color={isInvalid ? 'danger' : 'default'}
                      errorMessage={isInvalid && '9桁以下英字&数字を入力してください'}
                    />
                  </div>
                </div>
              </Card>

              <Col numColSpan={1} numColSpanLg={2}>
                <PagenatedTable></PagenatedTable>
              </Col>
            </Grid>
          </Tab>

          <Tab
            key='timetable'
            title={
              <div className='flex items-center space-x-2'>
                <MdAccessTime />
                <span>運行表から検索</span>
              </div>
            }
          ></Tab>
          <Tab
            key='schedule'
            title={
              <div className='flex items-center space-x-2'>
                <MdEditCalendar />
                <span>取材予定から検索</span>
              </div>
            }
          ></Tab>
        </Tabs>
      </div>
    </>
  );
}
