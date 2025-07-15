import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DegenListScreen from "./src/screens/degen-list.screen";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DegenListScreen />
    </QueryClientProvider>
  );
}
