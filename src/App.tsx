import './App.css';
import './assets/styles/Fonts.css';
import './assets/styles/Texts.css';
import './assets/styles/Utils.css';
import './assets/styles/Input.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { ThemeOptions } from "@mui/material/styles/createTheme";
import Navigation from 'navigation';
import { ProjectDataProvider } from 'context/ProjectDataContext';
import { AuthProvider } from 'context/AuthContext';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#00c080',
      contrastText: '#fff8f8',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
};

export const theme = createTheme(themeOptions);

function App() {
  return (
    <AuthProvider>
      <ProjectDataProvider>
        <ThemeProvider theme={theme}>
          <div className="App" data-testid="App">
            <div>
              <Navigation />
            </div>
          </div>
        </ThemeProvider>
      </ProjectDataProvider>
    </AuthProvider>
  );
}

export default App;
