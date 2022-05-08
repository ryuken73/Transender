import React from 'react';

function useCheckConcept(value) {
  // check value not initialized at every useCheckConcept() call
  const [name, setName] = React.useState(value);
  const changeName = React.useCallback((name) => {
    setName(name);
  }, []);
  return { name, changeName }
}

export default useCheckConcept;
