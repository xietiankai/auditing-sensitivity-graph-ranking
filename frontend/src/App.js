import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { themeColor } from "./styles";
import Main from "./components/Main";
import { Provider } from "react-redux";
import store from "./store";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: themeColor.primaryColor
    },
    secondary: {
      main: themeColor.secondaryColor
    }
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Main />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
