import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';
import Webcam from "react-webcam";
import debounce from 'lodash.debounce';


import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Chip from '@mui/material/Chip';
import SendIcon from '@mui/icons-material/Send';

const DutyReport = props => {
	const [images, setImages] = React.useState( [] );
	const [imageChips, setImageChips] = React.useState( [] );
	const [reports, setReports] = React.useState( [] );
	const allowedFileExtension = ['jpeg', 'jpg', 'png'];

	const getDutyReports = async () => {
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/duty-report/id/${props?.name}`)
		.then( res => {
			setReports( res.data );
		})
		.catch( err => {
			throw err;
		});
	}

	const handleSendReport = async () => {
      if( images.length ){
      	axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/duty-report`, {
      		studentID: props?.name,
      		date: new Date().toDateString(),
      		filePath: `/images/duty-reports/${images[0]?.name}`
      	})
      	.then( async () => {
	        const formData = new FormData();

	        images.forEach( img => {
	          formData.append('reportImage[]', img );
	        });

	        try{
	          await axios.post(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/save-duty-report-image`, formData)
	          setImages( [] );
	          getDutyReports();
	        }
	        catch( err ){
	          throw err;
	        }       
      	})
      	.catch( err => {
      		throw err;
      	})
      }
	}

	const handleDelete = index => {
		let newImages = images;
		newImages.splice(index, 1);

		setImages([ ...newImages ]);
	}

	const handleUpload = e => {
		e.stopPropagation();

		const fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');

		// if( props.imageLimit === Infinity ){
		// 	fileInput.setAttribute('multiple', '');
		// }

		fileInput.addEventListener('input', e => {
			if( e?.target?.files ){
				const files = Object.values( e.target.files )?.filter?.( file => {
					const fileExtension = file.name.split('.')[ 1 ]?.toLowerCase();

					return allowedFileExtension.includes( fileExtension );
				});


				if( files?.length ){
					const fileNameList = files?.map?.( file => file.name );
					const filteredFiles = [];

					fileNameList.forEach(( name, index ) => {
						if( !imageChips.includes( name ) ){
							filteredFiles.push( files[ index ] );
						}
					});

					setImages( images => [ ...images, ...filteredFiles ] );
				}
			}
		});

		fileInput.click();
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

	React.useEffect(() => getDutyReports(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="d-flex flex-column">
			<div className="flex-grow-1 overflow-auto">
				{/*REPORTS*/}
				{
					reports.map( report => (
						<Report
							key={uniqid()}
							src={report.filePath}
							date={report.date}
						/>
					))	
				}
			</div>
			<div className="p-2 border-top d-flex align-items-center">
				<div style={{ width: 'fit-content' }}>
					<IconButton onClick={handleUpload}>
						<CameraAltIcon/>
					</IconButton>
				</div>
				<div style={{ borderRadius: '50px' }} className="flex-grow-1 p-1 shadow border d-flex">
					<div className="flex-grow-1 px-2 overflow-auto d-flex justify-content-start align-items-center">
						{/*report pictures*/}
						{
							!!imageChips?.length
								? imageChips.map(( name, index ) => (
										<Chip 
											key={uniqid()} 
											sx={{ borderColor: 'rgba(0, 0, 0, 0.4)' }}
											label={name} 
											variant="filled" 
											onDelete={() => debounce( handleDelete, 50 )( index )}
										/>
									))
								: <p style={{ color: 'rgba(0, 0, 0, 0.4)' }} className="m-0">Upload images...</p>
						}
					</div>
					<IconButton onClick={handleSendReport} disabled={!!!images.length}>
						<SendIcon/>
					</IconButton>
				</div>
			</div>
		</div>
	);
}


const Report = props => {
	return(
		<div style={{ width: '100%', height: 'fit-content' }} className="d-flex justify-content-center">
			<div className="report shadow rounded overflow-hidden my-2">
				<img src={props?.src} alt={props?.alt ?? ''}/>
				<Divider variant="middle"/>
				<div className="px-3 py-2">
					<p>Date of Report: <b>{ props?.date ?? new Date().toDateString() }</b></p>
				</div>
			</div>
		</div>
	);
}


export default DutyReport;