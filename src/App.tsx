import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
