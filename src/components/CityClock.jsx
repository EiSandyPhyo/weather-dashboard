import React from "react";
import { useEffect, useState } from "react";

const CityClock = ({ timezone }) => {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const formattedTime = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: timezone,
      }).format(new Date());

      setLocalTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);
  //console.log(localTime);

  return <p>Local time: {localTime}</p>;
};

export default CityClock;
