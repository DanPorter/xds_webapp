import ndarray from 'ndarray';
import {
  GlyphType,
  NDT,
  LineParams,
  LineData,
  LinePlotProps,
  LinePlot,
} from '@diamondlightsource/davidia';


export function ExampleData() {
  const x = ndarray(new Float32Array([1, 2, 3, 4, 5])) as NDT;
  const y = ndarray(new Float32Array([10, 20, 30, 40, 50])) as NDT;
  const lineProps = {
    plotConfig: {
      xLabel: 'x label',
      yLabel: 'y label',
    },
    lineData: [
      {
        key: 'squares',
        lineParams: {
          colour: 'purple',
          pointSize: 6,
          lineOn: true,
          glyphType: GlyphType.Square,
        } as LineParams,
        x,
        xDomain: [1, 10],
        y,
        yDomain: [1, 100],
        defaultIndices: false,
      } as LineData,
    ],
    xDomain: [0, 11],
    yDomain: [0, 101],
  } as LinePlotProps;
  return lineProps
}

// interface lineData {
//   x: number[] | NDT;
//   y: number[] | NDT;
// }
  

export function DvDPlots( lineProps: LinePlotProps ) {
  console.log('lineProps:', lineProps)
  // lineProps.lineData.forEach((line: lineData) => {
  //   line.x = 'data' in line.x ? line.x as NDT : ndarray(new Float32Array(line.x as number[])) as NDT;
  //   line.y = 'data' in line.y ? line.y as NDT : ndarray(new Float32Array(line.y as number[])) as NDT;
  // })
  return (
    <>
      <LinePlot {...lineProps} updateSelection={null} />
    </>
  );
};
