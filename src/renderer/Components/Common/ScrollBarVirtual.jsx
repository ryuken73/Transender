/* eslint-disable react/prop-types */
import React from 'react';
import MemoItem from 'renderer/Components/Common/MemoItem';
import ScrollBarSmooth from 'renderer/Components/Common/ScrollBarSmooth';
import { useVirtual } from 'react-virtual';
import useMediaQueryEasy from 'renderer/hooks/useMediaQueryEasy';

function ScrollBarVirtual(props) {
  const {
    items,
    fetchNextPage,
    rowHeight = 60,
    heightMinus = '220px',
    ItemElement,
    itemProps,
  } = props;
  const [scrollRefTime, setScrollRefTime] = React.useState(Date.now());
  const parentRef = React.useRef();
  const rowVirtualizer = useVirtual({
    size: items.length,
    overscan: 10,
    parentRef,
    estimateSize: React.useCallback(() => rowHeight, [rowHeight]),
  });
  const { fullViewHeightMediaQuery } = useMediaQueryEasy();

  return (
    // <ScrollBarSmooth
    //   getMoreItem={fetchNextPage}
    //   height={`calc(${fullViewHeightMediaQuery} - ${heightMinus})`}
    //   ref={parentRef}
    //   refreshRefByTime={setScrollRefTime}
    // >
    <div
      ref={parentRef}
      className="List"
      style={{
        height: `100%`,
        width: `100%`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <MemoItem
              item={item}
              items={items}
              index={virtualRow.index}
              key={virtualRow.index}
              size={virtualRow.size}
              start={virtualRow.start}
              ItemElement={ItemElement}
              // scrollToIndex={scrollToIndex}
              // scrollToX={scrollToX}
              {...itemProps}
            />
          )
        })}
      </div>
    </div>
  );
}

export default React.memo(ScrollBarVirtual);
