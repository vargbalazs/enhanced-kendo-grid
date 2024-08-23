import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// calculates the aggregated values
export function calculateAggregates(config: EnhancedGridConfig) {
  // sum
  config.aggregates.sum = config.selectedCellDatas.reduce(
    (acc, data) => (isFinite(+data.value) ? acc + +data.value : acc),
    0
  );
  let hiddenSum = config.hiddenSelectedCellDatas.reduce(
    (acc, data) => (isFinite(+data.value) ? acc + +data.value : acc),
    0
  );
  config.aggregates.sum -= hiddenSum;

  // avg
  let countOfNumberValues = 0;
  config.selectedCellDatas.map((cellData) => {
    if (isFinite(+cellData.value) && cellData.value != '')
      countOfNumberValues++;
  });
  let hiddenCountOfNumberValues = 0;
  config.hiddenSelectedCellDatas.map((cellData) => {
    if (isFinite(+cellData.value) && cellData.value != '')
      hiddenCountOfNumberValues++;
  });
  countOfNumberValues -= hiddenCountOfNumberValues;
  config.aggregates.avg =
    countOfNumberValues > 0 ? config.aggregates.sum / countOfNumberValues : 0;

  // count
  config.aggregates.count = config.selectedCellDatas.filter(
    (cellData) => cellData.value != ''
  ).length;
  let hiddenCount = config.hiddenSelectedCellDatas.filter(
    (cellData) => cellData.value != ''
  ).length;
  config.aggregates.count -= hiddenCount;

  // min - max
  let filtered = config.selectedCellDatas.filter(
    (data) => isFinite(+data.value) && data.value != ''
  );
  let hiddenFiltered = config.hiddenSelectedCellDatas.filter(
    (data) => isFinite(+data.value) && data.value != ''
  );
  let visibleFiltered = config.visibleSelectedCellDatas.filter(
    (data) => isFinite(+data.value) && data.value != ''
  );
  // if we have hidden values, then eliminate the elements with the same value (calculate the difference of the 2 sets)
  if (hiddenFiltered.length > 0) {
    filtered.forEach((cellData) => (cellData.value = +cellData.value));
    const filterSet = new Set(filtered.flatMap((cellData) => cellData.value));
    hiddenFiltered.forEach((cellData) => (cellData.value = +cellData.value));
    const hiddenFilteredSet = new Set(
      hiddenFiltered.flatMap((cellData) => cellData.value)
    );
    visibleFiltered.forEach((cellData) => (cellData.value = +cellData.value));
    const difference = differenceSets(filterSet, hiddenFilteredSet);
    // const intersect = intersectionSets(filterSet, hiddenFilteredSet);
    const diffArray = [...difference];
    // calculate the min/max of the visible and hidden values and of the diff array
    // if the min/max of the visible/hidden values are the same, then take the visible, otherwise the min/max of the diff array
    // this is needed, because with the difference calculation we eliminate potentially min/max values from the 'filterSet'
    // if this values are also present in the 'hiddenFilteredSet'
    // min
    let visibleMin =
      visibleFiltered.length == 0
        ? 0
        : +visibleFiltered.reduce((prev, curr) =>
            +prev.value < +curr.value ? prev : curr
          ).value;
    let hiddenMin =
      hiddenFiltered.length == 0
        ? 0
        : +hiddenFiltered.reduce((prev, curr) =>
            +prev.value < +curr.value ? prev : curr
          ).value;
    let diffMin =
      diffArray.length == 0
        ? 0
        : +diffArray.reduce((prev, curr) => (+prev < +curr ? prev : curr));
    config.aggregates.min = visibleMin === hiddenMin ? visibleMin : diffMin;
    // max
    let visibleMax =
      visibleFiltered.length == 0
        ? 0
        : +visibleFiltered.reduce((prev, curr) =>
            +prev.value > +curr.value ? prev : curr
          ).value;
    let hiddenMax =
      hiddenFiltered.length == 0
        ? 0
        : +hiddenFiltered.reduce((prev, curr) =>
            +prev.value > +curr.value ? prev : curr
          ).value;
    let diffMax =
      diffArray.length == 0
        ? 0
        : +diffArray.reduce((prev, curr) => (+prev > +curr ? prev : curr));
    config.aggregates.max = visibleMax === hiddenMax ? visibleMax : diffMax;
  } else {
    // min
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
  config.hiddenSelectedCellDatas = [];
  config.visibleSelectedCellDatas = [];
}

function differenceSets<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  let difference = new Set(setA);
  for (let elem of setB) {
    difference.delete(elem);
  }
  return difference;
}
