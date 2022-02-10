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
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';

import SearchContext from '../../../context/SearchContext';


const Student = props => {
	const { handleUnarchive } = props;

	return(
		<TableRow>
			<TableCell> { props.studentID } </TableCell>
			<TableCell> { props.firstName } </TableCell>
			<TableCell> { props.lastname } </TableCell>
			<TableCell> { props.middleName } </TableCell>
			<TableCell> { props.course } </TableCell>
			<TableCell> 
				<Tooltip arrow placement="bottom" title="Activate">
					<IconButton onClick={() => handleUnarchive( props.studentID )}>
						<UnarchiveIcon/>
					</IconButton>
				</Tooltip>
			</TableCell>
		</TableRow>
	);
}


const Archived = props => {
	const [archivedStudents, setArchivedStudents] = React.useState([]);
	const [renderedStudents, setRenderedStudents] = React.useState([]);
	const [accounts, setAccounts] = React.useState([]);
	const [yearOptions, setYearOptions] = React.useState([]);
	const [yearSelected, setYearSelected] = React.useState( '' );
	
	const search = React.useContext( SearchContext );

	const getArchived = async() => {
		axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/archived-students`)
		.then( res => {
			setArchivedStudents([ ...res.data ]);
		})
		.catch( err => {
			throw err;
		});
	}

	const handleUnarchive = studentID => {
		axios.put(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/change-student-status`, { studentID })
		.then( res => {
			getArchived();
		})
		.catch( err => {
			throw err;
		});
	}

	const handleYearSelection = ( e, data ) => {
		setYearSelected( data );
	}

	React.useEffect(() => {
		let renderedItem = [];

		accounts.forEach( student => {
			if( student.studentID.searchContain( search ) ){
				renderedItem.push( <Student key={uniqid()} {...student} handleUnarchive={handleUnarchive}/> );
			}
		});

		setRenderedStudents([ ...renderedItem ]);
	}, [accounts, search]);
	
	React.useEffect(() => {
		const students = [];
		const years = []

		const getYear = student => {
			if( !years.includes( student?.dateArchived ) ){ 
				years.push( student.dateArchived ); 
			}
		};

		archivedStudents.forEach( getYear );

		setAccounts([ ...archivedStudents ]);
		setYearOptions([ ...years ]);
	}, [archivedStudents]);


	React.useEffect(() => {
		const students = []

		if( yearSelected && yearSelected?.length ){
			archivedStudents?.forEach?.( student => {
				if( student.dateArchived.includes( yearSelected ) )
					students.push( student );
			});
		}
		else{
			archivedStudents?.forEach?.( student => {
				students.push( student );
			});
		}

		setAccounts([ ...students ]);
	}, [yearSelected]);

	React.useEffect(() => console.log(renderedStudents), [renderedStudents]);

	React.useEffect(() => getArchived(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center align-items-start">
			<Paper sx={{ width: '95%', height: '80%', marginTop: '10px' }} elevation={5}>
				<Stack direction="column" justifyContent="center" alignItems="center">
					<div className="col-12">
						<Table
							maxHeight={330}
							style={{ width: '100%' }}
							head={['Student ID', 'First Name', 'Last Name', 'Middle Name', 'Course', 'Action']}
							content={[...renderedStudents]}
						/>
					</div>
				</Stack>
			</Paper>
		</div>
	);
}


export default Archived;