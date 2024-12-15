import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    InputAdornment,
    Link,
    useMediaQuery,
    useTheme
  } from '@mui/material';
  import { 
      AlternateEmail as EmailIcon,
      Lock as LockIcon, 
      Person,
      Visibility,
      VisibilityOff
  } from '@mui/icons-material';
  import { Formik, Form, Field } from 'formik';
  import * as Yup from 'yup';

  import FullLogo from '../../components/FullLogo';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import fetchAPI from '../../utils/fetchAPI';
import AdminContext from '../../context/AdminContext';
  

  
  // Validation schema
  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('User Name is required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  const AdminLogin = () => {
    const { isAuthenticated, token, setToken, setIsAuthenticated, setTokenExpired } = useContext(AdminContext);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const Navigate = useNavigate();

    console.log('isAuthenticated:', isAuthenticated);
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
      setShowPassword(!showPassword);
    }
    useEffect(() => {
      if (isAuthenticated) {
        Navigate('/admin/'); 
      }
    }, [isAuthenticated, Navigate]);

  if (isAuthenticated) return null;

    const handleSubmit = (values, { setSubmitting }) => {
      // fetch /api/auth/login
      console.log(import.meta.env.VITE_BACKEND_URL);

      fetchAPI('/auth/admin/login', 'POST', values).then(data => {
        if(data && data.token) {
          localStorage.setItem('admin_token', data.token);
          setToken(data.token);
          setIsAuthenticated(true);
          setTokenExpired(false);
        }
        else {
          alert('Invalid email or password');
        }
        setSubmitting(false);
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred. Please try again later.');
        setSubmitting(false);
      })

    };
  
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
          backgroundColor: 'background.default'
        }}
      >
        
        <Container 
          component="main" 
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            mt: 5,
            transform: 'translateY(-50px)'
          }}
        >
            <FullLogo />
          <Paper 
            elevation={isMobile ? 0 : 6}
            sx={{ 
              padding: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '100%',
              maxWidth: 400,
              border: isMobile ? '1px solid rgba(0,0,0,0.12)' : 'none'
            }}
          >
            <Typography 
              component="h1" 
              variant="h5" 
              sx={{ mb: 3, textAlign: 'center' }}
            >
              Admin Panel
            </Typography>
            
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                 <Form style={{ width: '100%' }}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="username"
                    label="User Name"
                    placeholder="User Name"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {showPassword ? (
                              <Visibility onClick={togglePassword} sx={{cursor:"pointer"}} />
                            ) : (
                              <VisibilityOff onClick={togglePassword} sx={{cursor:"pointer"}} />
                            )}
                          </InputAdornment>
                        )
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1, backgroundColor: 'var(--secondary-accent)' }}
                    disabled={isSubmitting}
                    
                  >
                    Sign In
                  </Button>

                  <Box
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'left', 
                      mt: 2 
                    }}
                  >
                    <Link href="#" variant="body2" disabled={isSubmitting}>
                      Forgot password?
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    );
  };
  
  export default AdminLogin;