import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';


import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'firstName', headerName: 'First name', width: 200 },
  { field: 'lastName', headerName: 'Last name', width: 200 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${
        params.getValue(params.id, 'lastName') || ''
      }`,
  },
  { field: 'course', headerName: 'Course', width: 200 },
  { field: 'yrsection', headerName: 'Year & Section', width: 200 }
];


const Dashboard = props => {
	// Fetch user data
	const [row, setRow] = React.useState([]);


	React.useEffect(() => {
		const fetchStudentData = async() => {
      axios.get('http://localhost:3000/student-data')
      .then( res => {
        setRow( res.data );
      })
      .catch( err => {
        console.log( err );
      });
    }

    fetchStudentData();
	}, []);

	return(
		<div style={{ width: '100%', height: '90vh' }}>
      <div style={{ width: '100%', height: '500px' }} className="d-flex justify-content-center align-items-center">
  			{
          row.length
            ? (<DataGrid
                rows={row}
                columns={columns}
                pageSize={6}
                rowsPerPageOptions={[5]}
              />)
            : (
              <div style={{ width: '90%', height: '100%', backgroundColor: 'rgba(25, 25, 25, 0.1)' }} className="p-5 rounded">
                <Stack spacing={0}>
                  <Skeleton variant="text" height={70}/>
                  <Divider/>
                  <Skeleton variant="text" height={60}/>
                  <Skeleton variant="text" height={60}/>
                  <Skeleton variant="text" height={60}/>
                  <Skeleton variant="text" height={60}/>
                  <Skeleton variant="text" height={60}/>
                </Stack>
              </div>
            )
        }
      </div>
		</div>
	);
}

export default Dashboard;