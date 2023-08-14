import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState("");
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:5000/home", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data));
  }, []);

  return (
    <>
      <h1>{data}</h1>
    </>
  );
};

export default Home;
