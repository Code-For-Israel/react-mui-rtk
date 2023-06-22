import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { logout, useAppDispatch } from '../../store'

export const Home = () => {
  const [dogUrl, setDogUrl] = useState()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchDog = async () => {
      const response = await fetch('https://dog.ceo/api/breeds/image/random')
      if (response.ok) {
        const jsonResponse = await response.json()
        setDogUrl(jsonResponse.message)
      }
    }
    fetchDog()
  }, [])

  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box>Home 🏠</Box>
      </Grid>
      <Grid item xs={12}>
        {dogUrl ? <img src={dogUrl} alt="A cute dog" height="500" /> : ''}
      </Grid>
      <Grid item xs={12}>
        <Button onClick={logOut}>{t('auth.logout')}</Button>
      </Grid>
    </Grid>
  )
}
