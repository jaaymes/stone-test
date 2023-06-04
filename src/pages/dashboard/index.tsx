import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

import { Box, Typography } from '@mui/material'

const Dashboard: React.FC = () => {
  return (
    <Box width="100%" height="70%" alignItems="center" display="flex" justifyContent="center" flexDirection="column">
      <>
        <LazyLoadImage src="/logo.png" alt="logo" effect="blur" height={150} />
      </>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={700} color={'#22B24C'}>
          Gestor de Cartões Stone
        </Typography>
      </Box>
    </Box>
  )
}

export default Dashboard
