import useMediaQuery from '@mui/material/useMediaQuery';
import CONSTANTS from 'renderer/config/constants';

const {
  WIDTH_TO_HIDE_SIDE_PANEL,
  WIDTH_TO_SHOW_SHORT_UPDATE_TEXT,
  WIDTH_TO_SHOW_1COL_ARCHIVE,
  WIDTH_TO_SHOW_2COL_ARCHIVE,
  WIDTH_TO_SHOW_2COL_PODCAST,
  WIDTH_TO_SHOW_3COL_PODCAST,
  HEIGHT_OF_FLAT_PLAYER
} = CONSTANTS;

function useMediaQueryEasy() {
  const hideLeftPane = useMediaQuery(`(max-width:${WIDTH_TO_HIDE_SIDE_PANEL})`);
  const hideRightPane = useMediaQuery(`(max-width:${WIDTH_TO_HIDE_SIDE_PANEL})`);
  const showShortArchiveList = useMediaQuery(`(max-width:${WIDTH_TO_SHOW_SHORT_UPDATE_TEXT})`);
  const show1ColArchiveList = useMediaQuery(`(max-width:${WIDTH_TO_SHOW_1COL_ARCHIVE})`);
  const show2ColArchiveList = useMediaQuery(`(max-width:${WIDTH_TO_SHOW_2COL_ARCHIVE}) and (min-width:${WIDTH_TO_SHOW_1COL_ARCHIVE})`);
  const show2ColPodcastList = useMediaQuery(`(max-width:${WIDTH_TO_SHOW_2COL_PODCAST})`);
  const show3ColPodcastList = useMediaQuery(`(max-width:${WIDTH_TO_SHOW_3COL_PODCAST}) and (min-width:${WIDTH_TO_SHOW_2COL_PODCAST})`);
  const fullViewHeightMediaQuery = hideLeftPane ? `100vh - ${HEIGHT_OF_FLAT_PLAYER} - 20px` : '100vh';
  const bottomByMediaQuery = hideLeftPane ? '120px' : '20px';

  return {
    hideLeftPane,
    hideRightPane,
    showShortArchiveList,
    show1ColArchiveList,
    show2ColArchiveList,
    show2ColPodcastList,
    show3ColPodcastList,
    fullViewHeightMediaQuery,
    bottomByMediaQuery
  }
}

export default useMediaQueryEasy;
