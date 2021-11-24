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
				<IconButton onClick={() => handleUnarchive( props.studentID )}>
					<UnarchiveIcon/>
				</IconButton>
			</TableCell>
		</TableRow>
	);
}


const Archived = props => {
	const [archivedStudents, setArchivedStudents] = React.useState([]);
	const [renderedStudents, setRenderedStudents] = React.useState([]);
	const [yearOptions, setYearOptions] = React.useState([]);
	const [yearSelected, setYearSelected] = React.useState( '' );
	
	const getArchived = async() => {
		axios.get('http://localhost:3000/archived-students')
		.then( res => {
			setArchivedStudents([ ...res.data ]);
		})
		.catch( err => {
			throw err;
		});
	}

	const handleUnarchive = studentID => {
		axios.put(`http://localhost:3000/unarchive-student`, { studentID })
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
		if( archivedStudents.length ){
			const students = [];
			const years = []

			const getYear = student => {
				if( !years.includes(student.archived.year) ){ 
					console.log( student.archived.year );
					years.push( student.archived.year ); 
				}
			};


			archivedStudents.forEach( getYear );
			archivedStudents.forEach( student => {
				students.push(<Student key={uniqid()} {...student} handleUnarchive={handleUnarchive}/>);
			});

			setRenderedStudents([ ...students ]);
			setYearOptions([ ...years ]);
		}
	}, [archivedStudents]);

	React.useEffect(() => {
		const students = []

		if( yearSelected && yearSelected?.length ){
			archivedStudents?.forEach?.( student => {
				if( student.archived.year.includes( yearSelected ) )
					students.push(<Student key={uniqid()} {...student} handleUnarchive={handleUnarchive}/>);
			});
		}
		else{
			archivedStudents?.forEach?.( student => {
				students.push(<Student key={uniqid()} {...student} handleUnarchive={handleUnarchive}/>);
			});

		}

		setRenderedStudents([ ...students ]);
	}, [yearSelected]);

	React.useEffect(() => getArchived(), []);

	return(
		<div style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center align-items-start">
			<Paper sx={{ width: '95%', height: '80%', marginTop: '10px' }} elevation={5}>
				<Stack direction="column" justifyContent="center" alignItems="center">
					<div className="col-11 my-5">
						<Autocomplete
							options={yearOptions}
							onChange={handleYearSelection}
							onInputChange={handleYearSelection}
							renderInput={ params => <TextField { ...params} label="Year" variant="filled"/> }
						/>
					</div>
					<div className="col-11">
						<Table
							maxHeight={330}
							style={{ width: '100%' }}
							head={['Student ID', 'First Name', 'Last Name', 'Middle Name', 'Course', 'Unarchive']}
							content={renderedStudents}
						/>
					</div>
				</Stack>
			</Paper>
		</div>
	);
}


export default Archived;