import { useState } from "react";
import "./App.css";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import Register from "./components/register/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  const [user, setLoginUser] = useState({});
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {user && user._id ? (
              <Homepage setLoginUser={setLoginUser} />
            ) : (
              <Login setLoginUser={setLoginUser} />
            )}
          </Route>
          <Route exact path="/login">
            <Login setLoginUser={setLoginUser} />
          </Route>
          <Route exact path="/register">
            <Register></Register>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
