import MainLayout from "../layouts/MainLayout";
import { Cron } from "react-js-cron";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getRemoteConfig,
  fetchAndActivate,
  getString,
} from "firebase/remote-config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-js-cron/dist/styles.css";

function SetSchedule() {
  const [value, setValue] = useState("");

  const [host, setHost] = useState(null);

  const [pattern, setPattern] = useState(null);

  // get host from remoteconfig
  useEffect(() => {
    if (typeof window !== "undefined") {
      const firebaseConfig = {
        apiKey: "AIzaSyBGcpc4Oevz0AeHmFS5Qs1uz9idOKRMzMA",
        authDomain: "proyek-ahir.firebaseapp.com",
        projectId: "proyek-ahir",
        storageBucket: "proyek-ahir.appspot.com",
        messagingSenderId: "899628439462",
        appId: "1:899628439462:web:fec1f77881b8d51e20a167",
        measurementId: "G-4SL75D3RVR",
      };

      const app = initializeApp(firebaseConfig);
      const remoteConfig = getRemoteConfig(app);

      fetchAndActivate(remoteConfig)
        .then(() => {
          setHost(
            `${getString(remoteConfig, "ipaddress")}:${getString(
              remoteConfig,
              "port"
            )}`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // fetch
  const getPattern = () => {
    axios.get(`http://${host}/cron/pattern`).then((res) => {
      setPattern(res?.data?.data?.format);
      setValue(res?.data?.data?.format);
    });
  };

  // handle
  const handleSetPattern = (val) => {
    axios
      .post(`http://${host}/cron/pattern/set`, { pattern: val })
      .then((res) => {
        // set pattern
        setPattern(val);

        // alert
        toast.success(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        toast.error(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleStartService = (val) => {
    axios
      .post(`http://${host}/cron/start`)
      .then((res) => {
        // alert
        toast.info(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        toast.info(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleStopService = (val) => {
    axios
      .post(`http://${host}/cron/stop`)
      .then((res) => {
        // alert
        toast.info(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        toast.info(res?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    if (host) {
      getPattern();
    }
  }, [host]);

  return (
    <div>
      <ToastContainer />
      <Cron value={value} setValue={setValue} clearButton={false} />
      <button
        onClick={() => handleSetPattern(value)}
        disabled={!value}
        className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded hover:bg-blue-400 hover:border-blue-500 disabled:bg-gray-400 disabled:border-gray-500"
      >
        Set Schedule
      </button>

      <hr className="my-4" />
      {!pattern ? (
        <div className="text-sm">
          <span>Status</span>
          <div className="text-red-500 text-danger">*Pattern not Setted</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <button
              onClick={() => handleStartService()}
              disabled={!value}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded hover:bg-blue-400 hover:border-blue-500 disabled:bg-gray-400 disabled:border-gray-500"
            >
              Start Service
            </button>
          </div>
          <div>
            <button
              onClick={() => handleStopService()}
              disabled={!value}
              className="w-full px-4 py-2 font-bold text-white bg-red-500 border-b-4 border-red-700 rounded hover:bg-red-400 hover:border-red-500 disabled:bg-gray-400 disabled:border-gray-500"
            >
              Stop Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

SetSchedule.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default SetSchedule;
