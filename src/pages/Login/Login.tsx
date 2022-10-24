import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { RequestStatus } from 'common/types'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes'
import { loginAsync, selectAuthState, selectUserState, useAppDispatch, useAppSelector } from '../../store'

export const Login = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error, status } = useAppSelector(selectAuthState)
  const { user } = useAppSelector(selectUserState)
  const { handleSubmit, control } = useForm<{ email: string; password: string }>()

  const onSubmit = useCallback(
    (data: { email: string; password: string }) => {
      dispatch(loginAsync({ email: data.email, password: data.password }))
    },
    [dispatch],
  )

  useEffect(() => {
    if (user) {
      navigate(paths.HOME, { replace: true })
    }
  }, [user, navigate])

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in please
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t('auth.email')}
                required
                fullWidth
                autoComplete="email"
                autoFocus
                margin="normal"
                error={!!error}
                helperText={error ? error.message : null}
                type="email"
              />
            )}
            rules={{
              required: { value: true, message: t('auth.emailIsRequired') },
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: t('auth.emailIsInvalid') },
            }}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t('auth.password')}
                margin="normal"
                required
                fullWidth
                autoComplete="current-password"
                error={!!error}
                helperText={error ? error.message : null}
                type="password"
              />
            )}
            rules={{
              required: { value: true, message: t('auth.passwordIsRequired') },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === RequestStatus.Loading}
          >
            {t('login.signIn')}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {t('login.forgotYourPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link href="register" variant="body2">
                {t('login.signUp')}
              </Link>
            </Grid>
          </Grid>
          {error && (
            <Alert sx={{ marginTop: 2 }} severity="error">
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  )
}
