import { Checkbox, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import TableRowsIcon from '@mui/icons-material/TableRows';
import './Table.css';

interface ColumnProps {
  title?: string;
  key: string;
  component?: any;
  type?: string;
  props?: any;
  html?: any;
  render?: any;
}

interface RowProps extends Object {
  id: number | string;
}

interface Props {
  columns: ColumnProps[];
  rows?: any[];
  comparativeRows?: RowProps[];
  placeholderCaption?: string;
  selectableRows?: boolean;
  onSelect?: Function;
  comparative?: boolean;
}

const Table: FC<Props> = (props) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const {
    columns,
    rows,
    comparativeRows,
    placeholderCaption,
    selectableRows,
    onSelect,
    comparative
  } = props;
  
  const isEmpty = !rows || !rows.length;
  
  const onSelectAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    if (checked && rows) {
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  const existsInSelectedRowList = (row: RowProps) => {
    return !!selectedRows.find(item => item.id ? item.id === row.id : item === row)
  };

  const onSelectRow = (rowIndex: number) => ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    if (rows) {
      let arrayClone = selectedRows.map(item => item);
      if (checked) {
        arrayClone.push(rows[rowIndex]);
        setSelectedRows(arrayClone);
      } else {
        arrayClone = arrayClone.filter((item: RowProps) => item.id ? item.id !== rows[rowIndex].id : item !== rows[rowIndex]);
        setSelectedRows(arrayClone);
      }
    }
  }

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedRows);
    }
  }, [selectedRows, onSelect]);

  return (
    <div className='Table' data-testid="Table">
      <TableContainer>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            {selectableRows && (
              <TableCell>
                <Checkbox onChange={onSelectAll} disabled={isEmpty} />
              </TableCell>
            )}
            {columns.map(column => (
              <TableCell>
                <Typography variant="subtitle2">
                  {column.title}
                </Typography>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {(rows || []).map((row: any, index: number) => (
              <TableRow>
                {selectableRows && (
                  <TableCell>
                    <Checkbox onChange={onSelectRow(index)} checked={existsInSelectedRowList(row)} />
                  </TableCell>
                )}
                {
                  columns.map(column => {
                    const originalRow: any = comparativeRows?.find(comparativeRow => row.id === comparativeRow.id);

                    return (
                      <TableCell
                        component="th"
                        scope="row"
                        className={comparative && row[column.key] !== originalRow[column.key] ? 'cell-updated' : ''}
                      >
                        {column.component && <column.component {...column.props} />}
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </TableCell>
                    )
                  })
                }
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {isEmpty && (
        <div className="placeholder">
          <div>
            <TableRowsIcon />
            <Typography variant="caption">
              {placeholderCaption}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
