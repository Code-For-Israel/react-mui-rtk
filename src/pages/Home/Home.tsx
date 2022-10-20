import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { logout, useAppDispatch } from '../../store'

export const Home = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const logOut = useCallback(
    () => {
      dispatch(logout())
    },
    [dispatch],
  )

  return (
  <div>
	<div>Home 🏠</div>
	<Grid container>
		<Grid item>
			<Button onClick={logOut}>
				{t('auth.logout')}
			</Button>
		</Grid>
	</Grid>
  </div>)
}
