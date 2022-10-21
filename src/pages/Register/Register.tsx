import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { RequestStatus } from 'common/types'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes'
import { registerAsync, selectUserState, useAppDispatch, useAppSelector } from '../../store'

export const Register = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { registerError, status, user } = useAppSelector(selectUserState)
  const { handleSubmit, control, watch } = useForm<{
    name: string
    email: string
    password: string
    verifyPassword: string
  }>()

  const onSubmit = useCallback(
    (data: { name: string; email: string; password: string; verifyPassword: string }) => {
      dispatch(
        registerAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          verifyPassword: data.verifyPassword,
        }),
      )
    },
    [dispatch],
  )

  useEffect(() => {
    if (user) {
      navigate(paths.HOME, { replace: true })
    }
  }, [user, navigate])

  let pwd = watch('password')

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
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t('auth.name')}
                required
                fullWidth
                autoComplete="name"
                autoFocus
                margin="normal"
                error={!!error}
                helperText={error ? error.message : null}
                type="text"
              />
            )}
            rules={{ required: { value: true, message: t('auth.nameIsRequired') } }}
          />
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
              pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g, message: t('auth.passwordIsInvalid') },
            }}
          />
          <Controller
            name="verifyPassword"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t('auth.verifyPassword')}
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
              required: { value: true, message: t('auth.passwordVerifyIsRequired') },
              validate: value => value === pwd || 'The passwords do not match',
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === RequestStatus.Loading}
          >
            {t('register.register')}
          </Button>
          {registerError && (
            <Alert sx={{ marginTop: 2 }} severity="error">
              {registerError}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  )
}
