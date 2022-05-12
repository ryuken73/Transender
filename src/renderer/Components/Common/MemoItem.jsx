/* eslint-disable react/prop-types */
import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const MemoItem = (props) => {
  const {
    size,
    start,
    item,
    items,
    index,
    ItemElement,
    scrollToIndex,
    ...itemProps
  } = props;
  console.log(`^^^ ${item.jobId}::${index}::`,itemProps);
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${size}px`,
        transform: `translateY(${start}px)`,
        transition: 'all 5s',
      }}
    >
      <Box key={item.jobId} px="10px">
        <ItemElement
          rownum={index}
          fontSize="14px"
          color="white"
          item={item}
          job={item}
          items={items}
          width="100%"
          {...itemProps}
        />
        <Divider opacity="0.2" margin="0px" mr="15px" />
      </Box>
    </div>
  );
};

export default React.memo(MemoItem);
