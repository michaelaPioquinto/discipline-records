import React from 'react';
import uniqid from 'uniqid';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const ChipList = props => {
	const [word, setWord] = React.useState('');
	const [wordList, setWordList] = React.useState([]);

	const textField = React.useRef( null );

	const handleWord = e => {
		setWord( e.target.value );
	}

	const handleAddWord = e => {
		if( !word.length ) return;

		setWordList( wordList => [...wordList, word]);
		setWord('');
	}

	const handleDelete = index => {
		let newWordList = wordList;
		newWordList.splice(index, 1);

		setWordList([ ...newWordList ]);
	}

	const handleInsertWord = e => {
		if( e.key === 'Enter' && e.target.value.length ){
			setWordList( wordList => [...wordList, e.target.value]);
			setWord('');
		}
	}

	React.useEffect(() => {
		props?.getValues?.( wordList.length ? wordList : null );
	}, [wordList]);

	React.useEffect(() => {
		if( props.value ){
			setWordList([ ...props.value ]);
		}
	}, [props]);

	React.useEffect(() => {
		if( textField.current ){
			textField.current.addEventListener('keydown', e => handleInsertWord( e ));
		}

		return () => {
			if( textField.current ){
				return textField.current.removeEventListener('keydown', e => handleInsertWord( e ));
			}
		}
	}, [textField]);

	return(
		<div
			style={{
				width: props.width ?? '100%',
				height: props.height ?? 'fit-content'
			}}
			className="rounded d-flex flex-column justify-content-center align-items-center"
		>
			<div 
				style={{ 
					width: '100%', 
					height: '100px', 
					maxHeight: 'fit-content',
					backgroundColor: 'rgba(0, 0, 0, 0.2)'
				}}
				className="p-1"
			>
				<Grid container spacing={1} columns={{ xs: 12 }}>
					{
						[...wordList.map( (name, index) => (
							<Grid item xs="auto" key={uniqid()}>
								<Chip
									sx={{ borderColor: 'rgba(0, 0, 0, 0.4)' }}
									label={name} 
									variant="outlined" 
									onDelete={() => handleDelete( index )}
								/>
							</Grid>
						))]	
					}
				</Grid>
			</div>
			<div className="row container-fluid p-0 d-flex justify-content-between">
				<div className="col-10 p-0 m-0">
					<TextField 
						ref={textField}
						sx={{
							width: '100%',
							padding: '0px'
						}}
						value={word} 
						onChange={handleWord} 
						label={props.label ?? 'Add word'} 
						variant="filled"
					/>
				</div>
				<div 
					className="p-0 m-0 col-2 d-flex justify-content-center align-items-center"
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.05)',
						borderBottom: '1px solid rgba(0, 0, 0, 0.5)'
					}}
				>
					<IconButton onClick={handleAddWord}>
						<AddIcon/>
					</IconButton>
				</div>
			</div>
		</div>
	);
}


export default ChipList;