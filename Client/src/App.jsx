import { useState } from "react";
import "./App.css";
import Form from "./Form/Form";
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Nav />
      <Form />
      {/* <Login/> */}

      <Footer />
    </div>
  );
}

export default App;
