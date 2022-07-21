import UnitSquare from '@/components/squares/UnitSquare';

type Props = {
  booleanMatrix: boolean[][];
};

export default function UnitPatternEditor({ booleanMatrix }: Props) {
  return (
    <div style={{ display: 'flex', flexFlow: 'row' }}>
      {booleanMatrix.map((booleanRow, x) => (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {booleanRow.map((boolean, y) => (
            <div
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <UnitSquare
                coordinateX={x}
                coordinateY={y}
                alive={boolean}
                hovered={false}
                hasTopBorder
                hasRightBorder={x === booleanMatrix.length - 1}
                hasBottomBorder={y === booleanRow.length - 1}
                hasLeftBorder
                onClick={() => {}}
                onHover={() => {}}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
