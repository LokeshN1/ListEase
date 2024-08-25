// for about us page using styled-components library
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #61dafb, #adb3bc);
    color: #050606;
  }
  
  a {
    color: #61dafb;
    text-decoration: none;
    transition: color 0.3s, text-shadow 0.3s;
  }

  a:hover {
    color: #050606;
    text-shadow: 0 0 5px #61dafb;
  }
`;
