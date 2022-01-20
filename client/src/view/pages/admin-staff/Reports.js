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

import IconButton from '@mui/material/IconButton';
import ArchiveIcon from '@mui/icons-material/Archive';

import SearchContext from '../../../context/SearchContext';


const Student = props => {
	const { handleArchive } = props;

	return(
		<TableRow>
			<TableCell> { props.studentID } </TableCell>
			<TableCell> { props.firstName } </TableCell>
			<TableCell> { props.lastname } </TableCell>
			<TableCell> { props.middleName } </TableCell>
			<TableCell> { props.course } </TableCell>
			<TableCell> 
				<IconButton onClick={() => handleArchive( props.studentID )}>
					<ArchiveIcon/>
				</IconButton>
			</TableCell>
		</TableRow>
	);
}


const Archived = props => {
	const [reports, setReports] = React.useState([]);
	const [renderedReports, setRenderedReports] = React.useState([]);
	const [items, setItems] = React.useState([]);
	// const [yearOptions, setYearOptions] = React.useState([]);
	// const [yearSelected, setYearSelected] = React.useState( '' );
	
	const search = React.useContext( SearchContext );

	const getReports = async() => {
		axios.get('http://localhost:3000/reports')
		.then( res => {
			setReports([ ...res.data ]);
		})
		.catch( err => {
			throw err;
		});
	}

	const handleArchive = reportId => {
		axios.put(`http://localhost:3000/archive-report`, { reportId })
		.then( res => {
			getReports();
		})
		.catch( err => {
			throw err;
		});
	}

	// const handleYearSelection = ( e, data ) => {
	// 	setYearSelected( data );
	// }

	React.useEffect(() => {
		let renderedItem = [];

		items.forEach( item => {
			if( report.incidentDescription.searchContain( search ) ){
				renderedItem.push( <Item key={uniqid()} {...item}/> );
			}
		});

		setRenderedReports([ ...renderedItem ]);
	}, [accounts, search]);
	
	// React.useEffect(() => {
	// 	const students = [];
	// 	const years = []

	// 	const getYear = student => {
	// 		if( !years.includes(student.archived.year) ){ 
	// 			years.push( student.archived.year ); 
	// 		}
	// 	};


	// 	archivedStudents.forEach( getYear );

	// 	setAccounts([ ...archivedStudents ]);
	// 	setYearOptions([ ...years ]);
	// }, [archivedStudents]);


	// React.useEffect(() => {
	// 	const students = []

	// 	if( yearSelected && yearSelected?.length ){
	// 		archivedStudents?.forEach?.( student => {
	// 			if( student.archived.year.includes( yearSelected ) )
	// 				students.push( student );
	// 		});
	// 	}
	// 	else{
	// 		archivedStudents?.forEach?.( student => {
	// 			students.push( student );
	// 		});
	// 	}

	// 	setAccounts([ ...students ]);
	// }, [yearSelected]);

	// React.useEffect(() => console.log(renderedStudents), [renderedStudents]);

	React.useEffect(() => getArchived(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center align-items-start">
			<Paper sx={{ width: '95%', height: '80%', marginTop: '10px' }} elevation={5}>
				<Stack direction="column" justifyContent="center" alignItems="center">
					<div className="col-11">
						<Table
							maxHeight={330}
							style={{ width: '100%' }}
							head={['Incident No.', 'Reported By', 'Reported Student','Incident Description', 'Date of incident', 'Archive']}
							content={[...renderedStudents]}
						/>
					</div>
				</Stack>
			</Paper>
		</div>
	);
}


export default Archived;