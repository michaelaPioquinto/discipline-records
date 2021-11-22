import React from 'react';
import uniqid from 'uniqid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const CustomTable = props => {
	const [head, setHead] = React.useState([]);
	const [content, setContent] = React.useState([]);

	React.useEffect(() => {
		if( props.head ){
			// Create cell for head
			const heads = [];

			props.head.forEach( item => {
				heads.push(
					<TableCell key={uniqid()}>
						<b>{ item }</b>
					</TableCell>
				)
			});

			setHead([ ...heads ]);
		}

		if( props.content ){
			setContent([ ...props.content ]);
		}

	}, [props.head, props.content]);

	return(
		<div 
			id={ props?.id ?? 'table-' + uniqid() } 
			className={ props.className ?? 'table' }
			style={ props?.style ?? { width: 'fit-content', height: 'fit-content' }} 
		>
			<TableContainer sx={{ maxHeight: props?.maxHeight ?? 300 }} component={Paper}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{ head }
						</TableRow>
					</TableHead>
					<TableBody>
						{ content }
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}


export default CustomTable;