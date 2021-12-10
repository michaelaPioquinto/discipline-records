import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import uniqid from 'uniqid';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';

import Table from '../../components/Table';
import TableSkeleton from '../../components/TableSkeleton';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

import SearchContext from '../../context/SearchContext';

import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));


const Item = props => {
  const [bgColor, setBgColor] = React.useState('white');
	const { enqueueSnackbar } = useSnackbar();

	const renderRole = role => {
		switch( role ){
			case 'admin':
				return 'administrator'.toUpperCase();

			case 'sysadmin':
				return 'system administrator'.toUpperCase();

			case 'adminstaff':
				return 'administrator staff'.toUpperCase();

			default:
				return 'NO ROLE'.toUpperCase();				
		}
	}

  return(
    <TableRow
      sx={{ backgroundColor: bgColor, transition: '.1s ease-in-out' }} 
      onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.2)')}
      onPointerLeave={() => setBgColor('white')}
    >
      <TableCell> { props.username } </TableCell>
      <TableCell> { renderRole(props.role) } </TableCell>
      <TableCell>
				<Tooltip title="Restore" arrow placement="bottom">
					<IconButton onClick={() => {
							axios.put(`http://localhost:3000/restore-trash/id/${ props._id }`)
							.then(() => {
								props.refresh();
								enqueueSnackbar('Successfully restored a trash', { variant: 'success' });		
							})
							.catch( err => {
								enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error' });
							});
						}}
					>
						<RestoreFromTrashIcon/>
					</IconButton>
				</Tooltip>

				<Tooltip title="Delete permanently" arrow placement="bottom">
					<IconButton onClick={() => {
							axios.put(`http://localhost:3000/delete-trash-permanently/id/${ props._id }`)
							.then(() => {
								props.refresh();
								enqueueSnackbar('Successfully removed a trash', { variant: 'success' });		
							})
							.catch( err => {
								enqueueSnackbar( err?.response?.data?.message ?? 'Please try again!', { variant: 'error' });
							});
						}}
					>
						<DeleteIcon/>
					</IconButton>
				</Tooltip>

      </TableCell>
    </TableRow>
  );
}


const Trash = props => {
	// Fetch user data
	const [accounts, setAccounts] = React.useState( [] );
  const [items, setItems] = React.useState( [] );

  const search = React.useContext( SearchContext );
  
	const fetchStudentData = async() => {
    axios.get(`http://localhost:3000/trash/role/${ props.role }`)
    .then( res => {
      if( res.data ){
        const modifiedData = res.data.map( datum => ({ id: datum._id, ...datum}));
        setAccounts( modifiedData );
      }
    })
    .catch( err => {
      throw err;
    });
  }

  React.useEffect(() => {
    let renderedItem = [];

    accounts.forEach( acc => {
      if( acc.username.searchContain( search ) ){
        renderedItem.push( 
          <Item
            key={uniqid()}
            {...acc}
            refresh={fetchStudentData}
          />
        );
      }
    });

    setItems([...renderedItem]);
  }, [accounts, search]);


	React.useEffect(() => {
    fetchStudentData();
	}, []);


	return(
		<div style={{ width: '100%', height: 'fit-content' }}>
      <div style={{ width: '100%', height: '100%' }} className="d-flex flex-column justify-content-center align-items-start p-1">
        <Table
          style={{ width: '100%' }}
          maxHeight={ 500 }
          head={['Username', 'Role', 'Action']}
          content={ items }
        />
      </div>
		</div>
	);
}


export default Trash;