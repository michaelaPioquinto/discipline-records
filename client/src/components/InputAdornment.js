import React from 'react';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function CustomInputAdornment( props ){
	const [showPassword, setShowPassword] = React.useState( false );
	const [time, setTime] = React.useState( 'AM' );

	const CurrentInput = props?.variant === 'outlined'
		? OutlinedInput
		: props?.variant === 'filled'
			? FilledInput
			: Input;

	React.useEffect(() => props?.getTime?.( time ), [time]);

	return(
		<FormControl sx={{ m: 1, width: props?.width ?? '100%' }} variant="outlined">
          <InputLabel required={props?.required} htmlFor="input-adornment">{props.label}</InputLabel>
          <CurrentInput
            id="input-adornment"
            placeholder={props?.placeholder}
            type={props?.type === 'password' ? showPassword ? 'text' : 'password' : props.type}
            value={props?.value}
            onChange={props?.onChange}
            endAdornment={
              props?.for === 'password'
              	? <InputAdornment position="end">
	                <IconButton
	                  aria-label="toggle password visibility"
	                  onClick={() => setShowPassword( !showPassword )}
	                  onMouseDown={() => setShowPassword( !showPassword )}
	                  edge="end"
	                >
	                  {showPassword ? <VisibilityOff /> : <Visibility />}
	                </IconButton>
	              </InputAdornment>
	            : props?.for === 'time'
	            	? (
	        			<>
		        			<InputAdornment 
		        				position={props?.adornmentPosition ?? 'end'}
		        			>	
			        			<ButtonGroup variant="standard">
			        				<Button size="small" onClick={() => setTime?.('AM')} sx={{ color: time === 'AM' ? "red" : "unset" }} >			        			
				        				AM
			        				</Button>
			        				<Button size="small" onClick={() => setTime?.('PM')} sx={{ color: time === 'PM' ? "red" : "unset" }} >
			        					PM
			        				</Button>
			        			</ButtonGroup>

		        			</InputAdornment>
	        			</>
	            		)
	            	: <InputAdornment position={props?.adornmentPosition ?? 'end'}>{ props?.adornment }</InputAdornment>
            }
            label="Password"
          />
        </FormControl>
	);
}