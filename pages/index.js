import mqtt from "mqtt";
import Head from "next/head";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const mqttHost = "justfortest.my.id";
const protocol = "ws";
const port = "9001";
var suhuMQ;
var kelembabanMQ;
var relayB;
var client;
function Home() {
  const [suhu, setSuhu] = useState(0);
  const [food, setFood] = useState(null);
  const [tombol, setTombol] = useState(1);

  function startBroker() {
    const connectUrl = `${protocol}://${mqttHost}:${port}`;

    const options = {
      keepalive: 60,
      clientId: "client",
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    client = mqtt.connect(connectUrl, options);
  }

  function startSubscribe(topic) {
    client.subscribe(topic, { qos: 0 });
  }

  function getMessage() {
    client.on("message", (topic, message) => {
      if (topic == "/API/suhu") {
        suhuMQ = message.toString();
        console.log(typeof message);
        console.log(typeof suhuMQ);
      }
      if (topic == "/API/kelembaban") {
        kelembabanMQ = message.toString();
      }
      if (topic == "/API/relayBalik") {
        relayB = message.toString();
      }
      setSuhu(suhuMQ);
      setFood(kelembabanMQ);
    });
  }
  function pompaFromArduino() {
    if (relayB == "0") {
      setTombol(0);
    } else {
      setTombol(1);
    }
  }
  function handleTombol() {
    if (tombol == 0) {
      setTombol(1);
      client.publish("/testLampu", tombol.toString(), {
        qos: 0,
        retain: false,
      });
    } else {
      setTombol(0);
      client.publish("/testLampu", tombol.toString(), {
        qos: 0,
        retain: false,
      });
    }
  }

  useEffect(() => {
    startBroker();
    startSubscribe("/API/suhu");
    startSubscribe("/API/kelembaban");
    startSubscribe("/API/relayBalik");
    getMessage();
    pompaFromArduino();
  }, []);
  console.log(relayB);
  // client.subscribe("/agus/API", { qos: 0 });

  // variable

  // client.on("message", (topic, message) => {
  //   if (topic == "/agus/API") {
  //     pesan = message.toString();
  //   }
  //   console.log(pesan);
  // const data = JSON.parse(message.toString());

  // setNtu(data?.ntu);
  // setFood(data?.food);
  // setWaterLevel(data?.waterLevel);
  // });

  return (
    <div className="grid gap-2">
      <div className="px-4 py-8 mt-4 space-y-5 border rounded-xl">
        <h5 className="text-xl font-semibold text-center">
          Aquarium Water
          <br />
          Turbidity
        </h5>
        <div className="grid justify-center gap-4">
          <div className="flex justify-center gap-4">
            <div className="border-[10px] w-32 h-32 flex flex-col justify-center items-center rounded-full border-blue-300">
              <h5 className="text-3xl font-bold text-center">{suhu}</h5>
              <h6 className="text-sm text-center">NTU</h6>
            </div>
            <div className="border-[10px] w-32 h-32 flex flex-col justify-center items-center rounded-full border-blue-300">
              <h5 className="text-3xl font-bold text-center">{food ?? 0}</h5>
              <h6 className="text-sm text-center">WATER LEVEL</h6>
            </div>
          </div>
          {tombol == 0 ? (
            <button
              onClick={() => handleTombol()}
              className="px-4 py-2 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded hover:bg-blue-400 hover:border-blue-500"
            >
              On
            </button>
          ) : (
            <button
              onClick={() => handleTombol()}
              className="px-4 py-2 font-bold text-white bg-red-500 border-b-4 border-red-700 rounded hover:bg-red-400 hover:border-red-500"
            >
              Off
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Home;
