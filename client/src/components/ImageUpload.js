import React from 'react';

import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icon-material/AddIcon';

const ImageUpload = props => {
	// const 

	return(
		<div style={{ width: props?.width ?? '100%', height: props?.height ?? 'fit-content', ...props?.style }} className={ props?.className ?? '' }>
			<Stack>

				<IconButton>
					<AddIcon/>
				</IconButton>
			</Stack>
		</div>
	);
}