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
import TableV2 from '../../../components/Table-v2';

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

		// <Student key={uniqid()} {...student} handleUnarchive={handleUnarchive}/>
		accounts.forEach( student => {
			if( student.studentID.searchContain( search ) ){
				renderedItem.push( student );
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
		<>
			<TableV2
				items={renderedStudents}
				handleUnarchive={handleUnarchive}
				setSearch={props?.getSearchContent}
		      	searchPlaceHolder="Student ID"
				generateRows={( index, style, props ) => {
					return(
						<div 
				            id={uniqid()} 
				            style={{ ...style }} 
				            className="table-v2-row col-12 d-flex"
						> 
				            <div 
				              style={{
				                borderRight: '1px solid rgba(0, 0, 0, 0.1)'
				              }} 
				              className={`col-3 d-flex align-items-center justify-content-center text-center"`}
				            >
				              { props?.items?.[ index ]?.studentID }
				            </div>
				            <div 
				            	style={{
					                borderRight: '1px solid rgba(0, 0, 0, 0.1)'
					              }} 
				            	className={`col-3 d-flex align-items-center justify-content-center text-capitalize text-center"`}
				            >
				              { `${props.items[ index ].lastname}, ${props.items[ index ].firstName} ${props.items[ index ].middleName}` }
				            </div>
				            <div className={`col-3 d-flex align-items-center justify-content-center text-center"`}>
				              { `${props.items[ index ].course}` }
				            </div>
				            <div 
				              style={{
				                borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
				              }} 
				              className={`col-3 text-capitalize d-flex align-items-center justify-content-center text-center"`}
				            >
								<Tooltip arrow placement="bottom" title="Activate">
									<IconButton onClick={() => props.handleUnarchive( props.items[ index ].studentID )}>
										<UnarchiveIcon/>
									</IconButton>
								</Tooltip>
				            </div>
			          </div>
			         )
				}}

				generateHeader={props => (
					<>
			            <div className={`col-3 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Student ID</b>
			            </div>
			            <div className={`col-3 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Full name</b>
			            </div>
			            <div className={`col-3 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Course</b>
			            </div>
			            <div className={`col-3 d-flex align-items-center justify-content-center text-center"`}>
			              <b>Status</b>
			            </div>
			          </>
				)}
			/>
		</>
		// <div style={{ width: '100%', height: '100%' }} className="d-flex justify-content-center align-items-start">
		// 	<Paper sx={{ width: '95%', height: '80%', marginTop: '10px' }} elevation={5}>
		// 		<Stack direction="column" justifyContent="center" alignItems="center">
		// 			<div className="col-12">
		// 				<Table
		// 					maxHeight={330}
		// 					style={{ width: '100%' }}
		// 					head={['Student ID', 'First Name', 'Last Name', 'Middle Name', 'Course', 'Action']}
		// 					content={[...renderedStudents]}
		// 				/>
		// 			</div>
		// 		</Stack>
		// 	</Paper>
		// </div>
	);
}


export default Archived;