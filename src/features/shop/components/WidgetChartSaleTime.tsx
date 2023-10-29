import ReactApexChart from 'react-apexcharts';

const WidgetChartSaleTime = ({
  series,
  option,
}: {
  series: { name: string; data: number[] }[];
  option: ApexChart;
}) => {
  return (
    <ReactApexChart series={series} option={option} type="area" height={350} />
  );
};

export default WidgetChartSaleTime;
