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
    // h1
    // h2
    // h3
    // h4
    // h5
    // h6
    // subtitle1
    // subtitle2
    // body1
    // body2
    // button
    // caption
    // overline

    fontSize: 11,

    // Title
    h1: {
      fontSize: 20,
      fontFamily: "Arial"
    },
    // View title
    h6: {
      fontSize: 17,
      fontWeight: 100,
      fontStyle: "regular"
    },
    // Subtitle
    subtitle1: {
      fontSize: 13
    },
    // axis % legend
    subtitle2: {
      fontSize: 11
    }
  },
  fontFamily: [
    "Roboto",
    '"Helvetica Neue"',
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(",")
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
