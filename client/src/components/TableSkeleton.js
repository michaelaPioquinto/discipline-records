import React from 'react';
import uniqid from 'uniqid';

import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';


const TableSkeleton = props => (
  <>
    <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>} spacing={2} >
      { generateSkeleton(6, 70, 200) } 
    </Stack>
    <Divider/>
    <Stack>
      { generateSkeleton(7, 60) }
    </Stack>
  </>
);


const generateSkeleton = (num, height, width) => {
  const skeletons = new Array( num ).fill( null ).map( elem => (
      <Skeleton key={uniqid()} variant="text" width={width} height={height}/>
    ));

  return skeletons;
}


export default TableSkeleton;