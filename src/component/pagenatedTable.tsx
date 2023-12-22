import {
  Image,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React from 'react';
import { useSelector } from 'react-redux';

const PagenatedTable = () => {
  const searchResults = useSelector(state => state.searchResults.results);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(searchResults.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return searchResults.slice(start, end);
  }, [page, searchResults]);

  React.useEffect(() => {
    setPage(1);
  }, [searchResults]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'thumnail':
        return <Image isZoomed width={50} height={50} alt='No Image Found' src={cellValue} />;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      aria-label='table with client side pagination'
      bottomContent={
        <div className='flex w-full justify-center'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='primary'
            page={page}
            total={pages}
            onChange={page => setPage(page)}
          />
          {/* <Button
            isIconOnly
            className='min-w-9 box-border h-9 w-9 rounded-medium bg-default-100 text-small text-default-foreground outline-none active:bg-default-300'
            onClick={() => setPage(1)}
          >
            {'<<'}
          </Button>
          <Button
            isIconOnly
            className='min-w-9 box-border h-9 w-9 rounded-medium bg-default-100 text-small text-default-foreground outline-none active:bg-default-300'
            onClick={() => setPage(pages)}
          >
            {'>>'}
          </Button> */}
        </div>
      }
      classNames={{
        wrapper: 'min-h-[300px]',
      }}
    >
      <TableHeader>
        <TableColumn key='thumnail'>サムネイル</TableColumn>
        <TableColumn key='recordStartTime'>収録開始日時</TableColumn>
        <TableColumn key='materialNo'>素材番号</TableColumn>
        <TableColumn key='genre'>ジャンル</TableColumn>
        <TableColumn key='programName'>番組名</TableColumn>
        <TableColumn key='category'>カテゴリ</TableColumn>
        <TableColumn key='title'>タイトル</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={'データなし.'}>
        {item => (
          <TableRow key={item.key}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PagenatedTable;
