import React from 'react'
import { useParams } from 'react-router-dom';

const SendItem = props => {
  const params = useParams();
  const {sendId} = params;
  return (
    <div>send to {sendId}</div>
  )
}

export default React.memo(SendItem);
