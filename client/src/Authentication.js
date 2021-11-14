import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Route, Switch, Redirect } from 'react-router-dom';

import LinearProgress from '@mui/material/LinearProgress';
import { SnackbarProvider } from 'notistack';

import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = React.lazy(() => import('./view/Admin'));
const Student = React.lazy(() => import('./view/Student'));
const AdministrativeStaff = React.lazy(() => import('./view/Administrative-Staff'));
const SystemAdmin = React.lazy(() => import('./view/System-Admin'));

const ROOT = '/';
const VIEWS = [
	ROOT + 'sign-in',
	ROOT + 'admin',
	ROOT + 'student',
	ROOT + 'system-admi',
	ROOT + 'administrative-staff'
];


const Authentication = props => {
	const path = new Path( window.location.pathname );

	const [allow, setAllow] = React.useState( null );
	const [view, setView] = React.useState( null );

	const setToThisView = ( viewPath ) => {
	    setView(() => <Redirect to={viewPath} />);
	    runAuth();
	}

	const runAuth = () => {
	    const token = Cookies.get('token');
	    const rtoken = Cookies.get('rtoken');

	    // axios.get('http://localhost:3000/verify-me', {
	    //   headers: {
	    //     'authentication': `Bearer ${ token }`
	    //   }
	    // })
	    // .then( res => {
	    //   setName( res.data.user.name );
	    //   setAllow(() => true);
	    // })
	    // .catch( err => {
	    //   axios.post('http://localhost:3500/auth/refresh-token', { rtoken })
	    //   .then( res => {
	    //     Cookies.set('token', res.data.accessToken);
	    //     runAuth();
	    //   })
	    //   .catch( err => setAllow(() => false));
	    // }); 

	    // setAllow(() => true);

	    setAllow(() => true);
	}


	React.useEffect(() => {
	    setAllow(() => null);
	    runAuth();
	}, []);


	React.useEffect(() => {
	    if( allow ){
	      switch( path.pathname ){
	        case '/admin':
	          setToThisView( path.pathname );
	          break;

	        case '/student':
	          setToThisView( path.pathname );
	          break;

	        case '/administrative-staff':
	          setToThisView( path.pathname );
	          break;

			case '/system-admin':
	          setToThisView( path.pathname );
	          break;

	        default:
	          setToThisView( '/admin' );
	          break;
	      }     
	      // return setAllow(() => null);
	    }
	    else if( allow === false ){
	      switch( path.pathname ){
	        case '/sign-in':
	          setToThisView( path.pathname );
	          break;

	        default:
	          setToThisView( '/sign-in' );
	          break;
	      }
	      // return setAllow(() => null);
	    }
	}, [allow]);

	return(
		<SnackbarProvider maxSnack={3}>
	      <div className="App">
	        <React.Suspense fallback={<Loading/>}>      
	          <Switch>
	            {
	              allow 
	                ? (
	                    <>
	                      <Route exact path="/admin">
	                        {/*<Appbar tools={tools}/>*/}
	                        <Admin />
	                      </Route>

	                      <Route exact path="/administrative-staff">
	                        {/*<Appbar tools={tools}/>*/}
	                        <AdministrativeStaff />
	                      </Route>

	                      <Route exact path="/system-admin">
	                        {/*<Appbar tools={tools}/>*/}
	                        <SystemAdmin />
	                      </Route>

	                      <Route exact path="/student">
	                        {/*<Appbar tools={tools}/>*/}
	                        <Student />
	                      </Route>
	                    </>
	                  )
	                : null
	            }

	            {
	              allow === false 
	                ? (
	                    <>
	                      <Route path="/sign-in">
	                        <SignIn />
	                      </Route>
	                    </>
	                  )
	                : null
	            }
	          </Switch>
	          { view }
	        </React.Suspense>
	      </div>
	    </SnackbarProvider>
	);
}

const SignIn = props => {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [signin, setSignin] = React.useState( false );

	const handleUsername = e => {
		// setUsername( )
		setUsername( e.target.value );
	}

	const handlePassword = e => {
		// setUsername( )
		setPassword( e.target.value );
	}

	const handleSignin = async () => {
		setSignin( true );
	}

	React.useEffect(() => {
		if( signin ){
			axios.post('http://localhost:3000/signin', { username, password })
			.then( res => {
				console.log( res.data.message );
			})
			.catch( err => {
				console.log( err );
			})
		}
	}, [signin, username, password]);

	return(
		<div className="auth-wrapper">
			<div className="auth-content">
				<div className="card">
					<div className="row align-items-center text-center">
						<div className="col-md-12">
							<div className="card-body">
								<h4 className="mb-3 f-w-400">Signin</h4>
								<div className="form-group mb-3">
									<label className="floating-label" htmlFor="Email">Email address</label>
									<input onChange={handleUsername} type="text" className="form-control" id="Email" placeholder=""/>
								</div>
								<div className="form-group mb-4">
									<label className="floating-label" htmlFor="Password">Password</label>
									<input onChange={handlePassword} type="password" className="form-control" id="Password" placeholder=""/>
								</div>
								
								<button onClick={handleSignin} className="btn btn-block btn-primary mb-4">Signin</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const PageNotFound = () => (
	<div className="d-flex justify-content-center align-items-center">
		<h1> PAGE NOT FOUND </h1>
	</div>
);

const Loading = () => {
	return (
		<div style={{ width: '100%' }}>
			<LinearProgress color="success"/>
		</div>
	);
}

function Path( pathname ){
  if( !pathname ) 
    console.warn('[Line 45 - Admin]: No given pathname');

  this.pathname = pathname;

  // this.home = () => {
  //   this.pathname = VIEWS[ 4 ];

  //   return this.pathname;
  // }

  this.exit = () => {
    this.pathname = VIEWS[ 0 ];

    return this.pathname;
  }

  this.kick = () => {
    this.pathname = VIEWS[ 0 ];

    return this.pathname;
  }
  
  this.exist = () => {
    return VIEWS.includes( this.pathname );
  };

  this.isRoot = () => {
    return this.pathname === ROOT;  
  }

  this.notFound = () => <PageNotFound />;

  // this.isSignUpPath = () => {
  //   return ( VIEWS.indexOf( this.pathname ) === 1
  //     ? true
  //     : false
  //   );
  // };

  this.isSignInPath = () => {
    return ( VIEWS.indexOf( this.pathname ) === 0
      ? true
      : false
    );
  };
} 

// <Route exact path="/admin">
// 		      <Admin/>
//     		</Route>

//     		<Route exact path="/student">
// 		      <Student/>
//     		</Route>

//     		<Route exact path="/system-admin">
// 		      <SystemAdmin/>
//     		</Route>

//     		<Route exact path="/administrative-staff">
// 		      <AdministrativeStaff/>
//     		</Route>

export default Authentication;