import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EditorPage } from '@/pages/editor/EditorPage';
import { ToastProvider } from '@shared/ui/ToastContext';

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
      <ToastProvider>
        <EditorPage />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;