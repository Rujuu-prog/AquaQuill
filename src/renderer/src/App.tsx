import { createTheme, MantineProvider } from '@mantine/core'
import Memo from './components/pages/Memo'

function App(): JSX.Element {
  const theme = createTheme({
    // Define your theme here
  })

  return (
    <>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Memo />
      </MantineProvider>
    </>
  )
}

export default App
