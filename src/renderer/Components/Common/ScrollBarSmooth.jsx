import React from 'react';
import styled from 'styled-components';
import Scrollbar from 'react-smooth-scrollbar';

const StyledScrollbar = styled(Scrollbar)`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  .scroll-content {
    margin-right: 10px;
  };
  .scrollbar-track-y {
    .scrollbar-thumb-y {
      border-radius: 0px;
    }
  }
`;

const ScrollBarSmooth = (props, ref) => {
  const { height = '100%', width = '100%' } = props;
  const { getMoreItem = () => {}, refreshRefByTime = () => {} } = props;
  const scrollbar = React.useRef(null);
  const [parentRef, setParentRef] = React.useState(ref);
  React.useEffect(() => {
    // console.log('^^^ in scroll effect!')
    if (scrollbar === null) return;
    if (parentRef) {
      console.log('^^^^', parentRef, scrollbar);
      if (parentRef.current !== scrollbar.current.scrollbar.contentEl) {
        console.log(' set ^^^^', parentRef, scrollbar);
        setParentRef((ref) => {
          ref.current = scrollbar.current.scrollbar.contentEl;
          refreshRefByTime(Date.now());
        });
      }
    }
  }, [parentRef, refreshRefByTime]);
  const handleScroll = React.useCallback((scroll) => {
    // console.log(scroll.offset.y, scroll.limit.y)
    const haveReachedBottom = scroll.offset.y === scroll.limit.y;
    if (haveReachedBottom) {
      getMoreItem();
    }
  }, []);
  return (
    <StyledScrollbar
      height={height}
      width={width}
      alwaysShowTracks={false}
      onScroll={handleScroll}
      ref={scrollbar}
    >
      {props.children}
    </StyledScrollbar>
  );
};

export default React.memo(React.forwardRef(ScrollBarSmooth));
