import Content from './Views/Content';
import Header from './Components/Header';
import { MantineProvider } from '@mantine/core';
import { TypographyStylesProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider>
      <TypographyStylesProvider>
        <Header />
        <Content />
      </TypographyStylesProvider>
    </MantineProvider>
  );
}

export default App;