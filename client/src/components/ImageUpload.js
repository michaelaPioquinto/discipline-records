import React from 'react';
import uniqid from 'uniqid';
import debounce from 'lodash.debounce';

import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';

const ImageUpload = props => {
	const { imageLimit } = props;

	const [imageChips, setImageChips] = React.useState( [] );
	const [images, setImages] = React.useState( [] );

	const handleUpload = e => {
		e.stopPropagation();

		const fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');

		if( props.imageLimit === Infinity ){
			fileInput.setAttribute('multiple', '');
		}

		fileInput.addEventListener('input', e => {
			if( e?.target?.files ){
				const fileNameList = Object.values( e?.target?.files )?.map?.( file => file.name );
				const filteredFiles = [];

				fileNameList.forEach(( name, index ) => {
					if( !imageChips.includes( name ) ){
						filteredFiles.push( e.target.files[ index ] );
					}
				});

				setImages( images => [ ...images, ...filteredFiles ] );
			}
		});

		fileInput.click();
	}

	const handleDelete = index => {
		let newImages = images;
		newImages.splice(index, 1);

		setImages([ ...newImages ]);
	}

	React.useEffect(() => {
		if( images.length ){
			// console.log( image );

			// const formData = new FormData();
			// formData.append('reportImage', image);

			// console.log( formData.values().next() );

			const newImages = [];
			images.forEach( img => {
				newImages.push( img?.name );
			});

			setImageChips([ ...newImages ]);
		}
		else{
			setImageChips( [] );
		}
		
		if( props.reset ){
			setImageChips( [] );
			setImages( [] );
		}

		props?.getImages?.( images.length ? images : null );

	}, [images]);

	return(
		<div 
			style={{ 
				width: props?.width ?? '500px',
				overflowX: 'hidden', 
				height: props?.height ?? 'fit-content', 
				backgroundColor: 'rgba( 0, 0, 0, 0.1 )',
				borderRadius: '25px',
				position: 'relative',
				...props?.style 
			}} 
			className={ props?.className ?? 'row p-1 d-flex justify-content-around' }
		>	
			<div
				style={{
					width: '100%',
					height: 'fit-content',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					color: !images.length ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
					pointerEvents: 'none'
				}}
				className="text-center"
			>
				<p className="p-0 m-0">
					{ props?.label ?? 'Add an Image' }
				</p>
			</div>
			<div style={{ width: '90%' }} className="no-scrollbar col-10 p-0 m-0 d-flex align-items-center">
				<Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
					{
						[...imageChips.map( (name, index) => (
							<Chip 
								key={uniqid()} 
								sx={{ borderColor: 'rgba(0, 0, 0, 0.4)' }}
								label={name} 
								variant="outlined" 
								onDelete={() => debounce( handleDelete, 50 )( index )}
							/>
						))]	
					}
				</Stack>
			</div>
			<div className="col-1 p-0 m-0 d-flex justify-content-end align-items-center">
				{
					imageChips.length !== imageLimit
						? (
							<IconButton onClick={handleUpload}>
								<AddIcon/>
							</IconButton>
						)
						: (
							<IconButton disabled>
								<DoNotTouchIcon />
							</IconButton>
							)
				}
			</div>
		</div>
	);
}

export default ImageUpload;