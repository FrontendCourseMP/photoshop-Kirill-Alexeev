import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EditorPage } from '@/pages/editor/EditorPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#484848',
    },
    background: {
      default: '#565656',
      paper: '#292929',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EditorPage />
    </ThemeProvider>
  );
}

export default App;