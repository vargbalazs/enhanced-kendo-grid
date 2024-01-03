import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// calculates the aggregated values
export function calculateAggregates(config: EnhancedGridConfig) {
  // sum
  config.aggregates.sum = config.selectedCellDatas.reduce(
    (acc, data) => (isFinite(+data.value) ? acc + +data.value : acc),
    0
  );

  // avg
  let countOfNumberValues = 0;
  config.selectedCellDatas.map((cellData) => {
    if (isFinite(+cellData.value)) countOfNumberValues++;
  });
  config.aggregates.avg =
    countOfNumberValues > 0 ? config.aggregates.sum / countOfNumberValues : 0;

  // count
  config.aggregates.count = config.selectedCellDatas.length;

  // min
  let filtered = config.selectedCellDatas.filter((data) =>
    isFinite(+data.value)
  );
  config.aggregates.min =
    filtered.length == 0
      ? 0
      : +filtered.reduce((prev, curr) =>
          +prev.value < +curr.value ? prev : curr
        ).value;

  // max
  config.aggregates.max =
    filtered.length == 0
      ? 0
      : +filtered.reduce((prev, curr) =>
          +prev.value > +curr.value ? prev : curr
        ).value;
}
