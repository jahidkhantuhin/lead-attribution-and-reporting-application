import { get } from 'lodash'

export interface generateDataFromColumnsAndDataProps {
  rowStyle?: Function
  columns: Array<{
    [key: string]: any
    upload: {
      value: Function
      styles: {
        [key: string]: any
      }
    }
  }>
  data: Array<{
    [key: string]: any
  }>
}

export const generateDataFromColumnsAndData = (
  props: generateDataFromColumnsAndDataProps
) => {
  return props.data.map((item: any) => {
    return {
      rowStyle: props.rowStyle ? props.rowStyle(item) : {},
      data: props.columns
        .filter((column: any) => get(column, 'displayInExcel', true))
        .map((column) => {
          let value = column.upload.value
            ? column.upload.value(get(item, column.value, null), item, column)
            : item[column.value]

          return {
            value: value || '',
            styles: !!column.upload.styles ? column.upload.styles : {},
          }
        }),
    }
  })
}

export const generateHeadersFromColumns = (
  columns: generateDataFromColumnsAndDataProps['columns'] = []
) => {
  return {
    rowStyle: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#f6f6f6',
      bgColor: '#727272',
      width: '30px',
      textAlign: 'left',
    },
    data: columns
      .filter((column: any) => get(column, 'displayInExcel', true))
      .map((column) => {
        return {
          value: column.text,
          styles: column.upload.styles || {},
        }
      }),
  }
}
