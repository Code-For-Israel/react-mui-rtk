import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { logout, useAppDispatch } from '../../store'

export const Home = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box>Home 🏠</Box>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={logOut}>{t('auth.logout')}</Button>
      </Grid>
    </Grid>
  )
}
