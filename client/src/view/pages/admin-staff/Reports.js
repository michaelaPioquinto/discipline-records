import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import Table from '../../../components/Table';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import { useSnackbar } from 'notistack';
import SearchContext from '../../../context/SearchContext';
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const Report = props => {
	const { handleArchive, handleUnarchive } = props;
	const [behaviors, setBehaviors] = React.useState( [] );

	React.useEffect(() => {
		if( props.majorProblemBehavior.length || props.minorProblemBehavior.length ){
			const problemBehavior = [ ...props.minorProblemBehavior ];
			problemBehavior.push( ...props.majorProblemBehavior );

			setBehaviors([ ...problemBehavior ]);
		}
	}, [props]);

	// React.useEffect(() => {
	// 	console.log( behaviors );
	// }, [behaviors]);

	return(
		<Fade in={true} timeout={500 * props?.index} mountOnEnter unmountOnExit>
			<TableRow>
				<TableCell> { props.studentID } </TableCell>
				<TableCell> { props.studentName } </TableCell>
				<TableCell> { props.incidentDescription } </TableCell>
				<TableCell> { props.reportedBy } </TableCell>
				<TableCell> { props.dateOfReport } </TableCell>
				<TableCell> { behaviors?.join?.(', ') } </TableCell>
				{
					props.status === 'activated'
						? <TableCell> 
							<Tooltip title="Archive" arrow>
								<span>
									<IconButton onClick={() => handleArchive( props )}>
										<ArchiveIcon/>
									</IconButton>
								</span>
							</Tooltip>
						</TableCell>
						: <Tooltip title="Unarchive" arrow>
							<span> 
								<TableCell> 
									<IconButton onClick={() => handleUnarchive( props )}>
										<UnarchiveIcon/>
									</IconButton>
								</TableCell>
							</span>
						</Tooltip>
				}
			</TableRow>
		</Fade>
	);
}


const Archived = props => {
	const [reports, setReports] = React.useState([]);
	const [renderedReports, setRenderedReports] = React.useState([]);
	const [items, setItems] = React.useState([]);
	const [currentView, setCurrentView] = React.useState( 'activated' );
	const [page, setPage] = React.useState( 1 );

	// const [yearOptions, setYearOptions] = React.useState([]);
	// const [yearSelected, setYearSelected] = React.useState( '' );
	
	const search = React.useContext( SearchContext );
	const { enqueueSnackbar } = useSnackbar();

	const getReports = async() => {
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/report`)
		.then( res => {
			setReports([ ...res.data ]);
		})
		.catch( err => {
			throw err;
		});
	}

	const handleArchive = async ({ _id }) => {
	    axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/archive-report/${ _id }`)
	    .then(() => {
	      getReports();
	    })
	    .catch( err => {
	      enqueueSnackbar( 'Please try again later', { variant: 'error' });       
	    });
  	}

  	const handleUnarchive = async ({ _id }) => {
	    axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/unarchive-report/${ _id }`)
	    .then(() => {
	      getReports();
	    })
	    .catch( err => {
	      enqueueSnackbar( 'Please try again later', { variant: 'error' });       
	    });
  	}

	// const handleYearSelection = ( e, data ) => {
	// 	setYearSelected( data );
	// }

	React.useEffect(() => {
		let filtered = [];
		let chunkSet = [];
		const chunksLimit = 5;

		const addToFilteredItems = (item, index) => 
			filtered.push( 
				<Report key={uniqid()} index={index} {...item} handleArchive={handleArchive} handleUnarchive={handleUnarchive}/> 
			);

		reports?.forEach?.(( item, index ) => {
			if( item?.studentID?.searchContain?.( search ) && item?.status === currentView ){
				addToFilteredItems( item, index );
			}
		});

		if( reports.length ){
			let index = 0;
			do{
				const chunk = filtered.slice(index, index + chunksLimit);

				chunkSet.push( chunk );	

				index += chunksLimit;
			}
			while( chunkSet.length < Math.floor( filtered.length / chunksLimit ) + (filtered % chunksLimit === 0 ? 0 : 1 ));
		}

		setRenderedReports([ ...chunkSet ]);
	}, [reports, search, currentView]);	


	React.useEffect(() => {
		if( renderedReports.length ){
			if( page === renderedReports.length && !renderedReports[ renderedReports.length - 1 ].length ){
				if( page - 1 > 0 ){
					setPage( page => page - 1 );
				}
			}
			else if( page > renderedReports.length ){
				setPage( page => page - 1 );	
			}
		}
	}, [renderedReports, page, currentView]);

	React.useEffect(() => getReports(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center align-items-start">
			<Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} elevation={5}>
				<div style={{ height: '90%' }}>
					<Table
						maxHeight="100%"
						style={{ width: '100%' }}
						head={[
							'Student ID', 
							'Student Name', 
							'Incident Description', 
							'Reported By', 
							'Date Of Report', 
							'Problem Behavior', 
							'Action'
						]}
						content={renderedReports[ page - 1 ]}
					/>
				</div>
				<div style={{ width: '100%' }} className="row flex-grow-1 py-2 px-1 d-flex flex-row justify-content-center align-items-center">
					<div className="col-8">
						<Pagination count={ !renderedReports?.[ renderedReports?.length - 1 ]?.length ? renderedReports?.length - 1 : renderedReports?.length } page={ page } onChange={(_, value) => setPage( value )}/>
					</div>
					<div className="col-4">
						<Button onClick={() => setCurrentView( currentView => currentView === 'activated' ? 'deactivated' : 'activated' )}>{ currentView === 'activated' ? 'Non-archived' : 'Archived' }</Button>
					</div>
				</div>
			</Paper>
		</div>
	);
}


export default Archived;