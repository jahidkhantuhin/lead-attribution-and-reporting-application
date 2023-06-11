import {
    generateDataFromColumnsAndData,
    generateHeadersFromColumns,
  } from './helpers'
export const StatisticsReportColumns = () => {
    return [
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '25px',
          },
        },
        text: 'Month Year',
        value: `month_year`,
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
          },
        },
        text: 'Total calls',
        value: 'total_calls',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '20px',
          },
        },
        text: 'Avg total calls',
        value: 'avg_total_calls',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
          },
        },
        text: 'Total forms',
        value: 'total_forms',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '20px',
          },
        },
        text: 'Avg total forms',
        value: 'avg_total_forms',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
          },
        },
        text: 'Total chats',
        value: 'total_chats',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '20px',
          },
        },
        text: 'Avg total chats',
        value: 'avg_total_chats',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
            bgColor: '#13f29a', 
          },
        },
        text: 'Total booked',
        value: 'total_booked',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '20px',
            bgColor: '#f44336',
          },
        },
        text: 'Total not booked',
        value: 'total_not_booked',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
            bgColor: '#f4ba0b',
          },
        },
        text: 'Total missed',
        value: 'total_missed',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '15px',
            bgColor: '#2986cc',
          },
        },
        text: 'Total irrelevant',
        value: 'total_irrelevant',
      },
      {
        // width: '500px',
        upload: {
          value: (value: any) => value,
          styles: {
            width: '20px',
          },
        },
        text: 'Total not scored',
        value: 'total_not_scored',
      },
    ]
  }
  
  const generateStatisticsReport = function (uploadData: any, params: any) {
    const { scorer, filters, user } = params
    return {
      type: 'statistics-report',
      name: `statistics Report`,
      sheets: [
        {
          title: 'statistics Report',
          headings: generateHeadersFromColumns(StatisticsReportColumns()),
          content: generateDataFromColumnsAndData({
            columns: StatisticsReportColumns(),
            data: uploadData.value,
            rowStyle: (item: any) => {
              return {
                fontSize: '10px',
                color: '',
                width: '30px',
                textAlign: 'left',
                bgColor: '',
                fontWeight: 'bold',
              }
            },
          }),
        },
      ],
    }
  }
  
  export default generateStatisticsReport
  