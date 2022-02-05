import React from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import Table from '../../../components/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import SearchContext from '../../../context/SearchContext';

const Item = props => (
  <TableRow>
      <TableCell> { props.violationName } </TableCell>
      <TableCell> { props.firstOffense } </TableCell>
      <TableCell> { props.secondOffense } </TableCell>
      <TableCell> { props.thirdOffense } </TableCell>
  </TableRow>
);

const Violation = props => {
  const [violationList, setViolationList] = React.useState( [] );
  const [list, setList] = React.useState( [] );
  const [openForm, setOpenForm] = React.useState( false );
  const [editForm, setEditForm] = React.useState({ isOpen: false, item: null });
  const [violation, setViolation] = React.useState( null );
  const [deleteViol, setDeleteViol] = React.useState( null );

  const search = React.useContext( SearchContext );

  const { enqueueSnackbar } = useSnackbar();
  
  const initViolation = id => ({
    id,
    violationName: '',
    firstOffense: '',
    secondOffense: '',
    thirdOffense: ''
  });

  // const handleAddButton = () => { 
  //  setOpenForm( openForm => !openForm );
  // }  

  // const handleEditButton = () => { 
  //  setEditForm({ isOpen: false, item: null });
  // }

  React.useEffect(() => {
    let renderedItem = [];

    violationList.forEach( viol => {
      if( viol.violationName.searchContain( search ) ){
        renderedItem.push( viol );
      }
    });

    setList([...renderedItem]);
  }, [violationList, search]);

  const fetchViolationList = async() => {
    axios.get(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/violation-list`)
    .then( res => {
      if( res.data?.length ){
        setViolationList( res.data.map( (viol, index) => ({ 
          id: index,
          ...viol
        })));
      }
    })
    .catch( err => {
      setTimeout(() => fetchViolationList(), 5000);
    });
  }
  
  React.useEffect(() => {
    fetchViolationList();
  }, []);

  React.useEffect(() => {
    setViolation( initViolation( violationList.length ) );
  }, [violationList]);


  // React.useEffect(() => {
  //  if( deleteViol ){
  //    let modifiedViolations = violationList.filter( viol => viol.id !== deleteViol.id );

  //    if( modifiedViolations.length ){
  //    }

  //    setDeleteViol( null );
  //  }
  // }, [deleteViol]);

  return(
    <div style={{ width: '100%', height: '80vh' }} className="p-3 d-flex flex-column">
      <Table
        style={{ width: '100%' }}
        maxHeight={ 500 }
        head={['Violation Name', 'First Offense', 'Second Offense', 'Third Offense']}
        content={
          list.map( item => (
            <Item
              key={uniqid()}
              onClick={setEditForm}
              {...item}
            />
          ))
        }
      />
    </div>
  )
}





export default Violation;