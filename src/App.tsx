import Content from './Views/Content';
import { MantineProvider } from '@mantine/core';
import { TypographyStylesProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider>
      <TypographyStylesProvider>

        <Content />
      </TypographyStylesProvider>
    </MantineProvider>
  );
}

export default App;