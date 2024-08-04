import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import './table.scss'
import { Usage } from '../types/usage'
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   getSortedRowModel,
   SortDirection,
   Updater,
   useReactTable,
} from '@tanstack/react-table'
import { formatDatetimeStr } from '../utils/datetime'
import { SortingState } from '@tanstack/table-core/src/features/RowSorting'
import { getUrlNoParams } from '../utils/url'

interface Props {
   data: Usage[]
   setShareLink: Dispatch<SetStateAction<string>>
}

const columns: ColumnDef<Usage>[] = [
   {
      id: 'message_id',
      header: 'Message ID',
      accessorFn: (row) => row.message_id,
      // sorting should only apply to Report Name and Credits Used
      enableSorting: false,
   },
   {
      id: 'timestamp',
      header: 'Timestamp',
      accessorFn: (row) => row.timestamp,
      cell: ({ cell }) =>
         formatDatetimeStr(cell.getValue<Usage['timestamp']>()),
      // sorting should only apply to Report Name and Credits Used
      enableSorting: false,
   },
   {
      id: 'report_name',
      header: 'Report Name',
      accessorFn: (row) => row.report_name,
      sortDescFirst: false,
   },
   {
      id: 'credits_used',
      header: 'Credits Used',
      accessorFn: (row) => row.credits_used,
      cell: ({ cell }) => cell.getValue<Usage['credits_used']>().toFixed(2),
      sortDescFirst: false,
   },
]

const Table = ({ data, setShareLink }: Props) => {
   const [sorting, setSorting] = useState<SortingState>(() => {
      const search = window.location.search
      const params = new URLSearchParams(search)
      const defaultSorting: SortingState = []
      // get default sorting state from URL params
      // IMPORTANT - the order of the params matter as multi sorting is enabled
      // for example 'report_name=desc&credits_used=asc' means first sort
      // by Report Name 'desc' then by Credits Used 'asc'
      for (const [key, value] of params.entries()) {
         if (
            columns.find((col) => col.id === key) &&
            // important to check for both 'asc' and 'desc' because 'desc = true' means 'desc' order
            // 'desc = false' means 'asc' order and 'undefined' means no sorting
            ['asc', 'desc'].includes(value)
         ) {
            defaultSorting.push({
               id: key,
               desc: value === 'desc',
            })
         }
      }
      return defaultSorting
   })

   const onSortingChange = (updater: Updater<SortingState>) => {
      const newSortingValue =
         updater instanceof Function ? updater(sorting) : updater
      // when the sorting changes, update the share link with the new sorting
      // URL params (in the same order which they were)
      setShareLink(() => {
         let shareLink = getUrlNoParams(window.location)
         // for every sorting value create query param
         const params = newSortingValue.map(
            (sortingVal) =>
               `${sortingVal.id}=${sortingVal.desc ? 'desc' : 'asc'}`,
         )
         // construct the share link
         return `${shareLink}${params.length ? '?' : ''}${params.join('&')}`
      })
      setSorting(updater)
   }

   const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      // this ensures that normal click triggers multi-sorting
      isMultiSortEvent: () => true,
      onSortingChange,
      state: {
         sorting,
      },
   })

   const renderSortIndicator = (sort: false | SortDirection): ReactNode => {
      if (sort === 'asc') return <span>↑</span>
      if (sort === 'desc') return <span>↓</span>
      return <span>⇅</span>
   }

   return (
      <table className="usage-table">
         <thead>
            {table.getHeaderGroups().map((headerGroup) => (
               <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                     <th key={header.id}>
                        {header.isPlaceholder ? null : (
                           <div
                              className={`header-cell${
                                 header.column.getCanSort()
                                    ? ' cursor-pointer'
                                    : ''
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                           >
                              <>
                                 {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                 )}
                                 {
                                    // it's important to check if sorting is not disabled for the column.
                                    // this ensures that indicators are not rendered even if a disabled filter
                                    // was specified in the query params
                                    header.column.getCanSort() &&
                                       renderSortIndicator(
                                          header.column.getIsSorted(),
                                       )
                                 }
                              </>
                           </div>
                        )}
                     </th>
                  ))}
               </tr>
            ))}
         </thead>
         <tbody>
            {table.getRowModel().rows.map((row) => (
               <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                     <td key={cell.id}>
                        {flexRender(
                           cell.column.columnDef.cell,
                           cell.getContext(),
                        )}
                     </td>
                  ))}
               </tr>
            ))}
         </tbody>
      </table>
   )
}

export default Table
